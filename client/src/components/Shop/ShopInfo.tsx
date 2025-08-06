import { FC } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetShopQuery } from "../../redux/features/shop/shopApi";
import { useGetAllProductsInShopQuery } from "../../redux/features/product/productApi";
import { useSellerLogoutMutation } from "../../redux/features/sellerAuth/sellerAuthApi";
import Loader from "../Layout/Loader";
import { ProductData, ServerError, Shop } from "../../types";
import toast from "react-hot-toast";

interface ShopInfoProps {
  isOwner: boolean;
  shop?: Shop;
}

const ShopInfo: FC<ShopInfoProps> = ({ isOwner, shop }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: shopData,
    isLoading: isShopLoading,
    error: shopError,
  } = useGetShopQuery(id, {
    skip: !!shop,
  });

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useGetAllProductsInShopQuery(id);

  const products = productsData?.products || [];

  // Use provided shop data or fetched shop data
  const currentShop = shop || shopData?.shop;

  const [sellerLogout, { isLoading: isLogoutLoading }] =
    useSellerLogoutMutation();

  const logoutHandler = async () => {
    try {
      await sellerLogout({}).unwrap();
      navigate("/");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to log out!";
      toast.error(errorMessage);
    }
  };

  // Loading state
  if (isShopLoading || isProductsLoading || (!currentShop && !shopError)) {
    return <Loader />;
  }

  // Error state
  if (shopError || productsError) {
    return (
      <div className="w-full py-5 text-center">
        <p className="text-red-500">Error loading shop information!</p>
      </div>
    );
  }

  // Calculate ratings
  const totalReviewsLength =
    products?.reduce(
      (acc: number, product: ProductData) => acc + product.reviews.length,
      0
    ) || 0;
  const totalRatings =
    products?.reduce(
      (acc: number, product: ProductData) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    ) || 0;
  const averageRating =
    totalReviewsLength > 0 ? (totalRatings / totalReviewsLength).toFixed(1) : 0;

  return (
    <div>
      <div className="w-full py-5">
        <div className="w-full flex item-center justify-center">
          <img
            src={currentShop?.avatar?.url}
            alt={currentShop?.name}
            className="w-[150px] h-[150px] object-cover rounded-full"
          />
        </div>
        <h3 className="text-center py-2 text-[20px]">{currentShop?.name}</h3>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Description</h5>
        <h4 className="text-[#000000a6]">{currentShop?.description}</h4>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="text-[#000000a6]">{currentShop?.address}</h4>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="text-[#000000a6]">{currentShop?.phoneNumber}</h4>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-[#000000a6]">{products?.length || 0}</h4>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Shop Ratings</h5>
        <h4 className="text-[#000000b0]">{averageRating}/5</h4>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Joined On</h5>
        <h4 className="text-[#000000b0]">
          {currentShop?.createdAt
            ? new Date(currentShop.createdAt).toLocaleDateString()
            : "N/A"}
        </h4>
      </div>

      {isOwner && (
        <div className="py-3 px-4">
          <Link to="/shop/settings">
            <div
              className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer !w-full !h-[42px] !rounded-[5px]'
            >
              <span className="text-white">Edit Shop</span>
            </div>
          </Link>
          <div
            className={`w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer !w-full !h-[42px] !rounded-[5px] cursor-pointer ${
              isLogoutLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={isLogoutLoading ? undefined : logoutHandler}
          >
            <span className="text-white">
              {isLogoutLoading ? "Logging out..." : "Log Out"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopInfo;
