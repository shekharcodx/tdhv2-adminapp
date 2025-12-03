import { baseApi } from "./baseApi";

const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVendors: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value);
          }
        });

        return {
          url: `/vendors?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["vendors"],
    }),

    editVendorProfile: builder.mutation({
      query: (data) => ({
        url: "editVendorProfile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["vendor", "user"],
    }),

    onboardVendor: builder.mutation({
      query: (id) => ({
        url: `/vendor-onboarding/${id}`,
        method: "POST",
      }),
    }),

    // ⭐ NEW ENDPOINT — Update Subscription Charges
    updateVendorSubscription: builder.mutation({
      query: ({ id, subscriptionCharges }) => ({
        url: `/vendor-subscription/${id}`,
        method: "PATCH",
        body: { subscriptionCharges },
      }),
      invalidatesTags: ["vendors"],
    }),
  }),
});

export const {
  useGetAllVendorsQuery,
  useEditVendorProfileMutation,
  useOnboardVendorMutation,

  // ⭐ Export new hook
  useUpdateVendorSubscriptionMutation,
} = vendorApi;
