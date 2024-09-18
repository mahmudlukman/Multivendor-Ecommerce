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
    }),
    getAllConversations: builder.query({
      query: (id) => ({
        url: `conversations/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    allUserConversations: builder.query({
      query: (id) => ({
        url: `user-conversations/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    updateLastMessage: builder.mutation({
      query: (id) => ({
        url: `update-last-message/${id}`,
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useAllUserConversationsQuery,
  useCreateConversationMutation,
  useGetAllConversationsQuery,
  useUpdateLastMessageMutation,
} = conversationApi;
