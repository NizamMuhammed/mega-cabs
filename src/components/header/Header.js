import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Dropdown, Modal, Space, Typography, Drawer } from "antd";
import { LogoutOutlined, UserOutlined, MenuOutlined, DownOutlined, TeamOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive"; // Add this import at the top

const { Header: AntHeader } = Layout;
const { Text } = Typography;

// Custom color palette to match Home component
const colors = {
  primary: "#6C63FF",
  secondary: "#2A2A72",
  background: "#1A1A2E",
  text: "#FFFFFF",
};

// Add these styles near the top of the file
const headerStyles = {
  link: {
    textDecoration: "none",
    color: colors.primary,
    "&:hover": {
      textDecoration: "none",
    },
  },
  menuItem: {
    textDecoration: "none !important",
  },
};

const Header = ({ isAuth, userName, setIsAuth, userRoles }) => {
  const [showReloginDialog, setShowReloginDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // For getting the current route
  const isCustomer = userRoles.includes("CUSTOMER");
  const isAdmin = userRoles.includes("ADMIN");
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const menuItems = [
    ...(!isAdmin
      ? [
          {
            key: "home",
            label: "Home",
            path: "/",
          },
          {
            key: "about",
            label: "About",
            path: "/about",
          },
          {
            key: "help",
            label: "Help",
            path: "/help",
          },
        ]
      : []),
    ...(isAuth && isCustomer
      ? [
          {
            key: "dashboard",
            label: "Dashboard",
            path: "/dashboard",
          },
          {
            key: "book-cab",
            label: "Book a Cab",
            path: "/book-cab",
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            key: "admin-dashboard",
            label: "Dashboard",
            path: "/admin/dashboard",
          },
          {
            key: "bookings",
            label: "All Bookings",
            path: "/admin/bookings",
          },
          {
            key: "cars",
            label: "Manage Cars",
            path: "/cars",
          },
          {
            key: "drivers",
            label: "Manage Drivers",
            path: "/drivers",
          },
          {
            key: "manageUsers",
            path: "/admin/users",
            label: "Manage Users",
          },
        ]
      : []),
  ];

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (isAuth) {
        const token = localStorage.getItem("jwtToken");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expTime = payload.exp * 1000; // convert to milliseconds
            const currentTime = Date.now();
            const timeToExpire = expTime - currentTime;

            // If token is expired or will expire in next 5 seconds
            if (timeToExpire <= 5000) {
              console.log(`Token expired/expiring. Difference: ${timeToExpire}ms`);
              setShowReloginDialog(true);
              handleLogout();
            } else {
              // Set timeout to check again just before expiration
              const timeout = setTimeout(checkTokenExpiration, timeToExpire - 5000);
              return () => clearTimeout(timeout);
            }
          } catch (error) {
            console.error("Error parsing JWT:", error);
            handleLogout();
          }
        }
      }
    };

    checkTokenExpiration();
  }, [isAuth]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("roles");
    setIsAuth(false);
    setShowLogoutDialog(false);
    navigate("/login");
  };

  const handleRelogin = () => {
    setShowReloginDialog(false);
    navigate("/login");
  };

  const profileMenu = {
    items: [
      {
        key: "roles",
        label: (
          <div
            style={{
              padding: "8px 16px",
              background: colors.background,
              borderRadius: "4px",
              margin: "4px 0",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.65)" }}>Your Role:</Text>
            {userRoles.map((role) => (
              <Text
                key={role}
                style={{
                  color: colors.text,
                  display: "block",
                  padding: "4px 0",
                  fontSize: "14px",
                }}
              >
                {role}
              </Text>
            ))}
          </div>
        ),
      },
      {
        type: "divider",
        style: { background: "rgba(255,255,255,0.1)" },
      },
      {
        key: "logout",
        danger: true,
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: () => setShowLogoutDialog(true),
      },
    ],
  };

  return (
    <>
      <AntHeader
        style={{
          background: colors.background,
          padding: "0 16px",
          position: "fixed",
          width: "100%",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Link to="/" style={{ ...headerStyles.link, fontSize: isMobile ? "20px" : "24px", fontWeight: "bold" }}>
            MegaCabs
          </Link>

          {/* Desktop Menu */}
          {!isMobile && (
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              style={{
                background: "transparent",
                border: "none",
                flex: 1,
                justifyContent: "center",
              }}
              items={menuItems.map((item) => ({
                key: item.path,
                label: (
                  <Link to={item.path} style={{ color: colors.text, textDecoration: "none" }}>
                    {item.label}
                  </Link>
                ),
              }))}
            />
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              icon={<MenuOutlined />}
              style={{
                marginRight: "12px",
                background: "transparent",
                border: "none",
                color: colors.text,
              }}
              onClick={() => setMobileMenuVisible(true)}
            />
          )}

          {/* Auth Button/Profile */}
          {isAuth ? (
            <Dropdown menu={profileMenu} placement="bottomRight" trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar style={{ backgroundColor: colors.primary }}>{userName?.charAt(0)?.toUpperCase()}</Avatar>
                {!isMobile && <span style={{ color: colors.text }}>{userName}</span>}
                <DownOutlined style={{ fontSize: "12px", color: colors.text }} />
              </Space>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              href="/login"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                border: "none",
              }}
            >
              Login
            </Button>
          )}
        </div>
      </AntHeader>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        styles={{
          header: { background: colors.background, color: colors.text },
          body: { background: colors.background, padding: 0 },
        }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          style={{ background: "transparent", border: "none" }}
          items={menuItems.map((item) => ({
            key: item.path,
            label: (
              <Link to={item.path} onClick={() => setMobileMenuVisible(false)} style={{ color: colors.text }}>
                {item.label}
              </Link>
            ),
          }))}
        />
      </Drawer>

      <Modal title="Confirm Logout" open={showLogoutDialog} onOk={handleLogout} onCancel={() => setShowLogoutDialog(false)}>
        <p>Are you sure you want to logout?</p>
      </Modal>

      <Modal
        title="Session Expired"
        open={showReloginDialog}
        onOk={handleRelogin}
        onCancel={() => {
          setShowReloginDialog(false);
          navigate("/login");
        }}
        closable={false}
        maskClosable={false}
        keyboard={false}
      >
        <p>Your session has expired. Please login again to continue.</p>
      </Modal>

      {/* Add spacing to account for fixed header */}
      <div style={{ height: 64 }} />
    </>
  );
};

export default Header;
