import { createListCollection } from "@chakra-ui/react";
import { ACCOUNT_STATUS, LISTING_STATUS } from "../config/constants";
import { removeToken, removeUser, removeUserRole } from "./localStorageMethods";
import { toaster } from "@/components/ui/toaster";

export const getKeyNames = (key) => {
  switch (key) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "ON_HOLD":
      return "On Hold";
    case "BLOCKED":
      return "Blocked";
  }
};

export const getConfirmMsg = (status) => {
  switch (status) {
    case 2:
      return "Do you want to approve the vendor?";
    case 3:
      return "Do you want the vendor to be on hold?";
    case 4:
      return "Do you want to block the vendor?";
  }
};

export const statuses = createListCollection({
  items: [
    ...Object.entries(ACCOUNT_STATUS).map(([label, value]) => ({
      label,
      value: String(value),
    })),
  ],
});

export const isActiveStatus = createListCollection({
  items: [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ],
});

export const listingStatuses = createListCollection({
  items: [
    ...Object.entries(LISTING_STATUS).map(([label, value]) => ({
      label,
      value: String(value),
    })),
  ],
});

export const handleLogout = () => {
  removeToken();
  removeUser();
  removeUserRole();

  toaster.create({
    type: "error",
    title: "Authentication Error",
    description: "Please sign in again.",
    closable: true,
    duration: 3000,
  });

  setTimeout(() => {
    window.location.href = "/login";
  }, 100);
};
