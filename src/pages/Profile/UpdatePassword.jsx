import { Box, Button, Dialog, Portal } from "@chakra-ui/react";
import styles from "./VendorProfile.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useUpdatePasswordMutation } from "@/app/api/profileApi";
import { toaster } from "@/components/ui/toaster";

const updatePwSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must not exceed 30 characters"),

    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must not exceed 30 characters"),

    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must not exceed 30 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 error will show under confirmPassword
  });

const UpdatePassword = ({ isOpen, setIsOpen }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [UpdatePassword, { isLoading }] = useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(updatePwSchema),
  });

  const onSubmit = (data) => {
    toaster.promise(
      UpdatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap(),
      {
        loading: { title: "Updating password", description: "Please wait..." },
        success: (res) => {
          if (res?.code === 9029) {
            setTimeout(() => {
              setIsOpen(false);
              reset();
            }, 200);
          }
          return {
            title: res?.message || "Password updated successfully",
            description: "",
          };
        },
        error: (err) => {
          console.log("UpdatePassword:err", err);
          if (err?.data?.code === 9000) {
            return {
              title: err?.data?.message,
              description: "Please try again with correct password",
            };
          }
          return {
            title: err?.data?.message || "Error updating password",
            description: "Please try again",
          };
        },
      }
    );
  };

  return (
    <Dialog.Root
      size="sm"
      lazyMount
      closeOnInteractOutside={false}
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <Portal>
        <Dialog.Backdrop zIndex="9999" />
        <Dialog.Positioner zIndex="99999">
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Change Password</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form id="change-password-form" onSubmit={handleSubmit(onSubmit)}>
                <Box
                  className={styles.formGroup}
                  style={{ position: "relative" }}
                >
                  <label htmlFor="current-password" className={styles.label}>
                    Current Password
                  </label>
                  <Box position="relative">
                    <input
                      {...register("currentPassword")}
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      className={styles.inputField}
                      placeholder="Enter your current password"
                    />
                    <span
                      className={styles.eyeIcon}
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </span>
                  </Box>
                  {errors.currentPassword && (
                    <span className={styles.errorMsg}>
                      {errors.currentPassword.message}
                    </span>
                  )}
                </Box>

                <Box
                  mt="15px"
                  className={styles.formGroup}
                  style={{ position: "relative" }}
                >
                  <label htmlFor="new-password" className={styles.label}>
                    New Password
                  </label>
                  <Box position="relative">
                    <input
                      {...register("newPassword")}
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      className={styles.inputField}
                      placeholder="Enter your new password"
                    />
                    <span
                      className={styles.eyeIcon}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </span>
                  </Box>
                  {errors.newPassword && (
                    <span className={styles.errorMsg}>
                      {errors.newPassword.message}
                    </span>
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </span>
                  </Box>
                  {errors.confirmPassword && (
                    <span className={styles.errorMsg}>
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </Box>
              </form>
            </Dialog.Body>
            <Dialog.Footer justifyContent="space-between" pb="25px">
              <Dialog.ActionTrigger asChild>
                <Button
                  disabled={isLoading}
                  px="25px"
                  variant="outline"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                form="change-password-form"
                px="20px"
                className={styles.gradientBtn}
                disabled={isLoading}
              >
                Update Password
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default UpdatePassword;
