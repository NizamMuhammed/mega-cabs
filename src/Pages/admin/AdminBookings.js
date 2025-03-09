import React, { useState, useEffect } from "react";
import { Table, Select, message, Typography, Space, Tag, Button } from "antd";
import api from "../../api/axiosConfig";

const { Option } = Select;

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchBookings();
    fetchDrivers();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/bookings/all");
      setBookings(response.data);
    } catch (error) {
      message.error("Failed to fetch bookings");
    }
    setLoading(false);
  };

  const fetchDrivers = async () => {
    try {
      const response = await api.get("/api/v1/drivers");
      setDrivers(response.data);
    } catch (error) {
      message.error("Failed to fetch drivers");
    }
  };

  const handleAssignDriver = async (bookingId, driverId) => {
    try {
      await api.put(`/api/v1/bookings/${bookingId}/assign-driver`, { driverId });
      message.success("Driver assigned successfully");
      fetchBookings(); // Refresh bookings list
    } catch (error) {
      message.error("Failed to assign driver");
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/api/v1/bookings/${bookingId}/status`, { status: newStatus });
      message.success("Booking status updated successfully");
      fetchBookings();
    } catch (error) {
      message.error("Failed to update booking status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#faad14";
      case "ASSIGNED":
        return "#1890ff";
      case "IN_PROGRESS":
        return "#52c41a";
      case "COMPLETED":
        return "#52c41a";
      case "CANCELLED":
        return "#ff4d4f";
      default:
        return "default";
    }
  };

  const columns = [
    { title: "User", dataIndex: "userId", key: "userId" },
    { title: "Pickup", dataIndex: "pickupLocation", key: "pickupLocation" },
    { title: "Drop", dataIndex: "dropLocation", key: "dropLocation" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Cab Type", dataIndex: "cabType", key: "cabType" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Assign Driver",
      key: "action",
      render: (_, record) => (
        <Select style={{ width: 160 }} placeholder="Select driver" onChange={(value) => handleAssignDriver(record.bookingId, value)} defaultValue={record.driverId || undefined}>
          {drivers.map((driver) => (
            <Option key={driver.driverId} value={driver.driverId}>
              {driver.driverName}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Select defaultValue={record.status} style={{ width: 120 }} onChange={(value) => handleStatusChange(record.bookingId, value)}>
            <Option value="PENDING">Pending</Option>
            <Option value="ASSIGNED">Assigned</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>All Bookings</Typography.Title>
      <Table columns={columns} dataSource={bookings} loading={loading} rowKey="bookingId" />
    </div>
  );
};

export default AdminBookings;
