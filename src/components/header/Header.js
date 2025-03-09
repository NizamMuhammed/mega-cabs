import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Dropdown, Modal, Space, Typography } from "antd";
import { LogoutOutlined, UserOutlined, CarOutlined, DashboardOutlined, DownOutlined } from "@ant-design/icons";

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
  const navigate = useNavigate();
  const location = useLocation(); // For getting the current route
  const isCustomer = userRoles.includes("CUSTOMER");
  const isAdmin = userRoles.includes("ADMIN");

  const menuItems = [
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
        ]
      : []),
  ];

  useEffect(() => {
    if (isAuth) {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const expTime = payload.exp * 1000; // convert to milliseconds
          if (Date.now() >= expTime) {
            setShowReloginDialog(true);
            handleLogout();
          }
        } catch (error) {
          console.error("Error parsing JWT:", error);
        }
      }
    }
  }, [isAuth]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("roles");
    setIsAuth(false);
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
          padding: "0 24px",
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
          <Link
            to="/"
            style={{
              ...headerStyles.link,
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            MegaCabs
          </Link>

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
                <Link
                  to={item.path}
                  style={{
                    color: colors.text,
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </Link>
              ),
            }))}
          />

          {isAuth ? (
            <Dropdown
              menu={profileMenu}
              placement="bottomRight"
              trigger={["click"]}
              dropdownRender={(menu) => (
                <div
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.primary}20`,
                    borderRadius: "8px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
                    minWidth: "200px",
                  }}
                >
                  {menu}
                </div>
              )}
            >
              <Space
                style={{
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: `${colors.primary}15`,
                  },
                }}
              >
                <Avatar
                  style={{
                    backgroundColor: colors.primary,
                    verticalAlign: "middle",
                  }}
                >
                  {userName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <span style={{ color: colors.text }}>{userName}</span>
                <DownOutlined
                  style={{
                    fontSize: "12px",
                    color: colors.text,
                    opacity: 0.7,
                    transition: "transform 0.3s",
                  }}
                />
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

      <Modal title="Confirm Logout" open={showLogoutDialog} onOk={handleLogout} onCancel={() => setShowLogoutDialog(false)}>
        <p>Are you sure you want to logout?</p>
      </Modal>

      <Modal
        title="Session Expired"
        open={showReloginDialog}
        onOk={handleRelogin}
        onCancel={() => setShowReloginDialog(false)}
        footer={[
          <Button key="login" type="primary" onClick={handleRelogin}>
            Login
          </Button>,
        ]}
      >
        <p>Your session has expired. Please login again to continue.</p>
      </Modal>

      {/* Add spacing to account for fixed header */}
      <div style={{ height: 64 }} />
    </>
  );
};

export default Header;
