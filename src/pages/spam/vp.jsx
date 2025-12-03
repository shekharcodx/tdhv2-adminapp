import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VendorProfile.module.css";

const VendorProfile = () => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/user-form");
  };

  return (
    <div className={styles.vendorContainer}>
    {/* Left Profile Section */}
      <div className={styles.leftCard}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
          alt="Profile"
          className={styles.avatar}
        />
        <h2>John deo</h2>
        <p className={styles.email}>John.example@gmail.com</p>
        <button className={styles.followBtn}>Follow</button>

        <div className={styles.socialStats}>
          <div>
            <strong>1703</strong>
            <p>Friends</p>
          </div>
          <div>
            <strong>3005</strong>
            <p>Followers</p>
          </div>
          <div>
            <strong>1150</strong>
            <p>Following</p>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <p>
            <strong>Email address</strong>
            <br />
            john.example@gmail.com
          </p>
          <p>
            <strong>Phone Number</strong>
            <br />
            +1 234 567 890
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightCard}>
        <div className={styles.header}>
          <h2>Vendor Profile</h2>
          <button className={styles.editBtn} onClick={handleEdit}>
            Edit
          </button>
        </div>
        <p className={styles.breadcrumb}>Home &gt; Profile</p>

        <div className={styles.tabs}>
          <button className={styles.activeTab}>Profile</button>
          <button>Settings</button>
        </div>

        <div className={styles.infoBoxes}>
          <div className={`${styles.infoBox}`}>
            <div className={`${styles.iconBox} ${styles.iconUser}`}>👤</div>
            <div>
              <span>5300</span>
              <p>New Users</p>
            </div>
          </div>
          <div className={`${styles.infoBox}`}>
            <div className={`${styles.iconBox} ${styles.iconCart}`}>🛒</div>
            <div>
              <span>1953</span>
              <p>Order Placed</p>
            </div>
          </div>
          <div className={`${styles.infoBox}`}>
            <div className={`${styles.iconBox} ${styles.iconSales}`}>💎</div>
            <div>
              <span>1450</span>
              <p>Total Sales</p>
            </div>
          </div>
        </div>

        <div className={styles.notifications}>
          <h4>Latest Notifications</h4>

          <div className={styles.notification}>
            <div className={`${styles.iconBox} ${styles.iconCart}`}>🛒</div>
            <div>
              <h5>New Order</h5>
              <p>Selena has placed a new order</p>
            </div>
            <span className={styles.time}>10 AM</span>
          </div>

          <div className={styles.notification}>
            <div className={`${styles.iconBox} ${styles.iconEnquiry}`}>✉️</div>
            <div>
              <h5>New Enquiry</h5>
              <p>Phileine has placed a new order</p>
            </div>
            <span className={styles.time}>9 AM</span>
          </div>

          <div className={styles.notification}>
            <div className={`${styles.iconBox} ${styles.iconTicket}`}>🎫</div>
            <div>
              <h5>Support Ticket</h5>
              <p>Emma has placed a new order</p>
            </div>
            <span className={styles.time}>10 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;

