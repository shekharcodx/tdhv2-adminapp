import { useMemo } from "react";
import groupBy from "lodash/groupBy";
import dayjs from "dayjs";

export default function useDashboardStatsLogic(raw = []) {
  return useMemo(() => {
    if (!raw?.length)
      return { totals: {}, vendors: [], dailyStats: [], hourlyStats: [] };

    const byVendor = groupBy(raw, "vendor");

    const vendors = Object.entries(byVendor).map(([vendor, entries]) => {
      const cars = groupBy(entries, "car");

      const carStats = Object.entries(cars).map(([car, records]) => {
        const calls = records.filter((r) => r.type === "call").length;
        const whatsapp = records.filter((r) => r.type === "whatsapp").length;
        const bookings = records.filter((r) => r.type === "rent").length;

        // 💰 Revenue = sum of rentPerDay for rent entries
        const revenue = records
          .filter((r) => r.type === "rent" && r.rentPerDay)
          .reduce((sum, r) => sum + r.rentPerDay, 0);

        // 🕓 Hourly aggregation
        const hourly = Object.entries(
          groupBy(records, (r) => dayjs(r.createdAt).format("HH:00"))
        ).map(([hour, list]) => ({
          hour,
          calls: list.filter((r) => r.type === "call").length,
          whatsapp: list.filter((r) => r.type === "whatsapp").length,
          bookings: list.filter((r) => r.type === "rent").length,
          revenue: list
            .filter((r) => r.type === "rent" && r.rentPerDay)
            .reduce((sum, r) => sum + r.rentPerDay, 0),
        }));

        return { car, calls, whatsapp, bookings, revenue, hourly };
      });

      const calls = entries.filter((r) => r.type === "call").length;
      const whatsapp = entries.filter((r) => r.type === "whatsapp").length;
      const bookings = entries.filter((r) => r.type === "rent").length;
      const revenue = entries
        .filter((r) => r.type === "rent" && r.rentPerDay)
        .reduce((sum, r) => sum + r.rentPerDay, 0);

      return { vendor, calls, whatsapp, bookings, revenue, cars: carStats };
    });

    // 🌍 Totals
    const totalCalls = raw.filter((r) => r.type === "call").length;
    const totalWhatsApp = raw.filter((r) => r.type === "whatsapp").length;
    const totalBookings = raw.filter((r) => r.type === "rent").length;
    const totalRevenue = raw
      .filter((r) => r.type === "rent" && r.rentPerDay)
      .reduce((sum, r) => sum + r.rentPerDay, 0);

    // 📅 Daily aggregation
    const dailyStats = Object.entries(
      groupBy(raw, (r) => dayjs(r.createdAt).format("YYYY-MM-DD"))
    ).map(([date, list]) => ({
      date,
      calls: list.filter((r) => r.type === "call").length,
      whatsapp: list.filter((r) => r.type === "whatsapp").length,
      bookings: list.filter((r) => r.type === "rent").length,
      revenue: list
        .filter((r) => r.type === "rent" && r.rentPerDay)
        .reduce((sum, r) => sum + r.rentPerDay, 0),
    }));

    // 🕒 Hourly global aggregation
    const hourlyStats = Object.entries(
      groupBy(raw, (r) => dayjs(r.createdAt).format("HH:00"))
    ).map(([hour, list]) => ({
      hour,
      calls: list.filter((r) => r.type === "call").length,
      whatsapp: list.filter((r) => r.type === "whatsapp").length,
      bookings: list.filter((r) => r.type === "rent").length,
      revenue: list
        .filter((r) => r.type === "rent" && r.rentPerDay)
        .reduce((sum, r) => sum + r.rentPerDay, 0),
    }));

    return {
      totals: { totalCalls, totalWhatsApp, totalBookings, totalRevenue },
      vendors,
      dailyStats,
      hourlyStats,
    };
  }, [raw]);
}
