import { useState, FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetAllProductsInShopQuery } from "../../redux/features/product/productApi";
import { useGetShopEventsQuery } from "../../redux/features/event/eventApi";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import Loader from "../Layout/Loader";
import { ProductData, Shop } from "../../types";

interface ShopInfoProps {
  isOwner: boolean;
  shop?: Shop;
}

const ShopProfileData: FC<ShopInfoProps> = ({ isOwner }) => {
  const { id } = useParams();
  const [active, setActive] = useState(1);
  const [open, setOpen] = useState(false);

  // Fetch shop products
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useGetAllProductsInShopQuery(id);

  const products = productsData?.products || [];

  // Fetch shop events
  const {
    data: events,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useGetShopEventsQuery(id);

  // Extract all reviews from products
  const allReviews = products
    ? products.map((product: ProductData) => product.reviews).flat()
    : [];

  // Loading state for the active tab
  const isLoading =
    (active === 1 && isProductsLoading) || (active === 2 && isEventsLoading);

  // Error state for the active tab
  const hasError =
    (active === 1 && productsError) || (active === 2 && eventsError);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 2 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Running Events
            </h5>
          </div>

          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/shop/dashboard">
                <div className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer !rounded-[4px] h-[42px]'>
                  <span className="text-[#fff]">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />

      {/* Loading state */}
      {isLoading && (
        <div className="w-full flex justify-center py-10">
          <Loader />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="w-full text-center py-10">
          <p className="text-red-500">Error loading data</p>
        </div>
      )}

      {/* Shop Products Tab */}
      {active === 1 && !isProductsLoading && !productsError && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products && products.length > 0 ? (
            products.map((product: ProductData, index: number) => (
              <ProductCard
                data={product}
                key={index}
                isShop={true}
                open={open}
                setOpen={setOpen}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h5 className="text-[18px] text-gray-500">
                No products available for this shop!
              </h5>
            </div>
          )}
        </div>
      )}

      {/* Running Events Tab */}
      {active === 2 && !isEventsLoading && !eventsError && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {events && events.length > 0 ? (
              events.map((event: ProductData, index: number) => (
                <ProductCard
                  data={event}
                  key={index}
                  isShop={true}
                  isEvent={true}
                  open={open}
                  setOpen={setOpen}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <h5 className="text-[18px] text-gray-500">
                  No events available for this shop!
                </h5>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shop Reviews Tab */}
      {active === 3 && (
        <div className="w-full">
          {allReviews && allReviews.length > 0 ? (
            allReviews.map((item: {
              user: { name: string; avatar?: { url?: string } };
              rating: number;
              comment?: string;
              createdAt?: string;
            }, index: number) => (
              <div key={index} className="w-full flex my-4">
                <img
                  src={item.user.avatar?.url}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  alt={item.user.name}
                />
                <div className="pl-2">
                  <div className="flex w-full items-center">
                    <h1 className="font-[600] pr-2">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                  <p className="text-[#000000a7] text-[14px]">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <h5 className="text-[18px] text-gray-500">
                No reviews available for this shop!
              </h5>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
