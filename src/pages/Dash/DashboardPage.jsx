"use client";
import React, { useState, useMemo } from "react";
import styles from "./Dash.module.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import dayjs from "dayjs";
import useDashboardStats from "@/Hooks/useDashboardStats";

export default function AdminDashboard() {
  // ---- (A) State & data hooks (always called) ----
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(dayjs().startOf("month").toDate()),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const {
    totals,
    vendors = [],
    dailyStats = [],
    loading,
    error,
  } = useDashboardStats(dateRange);

  // ---- (B) Local UI state (always called) ----
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedVendor, setExpandedVendor] = useState(null);

  // ---- (C) Derived values (hooks called unconditionally) ----
  const totalCalls = totals?.totalCalls || 0;
  const totalWhatsApp = totals?.totalWhatsApp || 0;
  const totalBookings = totals?.totalBookings || 0;
  const totalRevenue = totals?.totalRevenue || 0;
  const conversionRate = ((totalBookings / (totalCalls || 1)) * 100).toFixed(1);

  const allCars = useMemo(() => {
    if (!Array.isArray(vendors)) return [];
    return vendors.flatMap((v, vi) =>
      (v.cars || []).map((c, ci) => ({
        id: `v${vi}c${ci}`,
        name: c.car ?? c.name ?? "Unknown Car",
        calls: c.calls || 0,
        whatsapp: c.whatsapp || 0,
        bookings: c.bookings || 0,
        revenue: c.revenue || 0,
        vendorName: v.vendor,
        vendorId: `v${vi}`,
      }))
    );
  }, [vendors]);

  // ---- (D) Only now branch/return UI ----
  if (loading) return <p className={styles.loading}>Loading dashboard...</p>;
  if (error) return <p className={styles.error}>Error loading data.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard (Live)</h1>

      {/* 📅 Date Range Selector */}
      <div className={styles.dateFilter}>
        <label>📆 Date Range:</label>
        <button
          onClick={() => setShowCalendar(true)}
          className={styles.btnPrimary}
        >
          Select Date Range
        </button>
      </div>

      {showCalendar && (
        <div
          className={styles.overlayBg}
          onClick={(e) =>
            e.target.classList.contains(styles.overlayBg) &&
            setShowCalendar(false)
          }
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.overlayCard}
          >
            <DateRange
              ranges={dateRange}
              onChange={(ranges) => setDateRange([ranges.selection])}
              moveRangeOnFirstSelection={false}
              editableDateInputs
              rangeColors={["#5b787c"]}
              months={1}
              direction="horizontal"
            />
            <div style={{ textAlign: "right" }}>
              <button
                className={styles.btnPrimary}
                onClick={() => setShowCalendar(false)}
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 🔹 KPI Cards */}
      <div className={styles.kpiGrid}>
        <motion.div className={styles.kpiCard}>
          <h3>📞 Calls</h3>
          <p>{totalCalls}</p>
        </motion.div>
        <motion.div className={styles.kpiCard}>
          <h3>💬 WhatsApp</h3>
          <p>{totalWhatsApp}</p>
        </motion.div>
        <motion.div className={styles.kpiCard}>
          <h3>🧾 Bookings</h3>
          <p>{totalBookings}</p>
        </motion.div>
        <motion.div className={styles.kpiCard}>
          <h3>💰 Revenue</h3>
          <p>AED {Math.round(totalRevenue).toLocaleString()}</p>
        </motion.div>
        <motion.div className={styles.kpiCard}>
          <h3>📊 Conversion</h3>
          <p>{conversionRate}%</p>
        </motion.div>
      </div>

      {/* 📈 Daily Performance Chart */}
      <div className={styles.card}>
        <h2>📈 Daily Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="calls" stroke="#5b787c" />
            <Line type="monotone" dataKey="whatsapp" stroke="#7bb9c2" />
            <Line type="monotone" dataKey="bookings" stroke="#27343a" />
            <Line type="monotone" dataKey="revenue" stroke="#a5c9ca" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🏢 Vendor Performance */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>🏢 Vendor Performance</h2>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className={styles.select}
          >
            <option value="all">All</option>
            <option value="calls">Calls</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="bookings">Bookings</option>
            <option value="revenue">Revenue</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendors} barSize={35}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="vendor" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedMetric === "all" ? (
              <>
                <Bar dataKey="calls" fill="#5b787c">
                  <LabelList dataKey="calls" position="top" />
                </Bar>
                <Bar dataKey="whatsapp" fill="#7bb9c2">
                  <LabelList dataKey="whatsapp" position="top" />
                </Bar>
                <Bar dataKey="bookings" fill="#27343a">
                  <LabelList dataKey="bookings" position="top" />
                </Bar>
                <Bar dataKey="revenue" fill="#a5c9ca">
                  <LabelList dataKey="revenue" position="top" />
                </Bar>
              </>
            ) : (
              <Bar dataKey={selectedMetric} fill="#5b787c">
                <LabelList dataKey={selectedMetric} position="top" />
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🧾 Vendors Summary (Expandable) */}
      <div className={styles.card}>
        <h2>🧾 Vendors Summary</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Calls</th>
                <th>WhatsApp</th>
                <th>Bookings</th>
                <th>Revenue</th>
                <th>Conversion %</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, i) => {
                const isOpen = expandedVendor === v.vendor;
                return (
                  <React.Fragment key={i}>
                    <tr
                      className={styles.vendorRow}
                      onClick={() =>
                        setExpandedVendor(isOpen ? null : v.vendor)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <strong>{v.vendor}</strong>{" "}
                        <span className={styles.expandIcon}>
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </td>
                      <td>{v.calls}</td>
                      <td>{v.whatsapp}</td>
                      <td>{v.bookings}</td>
                      <td>AED {Math.round(v.revenue).toLocaleString()}</td>
                      <td>
                        {((v.bookings / (v.calls || 1)) * 100).toFixed(1)}%
                      </td>
                    </tr>

                    {isOpen && (
                      <tr className={styles.subRow}>
                        <td colSpan={6}>
                          <div className={styles.subSection}>
                            <div className={styles.cardHeader}>
                              <h3>{v.vendor} • Cars</h3>
                              <select
                                className={styles.select}
                                value={selectedMetric}
                                onChange={(e) =>
                                  setSelectedMetric(e.target.value)
                                }
                              >
                                <option value="all">All</option>
                                <option value="calls">Calls</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="bookings">Bookings</option>
                                <option value="revenue">Revenue</option>
                              </select>
                            </div>

                            {/* Car mini bar chart */}
                            <div className={styles.hScroll}>
                              <div
                                style={{
                                  minWidth: `${(v.cars?.length || 1) * 120}px`,
                                  height: 230,
                                }}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={v.cars || []} barSize={30}>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#e2e8f0"
                                    />
                                    <XAxis
                                      dataKey={(d) => d.car || d.name}
                                      interval={0}
                                      angle={-18}
                                      textAnchor="end"
                                      height={50}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {selectedMetric === "all" ? (
                                      <>
                                        <Bar dataKey="calls" fill="#5b787c">
                                          <LabelList
                                            dataKey="calls"
                                            position="top"
                                            fontSize={11}
                                          />
                                        </Bar>
                                        <Bar dataKey="whatsapp" fill="#7bb9c2">
                                          <LabelList
                                            dataKey="whatsapp"
                                            position="top"
                                            fontSize={11}
                                          />
                                        </Bar>
                                        <Bar dataKey="bookings" fill="#27343a">
                                          <LabelList
                                            dataKey="bookings"
                                            position="top"
                                            fontSize={11}
                                          />
                                        </Bar>
                                        <Bar dataKey="revenue" fill="#a5c9ca">
                                          <LabelList
                                            dataKey="revenue"
                                            position="top"
                                            fontSize={11}
                                          />
                                        </Bar>
                                      </>
                                    ) : (
                                      <Bar
                                        dataKey={selectedMetric}
                                        fill="#5b787c"
                                      >
                                        <LabelList
                                          dataKey={selectedMetric}
                                          position="top"
                                          fontSize={11}
                                        />
                                      </Bar>
                                    )}
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Car table under vendor */}
                            <div className={styles.tableContainer}>
                              <table
                                className={styles.table}
                                style={{ minWidth: 720 }}
                              >
                                <thead>
                                  <tr>
                                    <th>Car</th>
                                    <th>Calls</th>
                                    <th>WhatsApp</th>
                                    <th>Bookings</th>
                                    <th>Avg Rent (AED)</th>
                                    <th>Revenue</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(v.cars || []).map((c, j) => (
                                    <tr key={j}>
                                      <td>{c.car || c.name}</td>
                                      <td>{c.calls || 0}</td>
                                      <td>{c.whatsapp || 0}</td>
                                      <td>{c.bookings || 0}</td>
                                      <td>
                                        {Math.round(
                                          c.avgRent || 0
                                        ).toLocaleString()}
                                      </td>
                                      <td>
                                        AED{" "}
                                        {Math.round(
                                          c.revenue || 0
                                        ).toLocaleString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚘 All Cars (Global) */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>🚘 All Cars (Global)</h2>
          <select
            className={styles.select}
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="all">All</option>
            <option value="calls">Calls</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="bookings">Bookings</option>
            <option value="revenue">Revenue</option>
          </select>
        </div>

        <div className={styles.hScroll}>
          <div
            style={{
              minWidth: `${Math.max(allCars.length, 1) * 120}px`,
              height: 260,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allCars} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={50}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedMetric === "all" ? (
                  <>
                    <Bar dataKey="calls" fill="#5b787c">
                      <LabelList dataKey="calls" position="top" fontSize={11} />
                    </Bar>
                    <Bar dataKey="whatsapp" fill="#7bb9c2">
                      <LabelList
                        dataKey="whatsapp"
                        position="top"
                        fontSize={11}
                      />
                    </Bar>
                    <Bar dataKey="bookings" fill="#27343a">
                      <LabelList
                        dataKey="bookings"
                        position="top"
                        fontSize={11}
                      />
                    </Bar>
                    <Bar dataKey="revenue" fill="#a5c9ca">
                      <LabelList
                        dataKey="revenue"
                        position="top"
                        fontSize={11}
                      />
                    </Bar>
                  </>
                ) : (
                  <Bar dataKey={selectedMetric} fill="#5b787c">
                    <LabelList
                      dataKey={selectedMetric}
                      position="top"
                      fontSize={11}
                    />
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global cars table */}
        <div className={styles.tableContainer}>
          <table className={styles.table} style={{ minWidth: 820 }}>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Car</th>
                <th>Calls</th>
                <th>WhatsApp</th>
                <th>Bookings</th>
                <th>Revenue (AED)</th>
                <th>Conversion %</th>
              </tr>
            </thead>
            <tbody>
              {allCars.map((c) => (
                <tr key={c.id}>
                  <td>{c.vendorName}</td>
                  <td>{c.name}</td>
                  <td>{c.calls}</td>
                  <td>{c.whatsapp}</td>
                  <td>{c.bookings}</td>
                  <td>{Math.round(c.revenue).toLocaleString()}</td>
                  <td>{((c.bookings / (c.calls || 1)) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
