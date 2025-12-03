import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForgetPasswordMutation } from "@/app/api/authApi";
import { toaster } from "@/components/ui/toaster";
import styles from "./Forget.module.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    // ✅ call API with proper toaster options
    toaster.promise(
      forgetPassword({ email, role: 1 }).unwrap(),
      {
        loading: { title: "Sending Reset Link", description: " " },
        success: (res) => {
          console.log("Forget Password Response:", res);
          return {
            title: res?.message || "Reset link sent!",
            description: "Check your email inbox.",
          };
        },
        error: (err) => {
          console.error("Forget Password Error:", err);
          return {
            title: err?.message || "Failed to send reset link",
            description: "",
          };
        },
      },
      {
        position: "top-right", // ensures toaster stays in corner
        duration: 5000, // auto-close after 5s
      }
    );
  };

  return (
    <div className={styles.resetWrapper}>
      <div className={styles.resetCard}>
        <h3 className={styles.title}>Forget Password</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.inputField}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
            style={
              isLoading
                ? { backgroundColor: "#ccc", cursor: "not-allowed" }
                : { cursor: "pointer" }
            }
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <h6 className={styles.orText}>OR</h6>
          <Link to="/login" className={styles.forgetLink}>
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
