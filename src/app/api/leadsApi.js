import { baseApi } from "./baseApi";

const leadsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 🟣 Existing Vendor Leads
    getVendorLeads: builder.query({
      query: (params) => {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            urlParams.append(key, val);
          }
        });
        const paramsString = urlParams.toString();
        return {
          url: `/leads/vendor${paramsString ? `?${paramsString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["VendorLeads"],
    }),

    // 🟢 New: Create Customer Lead (POST)
    createCustomerLead: builder.mutation({
      query: (body) => ({
        url: "/lead/customer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CustomerLeads"],
    }),

    // 🟣 New: Get Customer Leads (GET)
    getCustomerLeads: builder.query({
      query: (params = {}) => {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            urlParams.append(key, val);
          }
        });
        const paramsString = urlParams.toString();
        return {
          url: `/leads/customer${paramsString ? `?${paramsString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["CustomerLeads"],
    }),
  }),
});

export const {
  useGetVendorLeadsQuery,
  useCreateCustomerLeadMutation,
  useGetCustomerLeadsQuery, // ✅ now properly exported
} = leadsApi;
