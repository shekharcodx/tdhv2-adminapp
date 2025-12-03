"use client";

import React, { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/app/api/authApi";
import { toaster } from "@/components/ui/toaster";
import { setToken, setUserRole, setUser } from "@/utils/localStorageMethods";
import { Eye, EyeOff } from "lucide-react";

// form + validation
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ validation schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must not exceed 30 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  // ✅ hook form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    toaster.promise(login(formData).unwrap(), {
      success: (res) => {
        console.log("Login:", { res });
        if (res.code === 9011 && res?.data?.role === 1) {
          setToken(res.data?.token);
          setUserRole(res.data?.role);
          setUser(res.data);
          navigate("/");
        }
        if (res?.data?.role !== 1) {
          throw new Error("You are not authorized to access this panel");
        }
        return {
          title: res.message || "Successfully logged in!",
          description: "",
        };
      },
      error: (err) => {
        if (err?.data?.code === 9010) {
          navigate("/change-password");
        }
        return {
          title: err?.message || err?.data?.message || "Failed to login.",
          description: "Please try again.",
        };
      },
      loading: { title: "Logging in", description: "Please wait" },
    });
  };

  return (
    <div className={styles.signinWrapper}>
      <div className={styles.cardWrapper}>
        <div className={styles.signinCard}>
          <h3 className={styles.title}>LOGIN</h3>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={styles.inputField}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className={styles.errorMsg}>{errors.email.message}</span>
              )}
            </div>

            {/* Password with Show/Hide */}
            <div className={styles.formGroup} style={{ position: "relative" }}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                className={styles.inputField}
                placeholder="Enter your password"
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password && (
                <span className={styles.errorMsg}>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
              style={
                isLoading
                  ? { backgroundColor: "#ccc", cursor: "not-allowed" }
                  : {}
              }
            >
              Login
            </button>

            {/* Only Forget Password link */}
            <Link to="/forget-password" className={styles.forgetLink}>
              Forgot Password?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
