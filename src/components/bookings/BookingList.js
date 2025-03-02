import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import { useNavigate } from "react-router-dom";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { title: "Booking ID", dataIndex: "bookingId", key: "bookingId" },
    { title: "Car", dataIndex: "carName", key: "carName" },
    { title: "Driver", dataIndex: "driverName", key: "driverName" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "From", dataIndex: "pickupLocation", key: "pickupLocation" },
    { title: "To", dataIndex: "dropLocation", key: "dropLocation" },
    { title: "Date", dataIndex: "bookingDate", key: "bookingDate" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2>My Bookings</h2>
      <Table columns={columns} dataSource={bookings} loading={loading} rowKey={(record) => record.bookingId} />
    </div>
  );
};

export default BookingList;
