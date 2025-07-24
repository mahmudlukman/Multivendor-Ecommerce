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
      invalidatesTags: [{type:'Product', id: 'LIST'}],
    }),
    getAllProductsInShop: builder.query({
      query: (id) => ({
        url: `all-products-shop/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: [{type:'Product', id: 'LIST'}],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: 'all-products',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: [{type:'Product', id: 'LIST'}],
    }),
    getProduct: builder.query({
      query: (id) => ({
        url: `product/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: [{type:'Product', id: 'LIST'}],
    }),
    reviewProduct: builder.mutation({
      query: (data) => ({
        url: 'create-new-review',
        method: 'PUT',
        body: data,
        credentials: 'include' as const,
      }),
      invalidatesTags: [{type:'Product', id: 'LIST'}],
    }),
    deleteProductInShop: builder.mutation({
      query: (id) => ({
        url: `delete-shop-product/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
      invalidatesTags: [{type:'Product', id: 'LIST'}],
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