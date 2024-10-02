import { useEffect, useMemo, useState } from 'react';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllProductsInShopQuery } from '../../redux/features/product/productApi';
import styles from '../../styles/styles';
import {
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
} from '../../redux/features/wishlist/wishlistApi';
import { useAddToCartMutation } from '../../redux/features/cart/cartApi';
import { useCreateConversationMutation } from '../../redux/features/conversation/conversationApi';
import { toast } from 'react-hot-toast';
import Ratings from './Ratings';
import { useSelector } from 'react-redux';

interface Image {
  url: string;
}

interface Shop {
  _id: string;
  name: string;
  avatar: Image;
  description: string;
  createdAt: string;
}

interface Review {
  user: {
    name: string;
    avatar: Image;
  };
  rating: number;
  comment: string;
}

interface WishlistItem {
  _id: string;
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  images: Image[];
  shop: Shop;
  discountPrice: number;
  originalPrice?: number;
  stock: number;
  reviews: Review[];
  ratings: number;
  wishlist: WishlistItem[];
}

interface ProductDetailsProps {
  data: ProductData;
}

interface RootState {
  auth: {
    user: {
      _id: string;
      id: string; // Adjust according to your user properties
      name: string;
      // Add other user properties as needed
    } | null; // If user can be null
    // Add other properties of auth if any
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ data }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: shopProducts } = useGetAllProductsInShopQuery(data?.shop._id);
  const [addToWishList] = useAddToWishListMutation();
  const [removeFromWishList] = useRemoveFromWishListMutation();
  const [addToCart] = useAddToCartMutation();
  const [createNewConversation] = useCreateConversationMutation();

  // useEffect(() => {
  //   if (data && data.wishlist && data.wishlist.find((i: any) => i._id === data._id)) {
  //     setClick(true);
  //   } else {
  //     setClick(false);
  //   }
  // }, [data]);

  useEffect(() => {
    if (data && data.wishlist && Array.isArray(data.wishlist)) {
      if (data.wishlist.some((item) => item._id === data._id)) {
        setClick(true);
      } else {
        setClick(false);
      }
    } else {
      setClick(false);  // Default state when data is not available
    }
  }, [data]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data: ProductData) => {
    setClick(!click);
    removeFromWishList(data);
  };

  const addToWishlistHandler = (data: ProductData) => {
    setClick(!click);
    addToWishList(data);
  };

  const addToCartHandler = (id: string) => {
    if (data.stock < 1) {
      toast.error('Product stock limited!');
    } else {
      const cartData = { ...data, id, qty: count };
      addToCart(cartData)
        .unwrap()
        .then(() => toast.success('Item added to cart successfully!'))
        .catch(() => toast.error('Failed to add item to cart'));
    }
  };

  const totalReviewsLength = useMemo(() => {
    return (
      shopProducts?.products?.reduce(
        (acc: number, product: ProductData) => acc + product.reviews.length,
        0
      ) || 0
    );
  }, [shopProducts]);

  const averageRating = useMemo(() => {
    if (!shopProducts || shopProducts.products.length === 0) return 0;
    const totalRating = shopProducts.products.reduce(
      (acc: number, product: ProductData) =>
        acc +
        product.reviews.reduce(
          (sum: number, review: Review) => sum + review.rating,
          0
        ),
      0
    );
    return totalRating / totalReviewsLength;
  }, [shopProducts, totalReviewsLength]);

  const handleMessageSubmit = async () => {
    if (user) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      try {
        const res = await createNewConversation({
          groupTitle,
          userId,
          sellerId,
        }).unwrap();
        navigate(`/inbox?${res.conversation._id}`);
      } catch (error) {
        const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'An error occurred';
        toast.error(errorMessage);
      }
    } else {
      toast.error('Please login to create a conversation');
    }
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${data && data.images[select]?.url}`}
                  alt=""
                  className="w-[80%]"
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                      key={index}
                        className={`${
                          select === index ? 'border' : 'null'
                        } cursor-pointer`}
                      >
                        <img
                          src={`${i?.url}`}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                  <div
                    className={`${
                      select === 1 ? 'border' : 'null'
                    } cursor-pointer`}
                  ></div>
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + '$' : null}
                  </h3>
                </div>

                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? 'red' : '#333'}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        color={click ? 'red' : '#333'}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating}/5) Ratings
                    </h5>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
            shopProducts={shopProducts || []}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

interface ProductDetailsInfoProps {
  data: ProductData;
  shopProducts: ProductData[];
  totalReviewsLength: number;
  averageRating: number;
}

const ProductDetailsInfo: React.FC<ProductDetailsInfoProps> = ({
  data,
  shopProducts,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              'text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]'
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              'text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]'
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              'text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]'
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item) => (
              <div className="w-full flex my-2">
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>No Reviews have for this product!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.shop?.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="pb-2 text-[15px]">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{' '}
                <span className="font-[500]">
                  {data.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{' '}
                <span className="font-[500]">{shopProducts.length}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{' '}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to="/">
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
