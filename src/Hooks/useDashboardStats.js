import { useMemo } from "react";
import groupBy from "lodash/groupBy";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useGetDashboardStatsQuery } from "@/app/api/dashApi";

// enable date comparison plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function useDashboardStats(dateRange) {
  const { data: apiResponse, isLoading, error } = useGetDashboardStatsQuery();

  // normalize API data
  const raw = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse?.data || [];

  // filter by selected date range
  const filtered = useMemo(() => {
    if (!Array.isArray(raw) || !raw.length || !dateRange?.[0]) return raw;
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) return raw;

    return raw.filter((r) => {
      if (!r.createdAt) return false;
      const d = dayjs(r.createdAt);
      return (
        d.isSameOrAfter(dayjs(startDate), "day") &&
        d.isSameOrBefore(dayjs(endDate), "day")
      );
    });
  }, [raw, dateRange]);

  // calculate totals, vendor-level, car-level, and daily stats
  const stats = useMemo(() => {
    if (!filtered.length)
      return { totals: {}, vendors: [], dailyStats: [], raw: filtered };

    const byVendor = groupBy(filtered, "vendor");

    const vendors = Object.entries(byVendor).map(([vendor, entries]) => {
      const cars = groupBy(entries, "car");

      const carStats = Object.entries(cars).map(([car, records]) => {
        const calls = records.filter((r) => r.type === "call").length;
        const whatsapp = records.filter((r) => r.type === "whatsapp").length;
        const bookings = records.filter((r) => r.type === "rent").length;
        const avgRent =
          records.reduce((sum, r) => sum + (r.rentPerDay || 0), 0) /
          (records.filter((r) => r.rentPerDay).length || 1);
        const revenue = (calls + whatsapp + bookings) * avgRent;
        return { car, calls, whatsapp, bookings, avgRent, revenue };
      });

      const calls = entries.filter((r) => r.type === "call").length;
      const whatsapp = entries.filter((r) => r.type === "whatsapp").length;
      const bookings = entries.filter((r) => r.type === "rent").length;
      const avgRentVendor =
        entries.reduce((sum, r) => sum + (r.rentPerDay || 0), 0) /
        (entries.filter((r) => r.rentPerDay).length || 1);
      const revenue = (calls + whatsapp + bookings) * avgRentVendor;

      return {
        vendor,
        calls,
        whatsapp,
        bookings,
        avgRentVendor,
        revenue,
        cars: carStats,
      };
    });

    const totalCalls = filtered.filter((r) => r.type === "call").length;
    const totalWhatsApp = filtered.filter((r) => r.type === "whatsapp").length;
    const totalBookings = filtered.filter((r) => r.type === "rent").length;
    const totalRevenue = vendors.reduce((sum, v) => sum + v.revenue, 0);

    const dailyStats = Object.entries(
      groupBy(filtered, (r) => dayjs(r.createdAt).format("YYYY-MM-DD"))
    ).map(([date, list]) => {
      const calls = list.filter((r) => r.type === "call").length;
      const whatsapp = list.filter((r) => r.type === "whatsapp").length;
      const bookings = list.filter((r) => r.type === "rent").length;
      const avgRent =
        list.reduce((sum, r) => sum + (r.rentPerDay || 0), 0) /
        (list.filter((r) => r.rentPerDay).length || 1);
      const revenue = (calls + whatsapp + bookings) * avgRent;
      return { date, calls, whatsapp, bookings, revenue };
    });

    return {
      totals: { totalCalls, totalWhatsApp, totalBookings, totalRevenue },
      vendors,
      dailyStats,
      raw: filtered,
    };
  }, [filtered]);

  return { ...stats, loading: isLoading, error };
}
