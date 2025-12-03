import { motion } from "framer-motion";
import { LockKeyhole, ArrowLeft, Home, LogIn, ShieldAlert } from "lucide-react";
import styles from "./UnauthorizedPage.module.css";

const UnauthorizedPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.topbar}>
        <a href="#" className={styles.logo}>
          <ShieldAlert className={styles.icon} />
          <span>Access Control</span>
        </a>
        <a href="/" className={styles.homeBtn}>
          <Home className={styles.smallIcon} /> Home
        </a>
      </div>

      <div className={styles.contentWrapper}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={styles.cardWrapper}
        >
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.header}>
                <div className={styles.iconCircle}>
                  <LockKeyhole className={styles.iconLarge} />
                </div>
                <div>
                  <p className={styles.errorCode}>Error 401</p>
                  <h1 className={styles.title}>Unauthorized Access</h1>
                </div>
              </div>

              <p className={styles.description}>
                You don’t have permission to view this page. You might need to
                sign in with a different account or request additional access
                from an administrator.
              </p>

              <div className={styles.actions}>
                <a href="/login" className={styles.primaryBtn}>
                  <LogIn className={styles.smallIcon} /> Sign in
                </a>
                <a href="/" className={styles.secondaryBtn}>
                  <Home className={styles.smallIcon} /> Go to home
                </a>
                <button
                  onClick={() =>
                    window.history.length > 1
                      ? window.history.back()
                      : (window.location.href = "/")
                  }
                  className={`${styles.secondaryBtn}`}
                >
                  <ArrowLeft className={`${styles.smallIcon}`} /> Go back
                </button>
              </div>

              <div className={styles.detailsBox}>
                <div className={styles.detailsContent}>
                  <div>
                    <p className={styles.detailsTitle}>Why am I seeing this?</p>
                    <ul className={styles.list}>
                      <li>You’re not signed in, or your session expired.</li>
                      <li>Your role lacks the required permissions.</li>
                      <li>
                        You tried to reach a restricted resource or route.
                      </li>
                    </ul>
                  </div>
                  <code className={styles.code}>401 • UNAUTHORIZED</code>
                </div>
              </div>
            </div>
          </div>

          <p className={styles.footer}>
            If you believe this is an error, contact support or your workspace
            admin and include the time and the page you were trying to access.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
