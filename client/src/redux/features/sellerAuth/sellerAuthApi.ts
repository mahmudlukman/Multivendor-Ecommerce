import { apiSlice } from "../api/apiSlice";
import {
  sellerRegistration,
  sellerLoggedIn,
  sellerLoggedOut,
} from "./sellerAuthSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = object;

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerSeller: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "create-shop",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            sellerRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: unknown) {
          console.log(error);
        }
      },
    }),
    activateSeller: builder.mutation({
      query: ({ activation_token }) => ({
        url: "activate-shop",
        method: "POST",
        body: {
          activation_token,
        },
      }),
    }),
    sellerLogin: builder.mutation({
      query: ({ email, password }) => ({
        url: "login-shop",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            sellerLoggedIn({
              sellerToken: result.data.activationToken,
              seller: result.data.seller,
            })
          );
        } catch (error: unknown) {
          console.log(error);
        }
      },
    }),
    sellerLogOut: builder.query({
      query: () => ({
        url: "logout-shop",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(sellerLoggedOut());
        } catch (error: unknown) {
          console.log(error);
        }
      },
    }),
    sellerForgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "forgot-shop-password",
        method: "POST",
        body: {
          email,
        },
        credentials: "include",
      }),
    }),
    sellerResetPassword: builder.mutation({
      query: ({ shopId, token, newPassword }) => ({
        url: `reset-shop-password?token=${token}&id=${shopId}`,
        method: "POST",
        body: {
          newPassword,
        },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterSellerMutation,
  useActivateSellerMutation,
  useSellerLoginMutation,
  useSellerLogOutQuery,
  useSellerForgotPasswordMutation,
  useSellerResetPasswordMutation,
} = sellerApi;
