"use client";

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useResetPasswordMutation } from "@/app/api/authApi";
import { toaster } from "@/components/ui/toaster";
import styles from "./Reset.module.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

// ✅ Zod schema for validation
const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Resetpass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  // ✅ separate toggles for both fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (data) => {
    if (!token) {
      toaster.error("Invalid or missing token.");
      return;
    }

    const promise = resetPassword({
      token,
      newPassword: data.password,
    }).unwrap();

    toaster.promise(promise, {
      loading: { title: "Resetting Password...", description: "Please wait" },
      success: (res) => {
        toaster.success(res?.message || "Password reset successfully!");
        navigate("/login");
        return {
          title: res?.message || "Password reset successfully!",
          description: "You can now log in with your new password.",
        };
      },
      error: (err) => {
        console.error("Password reset error:", err);
        toaster.error(err?.data?.message || "Failed to reset password.");
      },
    });
  };

  return (
    <div className={styles.resetWrapper}>
      <div className={styles.resetCard}>
        <h3 className={styles.heading}>Reset Password</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                className={styles.inputField}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeToggle}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className={styles.errorText}>{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...register("confirmPassword")}
                className={styles.inputField}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeToggle}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={styles.errorText}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
            style={
              isLoading
                ? { backgroundColor: "#ccc", cursor: "not-allowed" }
                : {}
            }
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <h6 className={styles.orText}>OR</h6>
          <Link to="/login" className={styles.forgetLink}>
            Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Resetpass;
