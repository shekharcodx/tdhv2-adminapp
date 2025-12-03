// components/Cards.jsx
import React from "react";
import styles from "./card.module.css";
import Card from "./Card";
import { FaUserPlus, FaUsers, FaBoxOpen, FaDollarSign } from "react-icons/fa";

const cardData = [
  {
    title: "Daily Signups",
    value: "1,503",
    Icon: FaUserPlus,
    iconColor: "#3b82f6",
  },
  {
    title: "Daily Visitors",
    value: "79,503",
    Icon: FaUsers,
    iconColor: "#8b5cf6",
  },
  {
    title: "Daily Orders",
    value: "15,503",
    Icon: FaBoxOpen,
    iconColor: "#10b981",
  },
  {
    title: "Daily Revenue",
    value: "$98,503",
    Icon: FaDollarSign,
    iconColor: "#f59e0b",
  },
];

const Cards = () => {
  return (
    <div className={styles.cardsContainer}>
      {cardData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          value={card.value}
          Icon={card.Icon}
          iconColor={card.iconColor}
        />
      ))}
    </div>
  );
};

export default Cards;
