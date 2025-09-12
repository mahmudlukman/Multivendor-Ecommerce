import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  RootState,
  OrderData,
  User,
  ServerError,
} from "../../types";
import { useInitializePaymentMutation } from "../../redux/features/payment/paymentApi";
import { useCreateOrderMutation } from "../../redux/features/order/orderApi";

const Payment: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [initializePayment, { isLoading }] = useInitializePaymentMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  useEffect(() => {
    const orderDataStr = localStorage.getItem("latestOrder");
    if (orderDataStr) {
      try {
        const parsedOrderData: OrderData = JSON.parse(orderDataStr);
        // Validate required fields
        if (
          !parsedOrderData.cart ||
          parsedOrderData.totalPrice === undefined ||
          parsedOrderData.shippingAddress === undefined ||
          parsedOrderData.subTotalPrice === undefined ||
          parsedOrderData.shipping === undefined
        ) {
          throw new Error("Invalid order data: missing required fields");
        }

        // Ensure numeric values are actually numbers
        const sanitizedOrderData: OrderData = {
          ...parsedOrderData,
          _id: parsedOrderData._id,
          totalPrice: Number(parsedOrderData.totalPrice),
          subTotalPrice: Number(parsedOrderData.subTotalPrice),
          shipping: Number(parsedOrderData.shipping),
          discountPrice: parsedOrderData.discountPrice
            ? Number(parsedOrderData.discountPrice)
            : null,
          cart: parsedOrderData.cart,
          shippingAddress: parsedOrderData.shippingAddress,
          user: parsedOrderData.user,
        };

        // Verify numeric fields are not NaN
        if (
          isNaN(sanitizedOrderData.totalPrice) ||
          isNaN(sanitizedOrderData.subTotalPrice) ||
          isNaN(sanitizedOrderData.shipping) ||
          (sanitizedOrderData.discountPrice !== null &&
            isNaN(sanitizedOrderData.discountPrice))
        ) {
          throw new Error("Invalid order data: numeric fields are invalid");
        }

        setOrderData(sanitizedOrderData);
      } catch (err: unknown) {
        const serverError = err as ServerError;
        const errorMessage =
          serverError.data?.message ||
          serverError.message ||
          "Invalid order data";
        toast.error(errorMessage);
        navigate("/user/checkout");
      }
    } else {
      toast.error("No order data found");
      navigate("/user/checkout");
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (!orderData) {
      toast.error("No order data available");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to proceed with payment");
      navigate("/login");
      return;
    }

    try {
      // Step 1: Create the order first
      toast.loading("Creating order...");
      const createOrderResponse = await createOrder(orderData).unwrap();

      let orderId: string;
      // Handle array response (direct array of orders)
      if (Array.isArray(createOrderResponse) && createOrderResponse.length > 0 && createOrderResponse[0]._id) {
        orderId = createOrderResponse[0]._id;
      }
      // Handle object response ({ success, orders })
      else if (
        createOrderResponse.success &&
        createOrderResponse.orders &&
        createOrderResponse.orders.length > 0 &&
        createOrderResponse.orders[0]._id
      ) {
        orderId = createOrderResponse.orders[0]._id;
      } else {
        throw new Error("Failed to create order: invalid response");
      }

      toast.dismiss();

      // Step 2: Initialize payment with the created order ID
      toast.loading("Initializing payment...");
      const paymentPayload = {
        orderId,
        amount: orderData.totalPrice,
        redirect_url: `${window.location.origin}/payment/callback`,
      };

      console.log("Payment payload:", paymentPayload);

      const response = await initializePayment(paymentPayload).unwrap();
      toast.dismiss();

      if (response.success && response.paymentUrl) {
        // Clear localStorage since order is now created
        localStorage.removeItem("latestOrder");
        window.location.href = response.paymentUrl;
      } else {
        toast.error(response.message || "Failed to initialize payment");
        navigate("/user/checkout");
      }
    } catch (err: unknown) {
      toast.dismiss();
      console.error("Payment error:", err);
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Payment initialization failed";
      toast.error(errorMessage);
      navigate("/user/checkout");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            orderData={orderData}
            handlePayment={handlePayment}
            isLoading={isLoading}
            isCreatingOrder={isCreatingOrder}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

interface PaymentInfoProps {
  user: User | null;
  orderData: OrderData | null;
  handlePayment: () => void;
  isLoading: boolean;
  isCreatingOrder: boolean;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  user,
  orderData,
  handlePayment,
  isLoading,
  isCreatingOrder,
}) => {
  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "0.00";
    return Number(price).toFixed(2);
  };

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-semibold text-[#000000b1]">
        Pay with Flutterwave
      </h5>
      <div className="w-full flex border-b mt-4">
        <button
          className={`
            w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer
            bg-[#f63b60]! text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-semibold
            ${isLoading || isCreatingOrder ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={handlePayment}
          disabled={isLoading || isCreatingOrder}
        >
          {isLoading || isCreatingOrder ? "Processing..." : "Pay Now"}
        </button>
      </div>
      {orderData && (
        <div className="mt-4">
          <p className="text-[16px] font-normal text-[#000000a4]">
            Payment for Order: ₦{formatPrice(orderData.totalPrice)}
          </p>
          <p className="text-[16px] font-normal text-[#000000a4]">
            Shipping to: {orderData.shippingAddress.address1},{" "}
            {orderData.shippingAddress.city}
          </p>
          <p className="text-[16px] font-normal text-[#000000a4]">
            Customer: {user?.name || "Guest"}
          </p>
        </div>
      )}
    </div>
  );
};

interface CartDataProps {
  orderData: OrderData | null;
}

const CartData: React.FC<CartDataProps> = ({ orderData }) => {
  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "0.00";
    return Number(price).toFixed(2);
  };

  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-normal text-[#000000a4]">Subtotal:</h3>
        <h5 className="text-[18px] font-semibold">
          ₦{formatPrice(orderData?.subTotalPrice)}
        </h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-normal text-[#000000a4]">Shipping:</h3>
        <h5 className="text-[18px] font-semibold">
          ₦{formatPrice(orderData?.shipping)}
        </h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-normal text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-semibold">
          {orderData?.discountPrice
            ? `₦${formatPrice(orderData.discountPrice)}`
            : "-"}
        </h5>
      </div>
      <h5 className="text-[18px] font-semibold text-end pt-3">
        ₦{formatPrice(orderData?.totalPrice)}
      </h5>
    </div>
  );
};

export default Payment;