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
    }),
    updateUserInfo: builder.mutation({
      query: ({ name, email, phoneNumber }) => ({
        url: 'update-user-info',
        method: 'PUT',
        body: {
          name,
          email,
          phoneNumber,
        },
        credentials: 'include' as const,
      }),
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
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: 'get-users',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `get-user${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete-user/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
    deleteUserAddress: builder.mutation({
      query: (id) => ({
        url: `delete-user-address/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
    updateUserRole: builder.mutation({
      query: () => ({
        url: 'update-user-role',
        method: 'PUT',
        credentials: 'include' as const,
      }),
    }),
    updateUserAddress: builder.mutation({
      query: () => ({
        url: 'update-user-address',
        method: 'PUT',
        credentials: 'include' as const,
      }),
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
