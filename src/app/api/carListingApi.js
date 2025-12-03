import { baseApi } from "./baseApi";

const carApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getListings: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([Key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(Key, value);
          }
        });

        return {
          url: `/allListings?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["listings"],
    }),
    getListing: builder.query({
      query: (listingId) => ({
        url: `/listing/${listingId}`,
        method: "GET",
      }),
      providesTags: ["listing"],
    }),
    updateListing: builder.mutation({
      query: ({ listingId, values }) => ({
        url: `/vendorListing/${listingId}`,
        method: "PUT",
        body: values,
      }),
      invalidatesTags: ["listings", "listing", "vendorListings"],
    }),
    updateStatus: builder.mutation({
      query: ({ listingId, status }) => ({
        url: `/listingStatus/${listingId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["listings"],
    }),
    updateIsActive: builder.mutation({
      query: ({ listingId, active }) => ({
        url: `/listing/${listingId}`,
        method: "PATCH",
        body: { isActive: active },
      }),
      invalidatesTags: ["listings"],
    }),
    updateCategory: builder.mutation({
      query: ({ listingId, data }) => ({
        url: `/listing/category/${listingId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["listings", "offerListings"],
    }),
    getVendorListings: builder.query({
      query: (filters) => {
        const urlParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            urlParams.append(key, val);
          }
        });

        const filterParams = urlParams.toString();

        return {
          url: `/vendorListings${filterParams ? `?${filterParams}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["vendorListings"],
    }),
    getOfferListings: builder.query({
      query: (params) => {
        const urlParams = new URLSearchParams();

        Object.entries(params).forEach(([key, val]) => {
          if (val !== "" && val !== undefined && val !== null) {
            urlParams.append(key, val);
          }
        });

        const urlParamsString = urlParams.toString();

        return {
          url: `/offerListings${urlParamsString ? `?${urlParamsString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["offerListings"],
    }),
  }),
});

export const {
  useGetListingsQuery,
  useLazyGetListingQuery,
  useUpdateListingMutation,
  useUpdateStatusMutation,
  useUpdateIsActiveMutation,
  useUpdateCategoryMutation,
  useGetVendorListingsQuery,
  useGetOfferListingsQuery,
} = carApi;
