import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Statistic, Table, Button, Tag, Space, message } from "antd";
import { CircularProgress } from "@mui/material";
import { UserOutlined, CarOutlined, BookOutlined, TeamOutlined, DollarCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

const colors = {
  primary: "#6C63FF",
  secondary: "#2A2A72",
  background: "#1A1A2E",
  text: "#FFFFFF",
};

const StatCard = ({ title, value, icon, loading, onClick }) => (
  <div onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
    <Card
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        borderRadius: "15px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        border: "none",
      }}
      styles={{
        body: { padding: "24px" },
      }}
    >
      <Statistic
        title={<span style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px" }}>{title}</span>}
        value={value}
        valueStyle={{ color: colors.text, fontSize: "28px", fontWeight: "bold" }}
        prefix={React.cloneElement(icon, { style: { fontSize: "24px", color: colors.text } })}
        formatter={(val) => (loading ? <CircularProgress size={20} /> : val)}
      />
    </Card>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, drivers: 0, bookings: 0, cars: 0 });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenue, setRevenue] = useState({ daily: 0, monthly: 0 });
  const [activeDrivers, setActiveDrivers] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, driversRes, bookingsRes, carsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/users/count", { headers }),
          axios.get("http://localhost:8080/api/v1/users/count/drivers", { headers }),
          axios.get("http://localhost:8080/api/v1/bookings/count", { headers }),
          axios.get("http://localhost:8080/api/v1/cars/count", { headers }),
        ]);

        setStats({
          users: usersRes.data,
          drivers: driversRes.data,
          bookings: bookingsRes.data,
          cars: carsRes.data,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        message.error("Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    const fetchAdditionalData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [bookingsRes, revenueRes, driversRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/bookings/recent", { headers }),
          axios.get("http://localhost:8080/api/v1/bookings/revenue", { headers }),
          axios.get("http://localhost:8080/api/v1/drivers/active", { headers }),
        ]);

        setRecentBookings(bookingsRes.data);
        setRevenue(revenueRes.data);
        setActiveDrivers(driversRes.data);
      } catch (error) {
        message.error("Failed to fetch additional data");
      }
    };

    fetchStats();
    fetchAdditionalData();
  }, []);

  const bookingsColumns = [
    { title: "Booking ID", dataIndex: "id", key: "id" },
    { title: "Customer", dataIndex: "customerName", key: "customer" },
    { title: "Date", dataIndex: "bookingDate", key: "date" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "completed" ? "green" : status === "ongoing" ? "blue" : "orange"}>{status.toUpperCase()}</Tag>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ padding: 24, background: colors.background }}>
          <h1 style={{ color: colors.text, marginBottom: "24px" }}>Admin Dashboard</h1>

          {/* Existing Stats Row */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard title="Total Bookings" value={stats.bookings} icon={<BookOutlined />} loading={loading} onClick={() => navigate("/admin/bookings")} />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard title="Total Cars" value={stats.cars} icon={<CarOutlined />} loading={loading} onClick={() => navigate("/cars")} />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard title="Total Drivers" value={stats.drivers} icon={<TeamOutlined />} loading={loading} onClick={() => navigate("/drivers")} />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard title="Total Users" value={stats.users} icon={<UserOutlined />} loading={loading} onClick={() => navigate("/admin/users")} />
            </Col>
          </Row>

          {/* Active Drivers */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title="Active Drivers Status" style={{ background: colors.secondary, color: colors.text }}>
                {activeDrivers.map((driver) => (
                  <Tag key={driver.driverId} color={driver.driverStatus === "AVAILABLE" ? "green" : "orange"} style={{ margin: "5px" }}>
                    {driver.driverName} - {driver.driverStatus}
                  </Tag>
                ))}
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title="Quick Actions" style={{ background: colors.secondary, color: colors.text }}>
                <Space>
                  <Button type="primary">Add New Driver</Button>
                  <Button type="primary">Add New Vehicle</Button>
                  <Button>View All Bookings</Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
