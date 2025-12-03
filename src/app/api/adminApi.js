import { baseApi } from "./baseApi";

const adminApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllAdmins: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value);
          }
        });

        return {
          url: `/admins?${searchParams}`,
          method: "GET",
        };
      },
      providesTags: ["admins"],
    }),
    editAdminProfile: builder.mutation({
      query: (data) => ({
        url: "adminProfile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["admins"],
    }),
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["admins"],
    }),
  }),
});

export const {
  useGetAllAdminsQuery,
  useEditAdminProfileMutation,
  useCreateAdminMutation,
} = adminApi;
