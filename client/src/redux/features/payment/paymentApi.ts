import { apiSlice } from "../api/apiSlice";

interface InitializePaymentRequest {
  orderId: string; // Changed from eventId to orderId
  amount: number;
  redirect_url: string;
}

interface InitiatePaymentResponse {
  success: boolean;
  paymentUrl?: string;
  orderId: string;
  tx_ref?: string;
  message?: string;
}

interface VerifyPaymentRequest {
  status: string;
  tx_ref: string;
  transaction_id: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  order?: {
    _id: string;
    paymentId: string;
    totalPrice: number; // Changed from totalAmount
    user: string;
    status: "pending_payment" | "paid" | "payment_failed" | "refunded";
    paymentInfo?: {
      id?: string;
      status?: string;
      type?: string;
    };
    paidAt?: string;
  };
}

interface PaymentStatusResponse {
  success: boolean;
  paymentStatus: string;
  orderStatus: string;
  paymentId?: string;
  paidAt?: string;
}

interface RefundPaymentRequest {
  orderId: string;
  amount?: number;
}

interface RefundPaymentResponse {
  success: boolean;
  message: string;
  refundData?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    reference: string;
    created_at: string;
    [key: string]: unknown;
  };
}

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initializePayment: builder.mutation<
      InitiatePaymentResponse,
      InitializePaymentRequest
    >({
      query: (body) => ({
        url: "initialize-payment",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    verifyPayment: builder.query<VerifyPaymentResponse, VerifyPaymentRequest>({
      query: ({ status, tx_ref, transaction_id }) => ({
        url: "verify-payment",
        method: "GET",
        params: {
          status,
          tx_ref,
          transaction_id,
        },
      }),
      providesTags: (result) => [
        { type: "Order", id: result?.order?._id },
        { type: "Order", id: "LIST" },
      ],
    }),

    getPaymentStatus: builder.query<PaymentStatusResponse, { orderId: string }>(
      {
        query: ({ orderId }) => ({
          url: `payment-status/${orderId}`,
          method: "GET",
          credentials: "include",
        }),
        providesTags: (result, error, { orderId }) => [
          { type: "Order", id: orderId },
        ],
      }
    ),

    refundPayment: builder.mutation<
      RefundPaymentResponse,
      RefundPaymentRequest
    >({
      query: (data) => ({
        url: "refund-payment",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useInitializePaymentMutation,
  useVerifyPaymentQuery,
  useGetPaymentStatusQuery,
  useRefundPaymentMutation,
} = paymentApi;
