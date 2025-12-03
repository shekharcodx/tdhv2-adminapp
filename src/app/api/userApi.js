import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (param) => ({
        url: `/user/${param}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateActiveStatus: builder.mutation({
      query: (data) => ({
        url: "/profileActiveStatus",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["vendors", "admins"],
    }),
    updateAccountStatus: builder.mutation({
      query: (data) => ({
        url: "/accountStatus",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["vendors", "admins"],
    }),
  }),
});

export const {
  useLazyGetUserQuery,
  useUpdateActiveStatusMutation,
  useUpdateAccountStatusMutation,
} = userApi;
