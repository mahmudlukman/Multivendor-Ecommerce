import { apiSlice } from '../api/apiSlice';
import {  sellerRegistration, sellerLoggedIn, sellerLoggedOut } from './sellerAuthSlice';

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sellerRegister: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: 'create-shop',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            sellerRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    sellerActivation: builder.mutation({
      query: ({ activation_token }) => ({
        url: 'activate-shop',
        method: 'POST',
        body: {
          activation_token,
        },
      }),
    }),
    sellerLogin: builder.mutation({
      query: ({ email, password }) => ({
        url: 'login-shop',
        method: 'POST',
        body: {
          email,
          password,
        },
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            sellerLoggedIn({
              sellerToken: result.data.activationToken,
              seller: result.data.seller,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    sellerLogOut: builder.query({
      query: () => ({
        url: 'logout-shop',
        method: 'GET',
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(sellerLoggedOut());
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    sellerForgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: 'forgot-password',
        method: 'POST',
        body: {
          email,
        },
        credentials: 'include',
      }),
    }),
    sellerResetPassword: builder.mutation({
      query: ({ userId, token, newPassword }) => ({
        url: `reset-password?token=${token}&id=${userId}`,
        method: 'POST',
        body: {
          newPassword,
        },
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useSellerRegisterMutation,
  useSellerActivationMutation,
  useSellerLoginMutation,
  useSellerLogOutQuery,
} = sellerApi;
