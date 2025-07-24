import { apiSlice } from '../api/apiSlice';

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createNewMessage: builder.mutation({
      query: (data) => ({
        url: 'create-new-message',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      invalidatesTags: ['Message'],
    }),
    getAllMessages: builder.query({
      query: (id) => ({
        url: `messages/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Message'],
    }),
  }),
});

export const { useCreateNewMessageMutation, useGetAllMessagesQuery } =
  messageApi;
