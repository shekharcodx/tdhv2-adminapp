// src/app/api/authApi.js
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/forgetPassword",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: ({ email, oldPassword, newPassword }) => ({
        url: "/createNewPassword",
        method: "PUT",
        body: { email, oldPassword, newPassword },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/resetPassword",
        method: "PUT",
        body: { token, newPassword },
      }),
    }),

    register: builder.mutation({
      query: (formData) => ({
        url: "/register",
        method: "POST",
        body: formData, // ✅ FormData for file upload
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgetPasswordMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;

export default authApi;
