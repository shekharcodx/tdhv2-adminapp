import { Box, Flex, Button, Text, Heading } from "@chakra-ui/react";
import styles from "./Admins.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useCreateAdminMutation } from "@/app/api/adminApi";
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must not exceed 30 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must not exceed 30 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    toaster.promise(
      createAdmin({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap(),
      {
        loading: { title: "Creating Admin", description: "Please wait..." },
        success: (res) => {
          if (res?.code === 1500) {
            setTimeout(() => {
              navigate("/admins");
            }, 200);
          }
          return {
            title: res?.message || "Admin created successfully",
            description: "",
          };
        },
        error: (err) => {
          console.log("Admin created:err", err);
          if (err?.data?.code === 1501) {
            return {
              title: err?.data?.message,
              description: "",
            };
          }
          return {
            title: err?.data?.message || "Error creating admin",
            description: "Please try again",
          };
        },
      }
    );
  };

  return (
    <>
      <Heading fontSize="24px" fontWeight="600" mb="30px">
        CREATE ADMIN
      </Heading>
      <Flex
        justifyContent="center"
        className="border-[1px solid rgba(91, 120, 124, 1)]"
        alignItems="center"
        mt="30px"
      >
        <form
          id="change-password-form"
          className={`${styles.card} w-full md:w-[90%] border border-solid border-[rgba(91,120,124,1)]`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box className={styles.formGroup} style={{ position: "relative" }}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <Box position="relative">
              <input
                {...register("name")}
                id="name"
                type="text"
                className={styles.inputField}
                placeholder="Enter admin's name"
              />
            </Box>
            {errors.name && (
              <span className={styles.errorMsg}>{errors.name.message}</span>
            )}
          </Box>

          <Box
            mt="15px"
            className={styles.formGroup}
            style={{ position: "relative" }}
          >
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <Box position="relative">
              <input
                {...register("email")}
                id="email"
                type="email"
                className={styles.inputField}
                placeholder="Enter admin's email"
              />
            </Box>
            {errors.email && (
              <span className={styles.errorMsg}>{errors.email.message}</span>
            )}
          </Box>

          <Box
            mt="15px"
            className={styles.formGroup}
            style={{ position: "relative" }}
          >
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <Box position="relative">
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                className={styles.inputField}
                placeholder="Enter password"
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </Box>
            {errors.password && (
              <span className={styles.errorMsg}>{errors.password.message}</span>
            )}
          </Box>

          <Box
            mt="15px"
            className={styles.formGroup}
            style={{ position: "relative" }}
          >
            <label htmlFor="confirm-password" className={styles.label}>
              Confirm Password
            </label>
            <Box position="relative">
              <input
                {...register("confirmPassword")}
                onPaste={(e) => e.preventDefault()}
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className={styles.inputField}
                placeholder="Confirm password"
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </Box>
            {errors.confirmPassword && (
              <span className={styles.errorMsg}>
                {errors.confirmPassword.message}
              </span>
            )}
          </Box>
          <Flex justifyContent="end" pt="45px">
            <Button
              type="submit"
              form="change-password-form"
              px="20px"
              className={styles.gradientBtn}
              disabled={isLoading}
            >
              Create
            </Button>
          </Flex>
        </form>
      </Flex>
    </>
  );
};

export default CreateAdmin;
