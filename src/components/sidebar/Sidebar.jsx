import { Box, Drawer, Portal, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";

// ✅ Split imports between FA5 and FA6
import { FaThLarge, FaPlusCircle, FaCarAlt } from "react-icons/fa"; // v5 icons
import {
  FaCar,
  FaDatabase,
  FaEnvelope,
  FaGears,
  FaShop,
  FaUserPlus,
  FaUserShield,
} from "react-icons/fa6"; // v6 icons

import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

// =======================
// Sidebar Menu Structure
// =======================
const sideBarMenu = [
  {
    label: "Dashboard",
    route: "/",
    icon: <FaThLarge className={styles.icon} />,
    subMenu: null,
  },
  {
    label: "Vendors",
    route: "/vendors",
    icon: <FaShop className={styles.icon} />,
    subMenu: null,
  },
  {
    label: "Admins",
    route: "",
    icon: <FaUserShield className={styles.icon} />,
    subMenu: [
      {
        label: "Admins List",
        route: "/admins",
        icon: <FaUserShield className={styles.icon} />,
      },
      {
        label: "Create Admin",
        route: "/admins/create",
        icon: <FaUserPlus className={styles.icon} />,
      },
    ],
  },
  {
    label: "Car Listings",
    route: "/car-listings",
    icon: <FaCar className={styles.icon} />,
    subMenu: null,
  },
  {
    label: "Content",
    route: "",
    icon: <FaDatabase className={styles.icon} />,
    subMenu: [
      {
        label: "Blogs",
        route: "/admin/blogs",
        icon: <FaPlusCircle className={styles.icon} />,
      },
      {
        label: "FAQs",
        route: "/content/faqs",
        icon: <FaPlusCircle className={styles.icon} />,
      },
      {
        label: "Testimonials",
        route: "/content/testimonials",
        icon: <FaPlusCircle className={styles.icon} />,
      },
    ],
  },
  {
    label: "Offers",
    route: "/offers",
    icon: <FaPlusCircle className={styles.icon} />,
    subMenu: null,
  },
  {
    label: "Leads",
    route: "",
    icon: <FaEnvelope className={styles.icon} />,
    subMenu: [
      {
        label: "Vendors Leads",
        route: "/leads/vendor-leads",
        icon: <FaPlusCircle className={styles.icon} />,
      },
      {
        label: "User Leads",
        route: "/leads/user-leads",
        icon: <FaPlusCircle className={styles.icon} />,
      },
    ],
  },
  {
    label: "Analytics",
    route: "/analytics",
    icon: <FaThLarge className={styles.icon} />,
    subMenu: null,
  },
  {
    label: "Settings",
    route: "",
    icon: <FaGears className={styles.icon} />,
    subMenu: [
      {
        label: "General",
        route: "/settings/general",
        icon: <FaGears className={styles.icon} />,
      },
      {
        label: "SEO & Meta",
        route: "/settings/seo-meta",
        icon: <FaGears className={styles.icon} />,
      },
      {
        label: "Integrations",
        route: "/settings/integrations",
        icon: <FaGears className={styles.icon} />,
      },
      {
        label: "Roles & Permissions",
        route: "/settings/roles-permissions",
        icon: <FaUserShield className={styles.icon} />,
      },
      {
        label: "Car Data",
        route: "/car-data",
        icon: <FaCarAlt className={styles.icon} />,
      },
      {
        label: "Car Reference Data",
        route: "/car-reference-data",
        icon: <FaCarAlt className={styles.icon} />,
      },
      {
        label: "Email Templates",
        route: "/email-templates",
        icon: <FaEnvelope className={styles.icon} />,
      },
    ],
  },
  {
    label: "Bookings",
    route: "/bookings",
    icon: <FaCarAlt className={styles.icon} />,
    subMenu: null,
  },
  {
    label: "Support",
    route: "/support",
    icon: <FaEnvelope className={styles.icon} />,
    subMenu: null,
  },
];

// =======================
// Sidebar Component
// =======================
const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const currentPath = location.pathname;

  useEffect(() => {
    sideBarMenu.forEach((item) => {
      if (item.subMenu) {
        const hasMatch = item.subMenu.some((sub) =>
          currentPath.startsWith(sub.route)
        );
        if (hasMatch) {
          setOpenMenu(item.label);
        }
      } else if (item.route) {
        if (item.route === "/" && currentPath === "/") {
          setOpenMenu(null);
        } else if (item.route !== "/" && currentPath.startsWith(item.route)) {
          setOpenMenu(null);
        }
      }
    });
  }, [currentPath]);

  const handleMenuClick = (item) => {
    if (item.subMenu) {
      setOpenMenu(openMenu === item.label ? null : item.label);
    } else if (item.route) {
      setOpenMenu(null);
      navigate(item.route);
      onClose(false);
    }
  };

  const renderMenu = (isMobile = false) => (
    <nav
      className={`${styles.menu} max-h-[80vh] overflow-auto scrollbar-thin
         scrollbar-thumb-gray-400
         scrollbar-thumb-rounded-full
         hover:scrollbar-thumb-gray-500
         scrollbar-track-gray-100`}
    >
      <ul>
        {sideBarMenu.map((item) => {
          const isActive =
            (item.route === "/" && currentPath === "/") ||
            (item.route &&
              item.route !== "/" &&
              currentPath.startsWith(item.route)) ||
            (item.subMenu &&
              item.subMenu.some((sub) => currentPath.startsWith(sub.route)));

          return (
            <li key={item.label}>
              {/* Parent Menu */}
              <div
                onClick={() => handleMenuClick(item)}
                className={`${styles.menuHeader} ${
                  isActive ? styles.active : ""
                }`}
              >
                <Flex justify="space-between" align="center">
                  <Flex align="center">
                    {item.icon}
                    <span>{item.label}</span>
                  </Flex>
                  {item.subMenu &&
                    (openMenu === item.label ? (
                      <FaChevronDown size={12} />
                    ) : (
                      <FaChevronRight size={12} />
                    ))}
                </Flex>
              </div>

              {/* Submenu */}
              {item.subMenu && (
                <ul
                  className={`${styles.subMenu} ${
                    openMenu === item.label ? styles.open : ""
                  }`}
                >
                  {item.subMenu.map((sub) => {
                    const subActive = currentPath.startsWith(sub.route);
                    return (
                      <li
                        key={sub.label}
                        onClick={() => {
                          navigate(sub.route);
                          if (isMobile) onClose(false);
                        }}
                        className={`${styles.subMenuItem} ${
                          subActive ? styles.active : ""
                        }`}
                      >
                        <Flex alignItems="center" gap="5px" p="6px 25px">
                          {sub.icon}
                          {sub.label}
                        </Flex>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        className={styles.sidebar}
        display={{ base: "none", md: "block" }}
        pt="8px"
      >
        <div className="py-2 border-b border-[#eeeaea]">
          <img src={logo} alt="logo" className={styles.logo} />
        </div>
        {renderMenu(false)}
      </Box>

      {/* Mobile Drawer Sidebar */}
      <Drawer.Root
        placement="start"
        open={isOpen}
        onOpenChange={(e) => onClose(e.open)}
        closeOnInteractOutside={false}
        zIndex={9999}
      >
        <Portal>
          <Drawer.Backdrop zIndex="9999" />
          <Drawer.Positioner zIndex="9999">
            <Drawer.Content w="259px">
              <Drawer.Body p="0px" overflowX="hidden">
                <aside className={`${styles.sidebar} overflow-x-hidden`}>
                  <button
                    className="absolute left-full top-[9px] bg-[linear-gradient(90deg,rgba(91,120,124,1)0%,rgba(137,180,188,1)35%)] rounded-r-full p-12 mr-[5px] mt-[5px]"
                    onClick={() => onClose(false)}
                  >
                    <X size="20px" color="#fff" />
                  </button>
                  <div className="py-14">
                    <img src={logo} alt="logo" className={styles.logo} />
                  </div>
                  <div className="max-h-[80vh] overflow-auto">
                    {renderMenu(true)}
                  </div>
                </aside>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default Sidebar;
