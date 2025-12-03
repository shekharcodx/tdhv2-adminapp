// components/Card.jsx
import React from "react";
import styles from "./card.module.css";

const Card = ({ title, value, Icon, iconColor }) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.iconWrapper}
        style={{ backgroundColor: `${iconColor}20` }}
      >
        <Icon className={styles.icon} style={{ color: iconColor }} />
      </div>
      <div>
        <h3 className={styles.h3}>{value}</h3>
        <p className={styles.p}>{title}</p>
      </div>
    </div>
  );
};

export default Card;
