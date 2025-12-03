import { baseApi } from "./baseApi";

const locationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => ({
        url: "/countries",
        method: "GET",
      }),
      providesTags: ["countries"],
    }),

    getStates: builder.query({
      query: (param) => ({
        url: `/states/${param}`,
        method: "GET",
      }),
      providesTags: ["states"],
    }),
    getCities: builder.query({
      query: (param) => ({
        url: `/cities/${param}`,
        method: "GET",
      }),
      providesTags: ["cities"],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useLazyGetStatesQuery,
  useLazyGetCitiesQuery,
} = locationApi;
