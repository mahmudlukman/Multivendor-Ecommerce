import { apiSlice } from '../api/apiSlice';

export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWhishList: builder.query({
      query: () => 'wishlist',
    }),
    addToWhishList: builder.mutation({
      query: (item) => ({
        url: 'wishlist',
        method: 'POST',
        body: item,
      }),
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('wishlistItems', JSON.stringify(data));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    removeWhishList: builder.mutation({
      query: (id) => ({
        url: `wishlist/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const wishlistItems = JSON.parse(
            localStorage.getItem('wishlistItems') || '[]'
          );
          const updatedWishlistItems = wishlistItems.filter(
            (item: any) => item._id !== id
          );
          localStorage.setItem(
            'wishlistItems',
            JSON.stringify(updatedWishlistItems)
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useAddToWhishListMutation,
  useGetWhishListQuery,
  useRemoveWhishListMutation,
} = wishlistApi;
