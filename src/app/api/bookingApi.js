import { Key } from "lucide-react";
import { baseApi } from "./baseApi";

const bookingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: (params) => {
        const urlParams = new URLSearchParams();
        Object.entries(params).map(([Key, val]) => {
          if (val !== null && val !== undefined && val !== "") {
            urlParams.append(Key, val);
          }
        });

        const paramsString = urlParams.toString();

        return {
          url: `/bookings-admin${paramsString ? `?${paramsString}` : ""}`,
          method: "GET",
        };
      },

      providesTags: ["AllBookings"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ bookingId, bookingStatus }) => ({
        url: `/vendor-booking/status/${bookingId}`,
        method: "PATCH",
        body: { bookingStatus },
      }),
      invalidatesTags: ["AllBookings"],
    }),
  }),
});

export const { useGetAllBookingsQuery, useUpdateBookingStatusMutation } =
  bookingApi;
