import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, Portal } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { toaster } from "@/components/ui/toaster";
import { useLogoutMutation } from "@/app/api/authApi";
import { baseApi } from "@/app/api/baseApi";
import { useDispatch } from "react-redux";
import {
  removeToken,
  removeUserRole,
  removeUser,
  getUser,
} from "@/utils/localStorageMethods";
import UpdatePassword from "@/pages/Profile/UpdatePassword";
import placeholderImage from "@/assets/images/avatar.svg";

const Header = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [logoutUser] = useLogoutMutation();

  const handleSignOut = () => {
    toaster.promise(logoutUser(), {
      loading: { title: "Signing out", description: "Please wait..." },
      success: (res) => {
        removeToken();
        removeUserRole();
        removeUser();
        navigate("/login");
        dispatch(baseApi.util.resetApiState());
        return {
          title: res?.message || "Signed out successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: "Error signing out",
          description: "Please try again",
        };
      },
    });
  };

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  return (
    <>
      <div className={styles.topHeader} style={{ zIndex: 9999 }}>
        <div className={styles.leftSection}>
          <img src={logo} alt="logo" className={styles.logo} />
        </div>

        <div className={styles.rightSection} ref={dropdownRef}>
          <Button
            variant="ghost"
            display={{ base: "block", md: "none" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars color="rgba(91, 120, 124, 1)" />
          </Button>
          <Menu.Root positioning={{ placement: "bottom" }}>
            <Menu.Trigger rounded="full" cursor="pointer">
              <Avatar.Root size="sm">
                <img
                  src={user?.profilePicture || placeholderImage}
                  alt="User Avatar"
                  className={styles.avatar}
                />
              </Avatar.Root>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner css={{ zIndex: !"9999" }} zIndex="9999">
                <Menu.Content>
                  <Menu.Item
                    value="profile"
                    cursor="pointer"
                    onClick={() => navigate("/profile")}
                  >
                    👤 Profile
                  </Menu.Item>
                  <Menu.Item
                    value="change-password"
                    cursor="pointer"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    🔒 Change Password
                  </Menu.Item>
                  <Menu.Item
                    value="sign-out"
                    cursor="pointer"
                    onClick={handleSignOut}
                  >
                    🚪 Sign Out
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </div>
      <UpdatePassword isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};

export default Header;
