import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetAllUserOrdersQuery } from "../../redux/features/order/orderApi";
import { RootState } from "../../types";
import { ORDER_STATUSES, OrderStatus } from "../../types/order";

const TrackOrder = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { id } = useParams();

  type Order = {
    _id: string;
    status: OrderStatus;
  };

  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAllUserOrdersQuery(user?._id, {
    skip: !user?._id,
  });

  const orders = (ordersData?.orders as Order[]) || [];

  const data =
    orders && (orders as Order[]).find((item: Order) => item._id === id);

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-[20px]">Loading order details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-[20px] text-red-500">
          Error loading order details
        </h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-[20px]">Order not found</h1>
      </div>
    );
  }

  const statusMessages: Record<OrderStatus, string> = {
    [ORDER_STATUSES.PROCESSING]: "Your order is being processed in the shop.",
    [ORDER_STATUSES.PENDING_PAYMENT]:
      "Your order is awaiting payment confirmation.",
    [ORDER_STATUSES.PAID]: "Your order payment has been confirmed.",
    [ORDER_STATUSES.PAYMENT_FAILED]:
      "Payment for your order failed. Please try again.",
    [ORDER_STATUSES.TRANSFERRED_TO_DELIVERY_PARTNER]:
      "Your order has been transferred to our delivery partner.",
    [ORDER_STATUSES.SHIPPING]:
      "Your order is on the way with our delivery partner.",
    [ORDER_STATUSES.RECEIVED]:
      "Your order is in your city. Our delivery person will deliver it soon.",
    [ORDER_STATUSES.ON_THE_WAY]:
      "Our delivery person is on the way to deliver your order.",
    [ORDER_STATUSES.DELIVERED]: "Your order has been delivered!",
    [ORDER_STATUSES.PROCESSING_REFUND]: "Your refund is being processed.",
    [ORDER_STATUSES.REFUND_SUCCESS]:
      "Your refund has been successfully processed!",
    [ORDER_STATUSES.REFUND_REJECTED]:
      "Your refund request was rejected. Please contact support if you have questions.",
  };

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <h1 className="text-[20px]">
        {statusMessages[data.status] || `Unknown order status: ${data.status}`}
      </h1>
    </div>
  );
};

export default TrackOrder;
