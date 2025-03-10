import React, { useState, useEffect } from "react";
import { Card, Table, Tag, Space, Select, message } from "antd";
import api from "../../api/axiosConfig";

const { Option } = Select;

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const driverId = localStorage.getItem("userId");

  useEffect(() => {
    fetchDriverBookings();
  }, []);

  const fetchDriverBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/bookings/driver/${driverId}`);
      setBookings(response.data);
    } catch (error) {
      message.error("Failed to fetch bookings");
    }
    setLoading(false);
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      await api.put(`/api/v1/bookings/${bookingId}/status`, { status });
      message.success("Status updated successfully");
      fetchDriverBookings();
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const columns = [
    { title: "Pickup", dataIndex: "pickupLocation" },
    { title: "Drop", dataIndex: "dropLocation" },
    { title: "Date", dataIndex: "date" },
    { title: "Time", dataIndex: "time" },
    { title: "Customer", dataIndex: "userName" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <Tag color={status === "COMPLETED" ? "green" : "blue"}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Select defaultValue={record.status} style={{ width: 130 }} onChange={(value) => handleStatusChange(record.bookingId, value)}>
          <Option value="ACCEPTED">Accept</Option>
          <Option value="PICKED_UP">Picked Up</Option>
          <Option value="IN_PROGRESS">In Progress</Option>
          <Option value="COMPLETED">Completed</Option>
        </Select>
      ),
    },
  ];

  return (
    <Card title="My Assigned Rides" style={{ margin: "24px" }}>
      <Table columns={columns} dataSource={bookings} loading={loading} rowKey="bookingId" />
    </Card>
  );
};

export default DriverDashboard;
