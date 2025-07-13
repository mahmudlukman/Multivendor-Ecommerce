export const ORDER_STATUSES = {
  PROCESSING: "Processing",
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Paid",
  PAYMENT_FAILED: "Payment Failed",
  TRANSFERRED_TO_DELIVERY_PARTNER: "Transferred to delivery partner",
  SHIPPING: "Shipping",
  RECEIVED: "Received",
  ON_THE_WAY: "On the way",
  DELIVERED: "Delivered",
  PROCESSING_REFUND: "Processing refund",
  REFUND_SUCCESS: "Refund Success",
  REFUND_REJECTED: "Refund Rejected"
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];