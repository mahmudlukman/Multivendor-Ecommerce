import { useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetAllUserOrdersQuery,
  useOrderRefundRequestMutation,
} from "../redux/features/order/orderApi";
import { useReviewProductMutation } from "../redux/features/product/productApi";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import toast from "react-hot-toast";
import { RootState, ServerError } from "../types";
import { ORDER_STATUSES, OrderStatus } from "../types/order";

interface CartItem {
  _id: string;
  name: string;
  images: { url: string }[];
  discountPrice: number;
  qty: number;
  isReviewed?: boolean;
}

interface OrderItem {
  _id: string;
  cart: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: {
    address1: string;
    address2?: string;
    country: string;
    city: string;
  };
  user: {
    phoneNumber?: string;
  };
  paymentInfo?: {
    status?: string;
  };
}

const UserOrderDetails = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [rating, setRating] = useState(1);
  const { id } = useParams();

  // RTK Query hooks
  const {
    data: ordersData,
    isLoading,
    error,
    refetch: refetchOrders,
  } = useGetAllUserOrdersQuery(user?._id, {
    skip: !user?._id,
  });

  const orders = ordersData?.orders || [];

  const [orderRefundRequest, { isLoading: isRefundLoading }] =
    useOrderRefundRequestMutation();
  const [reviewProduct, { isLoading: isReviewLoading }] =
    useReviewProductMutation();

  const data = orders.find((item: OrderItem) => item._id === id);

  const reviewHandler = async () => {
    if (!selectedItem || !id) return;

    try {
      await reviewProduct({
        user,
        rating,
        comment,
        productId: selectedItem._id,
        orderId: id,
      }).unwrap();

      toast.success("Review submitted successfully");
      refetchOrders();
      setComment("");
      setRating(1);
      setOpen(false);
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to submit review";
      toast.error(errorMessage);
    }
  };

  const refundHandler = async () => {
    if (!id) {
      toast.error("Order ID is missing");
      return;
    }

    if (window.confirm("Are you sure you want to request a refund for this order?")) {
      try {
        await orderRefundRequest({
          id,
          status: ORDER_STATUSES.PROCESSING_REFUND,
        }).unwrap();
        toast.success("Refund request submitted successfully");
        refetchOrders();
      } catch (err: unknown) {
        const serverError = err as ServerError;
        const errorMessage =
          serverError.data?.message ||
          serverError.message ||
          "Failed to submit refund request";
        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className='py-4 min-h-screen w-11/12 mx-auto'>
        <div className="w-full flex items-center justify-center">
          <h1 className="text-[20px]">Loading order details...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-4 min-h-screen w-11/12 mx-auto'>
        <div className="w-full flex items-center justify-center">
          <h1 className="text-[20px] text-red-500">
            Error loading order details
          </h1>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='py-4 min-h-screen w-11/12 mx-auto'>
        <div className="w-full flex items-center justify-center">
          <h1 className="text-[20px]">Order not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className='py-4 min-h-screen w-11/12 mx-auto'>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data._id.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data.createdAt.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Order items */}
      <br />
      <br />
      {data.cart.map((item: CartItem, index: number) => (
        <div key={index} className="w-full flex items-start mb-5">
          <img
            src={item.images[0]?.url || "https://placehold.co/80x80"}
            alt={item.name}
            className="w-[80px] h-[80px]"
          />
          <div className="w-full">
            <h5 className="pl-3 text-[20px]">{item.name}</h5>
            <h5 className="pl-3 text-[20px] text-[#00000091]">
              ₦{item.discountPrice} x {item.qty}
            </h5>
          </div>
          {!item.isReviewed && data.status === ORDER_STATUSES.DELIVERED ? (
            <div
              className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer text-white'
              onClick={() => {
                setOpen(true);
                setSelectedItem(item);
              }}
            >
              Write a review
            </div>
          ) : null}
        </div>
      ))}

      {/* Review popup */}
      {open && selectedItem && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-white shadow-sm rounded-md p-3">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-medium font-Poppins text-center">
              Give a Review
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={selectedItem.images[0]?.url || "https://placehold.co/80x80"}
                alt={selectedItem.name}
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[20px]">{selectedItem.name}</div>
                <h4 className="pl-3 text-[20px]">
                  ₦{selectedItem.discountPrice} x {selectedItem.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* Ratings */}
            <h5 className="pl-3 text-[20px] font-medium">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-medium">
                Write a comment
                <span className="ml-1 font-normal text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                cols={20}
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? Write your expression about it!"
                className="mt-2 w-[95%] border p-2 outline-hidden"
              />
            </div>
            <div
              className={`w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer text-white text-[20px] ml-3 ${
                isReviewLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={rating > 0 && !isReviewLoading ? reviewHandler : () => {}}
            >
              {isReviewLoading ? "Submitting..." : "Submit"}
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>₦{data.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-semibold">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {data.shippingAddress.address1 +
              (data.shippingAddress.address2
                ? " " + data.shippingAddress.address2
                : "")}
          </h4>
          <h4 className="text-[20px]">{data.shippingAddress.country}</h4>
          <h4 className="text-[20px]">{data.shippingAddress.city}</h4>
          <h4 className="text-[20px]">{data.user?.phoneNumber || "N/A"}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data.paymentInfo?.status ? data.paymentInfo.status : "Not Paid"}
          </h4>
          <br />
          {[ORDER_STATUSES.PROCESSING, ORDER_STATUSES.PAID].includes(
            data.status
          ) && (
            <div
              className={`w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer text-white ${
                isRefundLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={isRefundLoading ? undefined : refundHandler}
            >
              {isRefundLoading ? "Processing..." : "Request Refund"}
            </div>
          )}
        </div>
      </div>
      <br />
      <Link to="/">
        <div className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer text-white'>Send Message</div>
      </Link>
      <br />
      <br />
    </div>
  );
};

export default UserOrderDetails;