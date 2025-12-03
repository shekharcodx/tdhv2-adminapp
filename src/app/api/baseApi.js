import { handleLogout } from "@/utils/helper";
import { getToken, setToken } from "@/utils/localStorageMethods";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_URL,
  prepareHeaders: (headers) => {
    const userToken = getToken();
    if (userToken) {
      headers.set("Authorization", `Bearer ${userToken}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error.status === 401 && result.error?.data?.code === 9026) {
      try {
        // Call the refresh endpoint
        const refreshResult = await baseQuery(
          { url: "/refresh", method: "POST", body: { role: 1 } },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          console.log("refreshResult.data", refreshResult.data);
          const newAccessToken = refreshResult.data.data.token;

          // Update access token in your storage
          setToken(newAccessToken);

          // Retry the original request with the new token
          result = await baseQuery(
            {
              ...args,
              headers: {
                ...(args.headers || {}),
                Authorization: `Bearer ${newAccessToken}`,
              },
            },
            api,
            extraOptions
          );
        } else {
          handleLogout();
          api.dispatch(baseApi.util.resetApiState());
        }
      } catch (err) {
        console.error("Refresh token error:", err);
        handleLogout();
        api.dispatch(baseApi.util.resetApiState());
      }
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "countries",
    "states",
    "cities",
    // Add all your car-related tag types here:
    "CarBrands",
    "CarModels",
    "CarTrims",
    "Categories",
    "CarYears",
    "BodyTypes",
    "RegionalSpecs",
    "HorsePowers",
    "SeatingCapacities",
    "Colors",
    "Doors",
    "Transmissions",
    "FuelTypes",
    "TechFeatures",
    "OtherFeatures",
    "profile",
    "vendors",
    "vendor",
    "admins",
    "user",
    "listings",
    "listing",
    "AllModels",
    "AllTrims",
    "Blogs",
    "vendorListings",
    "VendorLeads",
    "offerListings",
    "AllTemplates",
    "AllBookings",
  ],
});
