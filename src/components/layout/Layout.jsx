import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Header from "../navbar/Header"; // ← Import Header component
import styles from "./Layout.module.css";
import { useDisclosure } from "@chakra-ui/react";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.layoutContainer}>
      <Sidebar isOpen={isOpen} onClose={setIsOpen} />

      <div className={styles.contentWrapper}>
        <Header setIsOpen={setIsOpen} /> {/* ← Add Header here */}
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
