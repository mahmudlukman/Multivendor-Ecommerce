import { FC } from 'react';
import styles from '../../styles/styles';
import CountDown from './CountDown';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  useAddToCartMutation,
  useGetCartQuery,
} from '../../redux/features/cart/cartApi';
import { CartItem, EventData, ServerError } from '../../types';

interface EventCardProps {
  active: boolean;
  data: EventData;
}

const EventCard: FC<EventCardProps> = ({ active, data }) => {
  const { data: cartItems } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();

  const addToCartHandler = async (item: EventData) => {
    const isItemExists = cartItems?.find((i) => i._id === item._id);
    if (isItemExists) {
      toast.error('Item already in cart!');
      return;
    }
    if (item.stock < 1) {
      toast.error('Product stock limited!');
      return;
    }

    const cartData: CartItem = {
      _id: item._id,
      name: item.name,
      images: item.images,
      discountPrice: item.discountPrice,
      qty: 1,
      shopId: item.shopId,
      isReviewed: false,
      description: item.description,
      stock: item.stock,
    };

    try {
      await addToCart(cartData).unwrap();
      toast.success('Item added to cart successfully!');
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        'Failed to add item to cart!';
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`w-full block bg-white rounded-lg ${
        active ? 'unset' : 'mb-12'
      } lg:flex p-2`}
    >
      <div className="w-full lg:w-[50%] m-auto">
        <img
          src={data.images[0]?.url || 'https://via.placeholder.com/300'}
          alt={data.name}
          className="w-full h-[170px] object-cover rounded-[4px]"
        />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data.name}</h2>
        <p>{data.description.slice(0, 100)}...</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            {data.originalPrice !== undefined ? (
              <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
                ₦{data.originalPrice.toFixed(2)}
              </h5>
            ) : null}
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              ₦{data.discountPrice.toFixed(2)}
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data.sold_out || 0} sold
          </span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center">
          <Link to={`/event/${data._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
          <div
            className={`${styles.button} text-[#fff] ml-5`}
            onClick={() => addToCartHandler(data)}
            role="button"
            aria-label={`Add ${data.name} to cart`}
          >
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;