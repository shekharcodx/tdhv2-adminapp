import React from "react";
import styles from "./Notice.module.css";
import { useNavigate } from "react-router-dom";

const defaultOrders = [
  {
    id: "24541",
    product: "Coach Swagger",
    units: "1 Unit",
    date: "Oct 20, 2018",
    cost: "$230",
    status: "COMPLETED",
  },
  {
    id: "24542",
    product: "Toddler Shoes, Gucci Watch",
    units: "2 Units",
    date: "Nov 15, 2018",
    cost: "$550",
    status: "DELAYED",
  },
  {
    id: "24543",
    product: "Hat Black Suits",
    units: "1 Unit",
    date: "Nov 18, 2018",
    cost: "$325",
    status: "ON HOLD",
  },
  {
    id: "24544",
    product: "Backpack Gents, Swimming Cap Slin",
    units: "5 Units",
    date: "Dec 13, 2018",
    cost: "$200",
    status: "COMPLETED",
  },
    {
    id: "24544",
    product: "Backpack Gents, Swimming Cap Slin",
    units: "5 Units",
    date: "Dec 13, 2018",
    cost: "$200",
    status: "COMPLETED",
  },
    {
    id: "24544",
    product: "Backpack Gents, Swimming Cap Slin",
    units: "5 Units",
    date: "Dec 13, 2018",
    cost: "$200",
    status: "COMPLETED",
  },
    {
    id: "24544",
    product: "Backpack Gents, Swimming Cap Slin",
    units: "5 Units",
    date: "Dec 13, 2018",
    cost: "$200",
    status: "DELAYED",
  },
    {
    id: "24544",
    product: "Backpack Gents, Swimming Cap Slin",
    units: "5 Units",
    date: "Dec 13, 2018",
    cost: "$200",
    status: "ON HOLD",
  },
];

const Notice = ({ orders = defaultOrders }) => {
  const navigate = useNavigate();
  const goToAdmin = () => {
    navigate("/admin-dashboard");
  };
  return (
    <div className={styles.recentOrders}>
      <div className={styles.recentHeader}>
        <h4>Recent Orders</h4>
        <span className={styles.date}>Jul 18, 2025 - Aug 16, 2025</span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order_ID</th>
            <th>Product_Name</th>
            <th>Units</th>
            <th>Order_Date</th>
            <th>Order_Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx}>
              <td className={styles.bold}>{order.id}</td>
              <td>{order.product}</td>
              <td>{order.units}</td>
              <td>{order.date}</td>
              <td>{order.cost}</td>
              <td>
                <span
                  className={`${styles.badge} ${
                    styles[order.status.toLowerCase().replace(" ", "")]
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notice;
