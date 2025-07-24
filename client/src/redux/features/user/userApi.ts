import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUserAvatar: builder.mutation({
      query: (avatar) => ({
        url: 'update-user-avatar',
        method: 'PUT',
        body: {
          avatar,
        },
        credentials: 'include' as const,
      }),
      invalidatesTags: [{type:'User', id: 'LIST'}],
    }),
    updateUserInfo: builder.mutation({
      query: ({ name, avatar, phoneNumber }) => ({
        url: 'update-user-info',
        method: 'PUT',
        body: {
          name,
          avatar,
          phoneNumber,
        },
        credentials: 'include' as const,
      }),
      invalidatesTags: [{type:'User', id: 'LIST'}],
    }),
    updateUserPassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: 'update-user-password',
        method: 'PUT',
        body: {
          oldPassword,
          newPassword,
        },
        credentials: 'include' as const,
      }),
      invalidatesTags: [{type:'User', id: 'LIST'}],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: 'get-users',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: [{type:'User', id: 'LIST'}],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `get-user${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: [{type:'User', id: 'LIST'}],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete-user/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
      invalidatesTags: [{type:'User', id: 'LIST'}],
    }),
    deleteUserAddress: builder.mutation({
      query: (id) => ({
        url: `delete-user-address/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
      invalidatesTags: [{type:'User', id: 'LIST'}],
    }),
    updateUserRole: builder.mutation({
      query: ({ data }) => ({
        url: 'update-user-role',
        method: 'PUT',
        body: data,
        credentials: 'include' as const,
      }),
      invalidatesTags: [{type:'User', id: 'LIST'}],
    }),
    updateUserAddress: builder.mutation({
      query: (addressData) => ({
        url: 'update-user-address',
        method: 'PUT',
        body: addressData,
        credentials: 'include' as const,
      }),
      invalidatesTags: [{type:'User', id: 'LIST'}],
    }),
  }),
});

export const {
  useDeleteUserAddressMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateUserAddressMutation,
  useUpdateUserAvatarMutation,
  useUpdateUserInfoMutation,
  useUpdateUserPasswordMutation,
  useUpdateUserRoleMutation,
} = userApi;
