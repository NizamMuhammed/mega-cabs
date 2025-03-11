import React, { useState, useEffect } from "react";
import { Table, Select, message, Typography, Space, Tag, Card, Switch } from "antd";
import api from "../../../api/axiosConfig";

const { Option } = Select;

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const driverId = localStorage.getItem("userId");
  const [driverDetails, setDriverDetails] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    fetchDriverBookings();
    fetchDriverDetails();
  }, []);

  const fetchDriverBookings = async () => {
    setLoading(true);
    try {
      // First get driver details to get the driverId
      const driverResponse = await api.get(`/api/v1/drivers/user/${driverId}`);
      const actualDriverId = driverResponse.data.driverId;
      console.log("Driver ID:", actualDriverId);

      // Then fetch bookings using the actual driverId
      const response = await api.get(`/api/v1/bookings/driver/${actualDriverId}`);
      console.log("Bookings full response:", response);
      console.log("Bookings data:", response.data);

      if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        console.error("Unexpected bookings data format:", response.data);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      console.error("Error details:", error.response || error);
      message.error("Failed to fetch bookings: " + (error.response?.data?.message || error.message));
      setBookings([]);
    }
    setLoading(false);
  };

  const fetchDriverDetails = async () => {
    try {
      // Changed endpoint to get driver by userId
      const response = await api.get(`/api/v1/drivers/user/${driverId}`);
      setDriverDetails(response.data);
    } catch (error) {
      message.error("Failed to fetch driver details");
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/api/v1/bookings/${bookingId}/status`, { status: newStatus });
      message.success("Status updated successfully");
      fetchDriverBookings();
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleAvailabilityToggle = async (checked) => {
    try {
      const response = await api.put(`/api/v1/drivers/${driverDetails.driverId}/status`, {
        driverStatus: checked ? "AVAILABLE" : "UNAVAILABLE",
      });

      if (response.status === 200) {
        setIsAvailable(checked);
        message.success(`You are now ${checked ? "available" : "unavailable"} for rides`);
        fetchDriverDetails();
      }
    } catch (error) {
      console.error("Error updating driver status:", error.response || error);
      message.error("Failed to update availability status: " + (error.response?.data?.message || error.message));
      setIsAvailable(!checked);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "#1890ff";
      case "IN_PROGRESS":
        return "#faad14";
      case "COMPLETED":
        return "#52c41a";
      case "CANCELLED":
        return "#ff4d4f";
      default:
        return "default";
    }
  };

  const columns = [
    { title: "Pickup", dataIndex: "pickupLocation", key: "pickupLocation" },
    { title: "Drop", dataIndex: "dropLocation", key: "dropLocation" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Cab Type", dataIndex: "cabType", key: "cabType" },
    { title: "Price", dataIndex: "price", key: "price", render: (price) => `LKR ${price}.00` },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record.bookingId, value)}
            disabled={record.status === "COMPLETED" || record.status === "CANCELLED"}
          >
            <Option value="ASSIGNED">Assigned</Option>
            <Option value="IN_PROGRESS">Started Trip</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#141414", minHeight: "100vh" }}>
      <Card style={{ marginBottom: 24, background: "#1f1f1f", borderColor: "#434343" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Title level={2} style={{ color: "white", margin: 0 }}>
            My Assigned Rides
          </Typography.Title>
          {driverDetails && (
            <Space direction="vertical" style={{ marginTop: 16 }}>
              <Typography.Text style={{ color: "#8c8c8c" }}>
                Driver ID: <Tag color="blue">{driverDetails.driverId}</Tag>
              </Typography.Text>
              <Typography.Text style={{ color: "#8c8c8c" }}>
                User ID: <Tag color="purple">{driverDetails.user.userId}</Tag>
              </Typography.Text>
              <Space>
                <Typography.Text style={{ color: "#8c8c8c" }}>Availability:</Typography.Text>
                <Switch checked={driverDetails.driverStatus === "AVAILABLE"} onChange={handleAvailabilityToggle} checkedChildren="Available" unCheckedChildren="Unavailable" />
              </Space>
            </Space>
          )}
        </Space>
      </Card>

      <Card style={{ background: "#1f1f1f", borderColor: "#434343" }}>
        <Table columns={columns} dataSource={bookings} loading={loading} rowKey="bookingId" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default DriverDashboard;
