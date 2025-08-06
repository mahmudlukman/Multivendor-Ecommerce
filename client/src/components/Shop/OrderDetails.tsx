import { useState, useEffect } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetAllSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  useOrderRefundSuccessMutation,
} from "../../redux/features/order/orderApi";
import toast from "react-hot-toast";
import Loader from "../Layout/Loader";
import { SellerState, ServerError } from "../../types";
import { ORDER_STATUSES, OrderStatus } from "../../types/order";

const OrderDetails = () => {
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAllSellerOrdersQuery(seller?._id, {
    skip: !seller?._id,
  });

  const orders = (ordersData?.orders as OrderItem[]) || [];

  const [updateOrderStatus, { isLoading: isUpdatingOrder }] =
    useUpdateOrderStatusMutation();
  const [updateRefundStatus, { isLoading: isUpdatingRefund }] =
    useOrderRefundSuccessMutation();

  interface OrderItem {
    _id: string;
    cart: {
      images: { url: string }[];
      name: string;
      discountPrice: number;
      qty: number;
    }[];
    totalPrice: number;
    createdAt: string;
    shippingAddress: {
      address1: string;
      address2: string;
      country: string;
      city: string;
    };
    user?: {
      phoneNumber?: string;
    };
    paymentInfo?: {
      status?: string;
    };
    status: OrderStatus;
  }

  const data = orders?.find((item: OrderItem) => item._id === id);
  
  const [status, setStatus] = useState<OrderStatus | "">(data?.status || "");

  // Update status when data changes (after successful update)
  useEffect(() => {
    if (data?.status) {
      setStatus(data.status);
    }
  }, [data?.status]);

  const orderUpdateHandler = async () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    try {
      await updateOrderStatus({ id, status }).unwrap();
      toast.success("Order updated!");
      navigate("/shop/orders");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update order status!";
      toast.error(errorMessage);
    }
  };

  const refundOrderUpdateHandler = async () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    try {
      await updateRefundStatus({ id, status }).unwrap();
      toast.success("Order updated!");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update refund status!";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className='py-4 min-h-screen w-11/12 mx-auto'>
        <div className="text-red-500 text-center p-4">Error loading order</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='py-4 min-h-screen w-11/12 mx-auto'>
        <div className="text-center p-4">Order not found</div>
      </div>
    );
  }

  // Get available statuses based on current status
  const getAvailableStatuses = (): OrderStatus[] => {
    // If current status is refund-related, only show refund options
    if (data.status === ORDER_STATUSES.PROCESSING_REFUND) {
      return [
        ORDER_STATUSES.REFUND_SUCCESS,
        ORDER_STATUSES.REFUND_REJECTED,
      ];
    }
    
    // If current status is already a final refund status, show no options
    if (data.status === ORDER_STATUSES.REFUND_SUCCESS || 
        data.status === ORDER_STATUSES.REFUND_REJECTED) {
      return [];
    }
    
    // For all other statuses, show all delivery-related statuses
    return [
      ORDER_STATUSES.PROCESSING,
      ORDER_STATUSES.TRANSFERRED_TO_DELIVERY_PARTNER,
      ORDER_STATUSES.SHIPPING,
      ORDER_STATUSES.RECEIVED,
      ORDER_STATUSES.ON_THE_WAY,
      ORDER_STATUSES.DELIVERED,
      ORDER_STATUSES.PROCESSING_REFUND, // Allow refund to be initiated from any delivery status
    ];
  };

  // Include current status in the options so it appears as selected
  const availableStatuses = getAvailableStatuses();

  return (
    <div className='py-4 min-h-screen w-11/12 mx-auto'>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/shop/orders">
          <div
            className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]'
          >
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      <br />
      <br />
      {data?.cart.map(
        (
          item: {
            images: { url: string }[];
            name: string;
            discountPrice: number;
            qty: number;
          },
          index: number
        ) => (
          <div key={index} className="w-full flex items-start mb-5">
            <img
              src={
                item.images && item.images.length > 0
                  ? item.images[0].url
                  : "https://placehold.co/600x400"
              }
              alt=""
              className="w-[80px] h-[80px]"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                ₦{item.discountPrice} x {item.qty}
              </h5>
            </div>
          </div>
        )
      )}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>₦{data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address1 +
              (data?.shippingAddress.address2
                ? " " + data?.shippingAddress.address2
                : "")}
          </h4>
          <h4 className="text-[20px]">{data?.shippingAddress.country}</h4>
          <h4 className="text-[20px]">{data?.shippingAddress.city}</h4>
          <h4 className="text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
      <div className="mt-2">
        {availableStatuses.length > 0 && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-[200px] border h-[35px] rounded-[5px]"
          >
            {availableStatuses.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
      <div
        className={`w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px] ${
          isUpdatingOrder || isUpdatingRefund
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={
          isUpdatingOrder || isUpdatingRefund
            ? undefined
            : data.status === ORDER_STATUSES.PROCESSING_REFUND
            ? refundOrderUpdateHandler
            : orderUpdateHandler
        }
      >
        {isUpdatingOrder || isUpdatingRefund ? "Updating..." : "Update Status"}
      </div>
    </div>
  );
};

export default OrderDetails;