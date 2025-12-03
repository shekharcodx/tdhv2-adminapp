import { baseApi } from "./baseApi";

export const dashboardStatsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard-admin/stats", // ✅ your correct endpoint
        method: "GET",
      }),
      transformResponse: (response) => response.data || [],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useLazyGetDashboardStatsQuery } =
  dashboardStatsApi;
