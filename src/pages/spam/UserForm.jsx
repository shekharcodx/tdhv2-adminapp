import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './UserForm.module.css';

export default function UserForm() {
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      <form className={styles.form}>
        <h2 className={styles.title}>User Registration</h2>
        <p className={styles.pathInfo}>Current path: {location.pathname}</p>

        <div className={styles.formGroup}>
          <label htmlFor="userImage">User Image</label>
          <input type="file" id="userImage" className={styles.inputFile} />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="First name"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Last name"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            id="userName"
            placeholder="User name"
            className={styles.input}
          />
          <p className={styles.helperText}>
            Accusamus nobis at omnis consequuntur culpa tempore saepe animi.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
}
