import { apiSlice } from '../api/apiSlice';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: 'create-product',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    getAllProductsInShop: builder.query({
      query: (id) => ({
        url: `all-products-shop/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: 'all-products',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getProduct: builder.query({
      query: (id) => ({
        url: `product/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    reviewProduct: builder.mutation({
      query: () => ({
        url: 'review-product',
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),
    deleteProductInShop: builder.mutation({
      query: (id) => ({
        url: `delete-shop-product/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useDeleteProductInShopMutation,
  useGetAllProductsInShopQuery,
  useGetAllProductsQuery,
  useGetProductQuery,
  useReviewProductMutation,
} = productApi;
