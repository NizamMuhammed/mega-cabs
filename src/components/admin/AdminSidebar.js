import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { UserOutlined, CarOutlined, FileTextOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const AdminSidebar = () => {
  const items = [
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: "drivers",
      icon: <CarOutlined />,
      label: <Link to="/admin/drivers">Drivers</Link>,
    },
    {
      key: "reports",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/reports">Reports</Link>,
    },
  ];

  return (
    <Sider width={200} className="site-layout-background">
      <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100%", borderRight: 0 }} items={items} />
    </Sider>
  );
};

export default AdminSidebar;
