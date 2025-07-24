import { apiSlice } from '../api/apiSlice';

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation({
      query: (data) => ({
        url: 'create-conversation',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      invalidatesTags: ['Conversation'],
    }),
    getAllConversations: builder.query({
      query: (id) => ({
        url: `seller-conversations/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Conversation'],
    }),
    allUserConversations: builder.query({
      query: (id) => ({
        url: `user-conversations/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Conversation'],
    }),
    updateLastMessage: builder.mutation({
      query: (id) => ({
        url: `update-last-message/${id}`,
        method: 'PUT',
        credentials: 'include' as const,
      }),
      invalidatesTags: ['Conversation'],
    }),
  }),
});

export const {
  useAllUserConversationsQuery,
  useCreateConversationMutation,
  useGetAllConversationsQuery,
  useUpdateLastMessageMutation,
} = conversationApi;
