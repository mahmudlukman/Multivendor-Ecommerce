import { apiSlice } from '../api/apiSlice';

export const couponCodeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCouponCode: builder.mutation({
      query: (data) => ({
        url: 'create-coupon-code',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    getCoupon: builder.query({
      query: (id) => ({
        url: `coupon/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getCouponValue: builder.query({
      query: (name) => ({
        url: `get-coupon-value/${name}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    deleteCoupon: builder.mutation({
      query: (name) => ({
        url: `get-coupon-value/${name}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useCreateCouponCodeMutation,
  useDeleteCouponMutation,
  useGetCouponQuery,
  useGetCouponValueQuery
} = couponCodeApi;
