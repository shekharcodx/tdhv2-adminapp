import { motion } from "framer-motion";
import { Home, Compass } from "lucide-react";
import styles from "./NotFound.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.wrapper}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={styles.card}
      >
        <div className={styles.header}>
          <Compass className={styles.icon} />
          <h1 className={styles.title}>Page Not Found</h1>
        </div>

        <p className={styles.message}>
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className={styles.actions}>
          <a href="/" className={styles.primaryBtn}>
            <Home className={styles.smallIcon} /> Back to Home
          </a>
        </div>

        <p className={styles.code}>404 • NOT FOUND</p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
