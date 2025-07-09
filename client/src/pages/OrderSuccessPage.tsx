// import Footer from "../components/Layout/Footer";
// import Header from "../components/Layout/Header";
// import Lottie from "react-lottie";
// import animationData from "../Assests/animations/107043-success.json";

// const OrderSuccessPage = () => {
//   return (
//     <div>
//       <Header activeHeading={0} />
//       <Success />
//       <Footer />
//     </div>
//   );
// };

// const Success = () => {
//   const defaultOptions = {
//     loop: false,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };
//   return (
//     <div>
//       <Lottie options={defaultOptions} width={300} height={300} />
//       <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
//         Your order is successful 😍
//       </h5>
//       <br />
//       <br />
//     </div>
//   );
// };

// export default OrderSuccessPage;

import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyPaymentQuery, VerifyPaymentResponse } from '../redux/features/payment/paymentApi';
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/107043-success.json";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Parse URL parameters
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      status: params.get('status'),
      tx_ref: params.get('tx_ref'),
      transaction_id: params.get('transaction_id')
    };
  };

  const { status, tx_ref, transaction_id } = getQueryParams();

  // Use the Redux query hook for payment verification
  const { data, error, isLoading } = useVerifyPaymentQuery(
    {
      status: status || "",
      tx_ref: tx_ref || "",
      transaction_id: transaction_id || "",
    },
    {
      skip: !status || !tx_ref || !transaction_id,
    }
  );

  // Handle redirection based on verification result
  useEffect(() => {
    if (data) {
      if (data.success && data.orderId) {
        // Stay on success page - verification was successful
        return;
      } else {
        // Redirect to failure page
        navigate('/payment/failure');
      }
    }
  }, [data, navigate]);

  // Handle verification error
  useEffect(() => {
    if (error) {
      console.error('Payment verification error:', error);
      navigate('/payment/failure');
    }
  }, [error, navigate]);

  return (
    <div>
      <Header activeHeading={0} />
      <PaymentContent 
        isLoading={isLoading}
        isMounted={isMounted}
        status={status}
        tx_ref={tx_ref}
        transaction_id={transaction_id}
        data={data}
        error={error}
      />
      <Footer />
    </div>
  );
};

interface PaymentContentProps {
  isLoading: boolean;
  isMounted: boolean;
  status: string | null;
  tx_ref: string | null;
  transaction_id: string | null;
  data: VerifyPaymentResponse | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

const PaymentContent: FC<PaymentContentProps> = ({ isLoading, isMounted, status, tx_ref, transaction_id, data, error }) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Show initial loading state until component is mounted
  if (!isMounted || (!status || !tx_ref || !transaction_id)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
        <div className="animate-pulse">
          <div className="w-[300px] h-[300px] bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
        <p className="text-center text-[16px] text-[#000000a1] mt-4">
          Initializing payment verification...
        </p>
      </div>
    );
  }

  // Show verification loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-center text-[20px] text-[#000000a1] mb-4">
          Verifying Payment...
        </h3>
        <p className="text-center text-[16px] text-[#000000a1]">
          Please wait while we confirm your payment
        </p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
        <div className="text-red-500 text-4xl mb-4">❌</div>
        <h3 className="text-center text-[20px] text-red-600 mb-4">
          Payment Verification Failed
        </h3>
        <p className="text-center text-[16px] text-[#000000a1] mb-4">
          {error?.data?.message || error?.message || 'An error occurred during payment verification'}
        </p>
        <p className="text-center text-[14px] text-[#000000a1]">
          Redirecting to failure page...
        </p>
      </div>
    );
  }

  // Show success state when verification is complete and successful
  if (data && data.success) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Lottie options={defaultOptions} width={300} height={300} />
        <h5 className="text-center mb-4 text-[25px] text-[#000000a1]">
          Your order is successful 😍
        </h5>
        {data.orderId && (
          <p className="text-center text-[16px] text-[#000000a1] mb-4">
            Order ID: {data.orderId}
          </p>
        )}
        {data.order && (
          <div className="text-center text-[14px] text-[#000000a1] mb-4">
            <p>Total Amount: ₦{data.order.totalPrice}</p>
            <p>Status: {data.order.status}</p>
            {data.order.paidAt && (
              <p>Paid At: {new Date(data.order.paidAt).toLocaleString()}</p>
            )}
          </div>
        )}
        <br />
        <br />
      </div>
    );
  }

  // Default loading state
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
      <div className="animate-pulse">
        <div className="w-[300px] h-[300px] bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
