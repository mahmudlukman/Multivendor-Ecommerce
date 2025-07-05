import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetAllUserOrdersQuery } from "../../redux/features/order/orderApi";
import { RootState } from "../../types";

const TrackOrder = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { id } = useParams();
  
  // Define an Order type (adjust fields as needed)
  type Order = {
    _id: string;
    status: string;
    // add other fields if necessary
  };

  // Use RTK Query hook to fetch user orders
  const { data: orders, isLoading, error } = useGetAllUserOrdersQuery(user?._id, {
    skip: !user?._id, // Skip the query if user ID is not available
  });

  // Find the specific order by ID
  const data = orders && (orders as Order[]).find((item: Order) => item._id === id);

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
        <h1 className="text-[20px] text-red-500">Error loading order details</h1>
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

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      {data?.status === "Processing" ? (
        <h1 className="text-[20px]">Your Order is processing in shop.</h1>
      ) : data?.status === "Transferred to delivery partner" ? (
        <h1 className="text-[20px]">
          Your Order is on the way for delivery partner.
        </h1>
      ) : data?.status === "Shipping" ? (
        <h1 className="text-[20px]">
          Your Order is on the way with our delivery partner.
        </h1>
      ) : data?.status === "Received" ? (
        <h1 className="text-[20px]">
          Your Order is in your city. Our Delivery man will deliver it.
        </h1>
      ) : data?.status === "On the way" ? (
        <h1 className="text-[20px]">
          Our Delivery man is going to deliver your order.
        </h1>
      ) : data?.status === "Delivered" ? (
        <h1 className="text-[20px]">Your order is delivered!</h1>
      ) : data?.status === "Processing refund" ? (
        <h1 className="text-[20px]">Your refund is processing!</h1>
      ) : data?.status === "Refund Success" ? (
        <h1 className="text-[20px]">Your Refund is success!</h1>
      ) : (
        <h1 className="text-[20px]">Order status unknown</h1>
      )}
    </div>
  );
};

export default TrackOrder;