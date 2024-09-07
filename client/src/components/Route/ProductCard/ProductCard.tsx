import { useState, useEffect, FC } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { toast } from "react-hot-toast";
import { 
  useAddToCartMutation, 
  useGetCartQuery 
} from "../../../redux/features/cart/cartApi";
import {
  useAddToWhishListMutation,
  useRemoveWhishListMutation,
  useGetWhishListQuery,
} from "../../../redux/features/wishlist/wishlistApi";

interface ProductData {
  _id: string;
  name: string;
  description: string;
  discountPrice: number;
  originalPrice?: number;
  stock: number;
  images: { url: string }[];
  shop: {
    _id: string;
    name: string;
  };
  ratings: number;
}

interface Props {
  setOpen: (open: boolean) => void;
  data: ProductData;
}

// Define types for cart and wishlist items
interface CartItem extends ProductData {
  qty: number;
}

type WishlistItem = ProductData;


const ProductDetailsCard: FC<Props> = ({ setOpen, data }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  const { data: cartData } = useGetCartQuery<{ data: CartItem[] }>();
  const { data: wishlistData } = useGetWhishListQuery<{ data: WishlistItem[] }>({});
  const [addToCart] = useAddToCartMutation();
  const [addToWishlist] = useAddToWhishListMutation();
  const [removeFromWishlist] = useRemoveWhishListMutation();

  const handleMessageSubmit = () => {
    // Implement message submission logic
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = async (id: string) => {
    const isItemExists = cartData && cartData.find((i: CartItem) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        try {
          await addToCart(cartData).unwrap();
          toast.success("Item added to cart successfully!");
        } catch (error) {
          toast.error("Failed to add item to cart");
        }
      }
    }
  };

  useEffect(() => {
    if (wishlistData && wishlistData.find((i: WishlistItem) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlistData, data._id]);

  const removeFromWishlistHandler = async (data: ProductData) => {
    setClick(!click);
    try {
      await removeFromWishlist(data._id).unwrap();
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const addToWishlistHandler = async (data: ProductData) => {
    setClick(!click);
    try {
      await addToWishlist(data).unwrap();
    } catch (error) {
      toast.error("Failed to add to wishlist");
    }
  };

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img src={data.images[0]?.url} alt="" />
                <div className="flex">
                  <Link to={`/shop/preview/${data.shop._id}`} className="flex">
                    <img
                      src={data.images[0]?.url}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                    <div>
                      <h3 className={styles.shop_name}>
                        {data.shop.name}
                      </h3>
                      <h5 className="pb-3 text-[15px]">{data.ratings} Ratings</h5>
                    </div>
                  </Link>
                </div>
                <div
                  className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-[#fff] flex items-center">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
                <h5 className="text-[16px] text-[red] mt-5">(50) Sold out</h5>
              </div>

              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>

                <div className="flex pt-3">
                  <h4 className={styles.productDiscountPrice}>
                    {data.discountPrice}$
                  </h4>
                  <h3 className={styles.price}>
                    {data.originalPrice ? data.originalPrice + "$" : null}
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
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-[#fff] flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;