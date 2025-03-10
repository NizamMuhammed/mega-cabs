import React, { useState, useEffect } from "react";
import { Layout, Typography, Card, List, Button, Tag, Space, Modal, message } from "antd";
import { CarOutlined, ClockCircleOutlined, CheckCircleOutlined, EnvironmentOutlined, DollarOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../api/axiosConfig";
import driverService from "../../services/driverService";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;

const colors = {
  primary: "#6C63FF",
  secondary: "#2A2A72",
  background: "#1A1A2E",
  text: "#FFFFFF",
  cardBg: "rgba(255, 255, 255, 0.05)",
};

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const fetchDriverDetails = async (bookings) => {
    const updatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.driverId) {
          try {
            const driverResponse = await driverService.getDriverById(booking.driverId);
            return {
              ...booking,
              assignedDriver: {
                name: driverResponse.data.driverName,
                phone: driverResponse.data.driverPhone,
              },
            };
          } catch (error) {
            console.error("Error fetching driver details:", error);
            return booking;
          }
        }
        return booking;
      })
    );
    return updatedBookings;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/v1/bookings");
        const bookingsWithDrivers = await fetchDriverDetails(response.data);
        // Sort bookings by date and time, most recent first
        const sortedBookings = bookingsWithDrivers.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA;
        });
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.message || "An error occurred while fetching bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleBookNowClick = () => {
    navigate("/book-cab");
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.delete(`/api/v1/bookings/${bookingId}`);
      // Remove the booking from the UI state
      const updatedBookings = bookings.filter((booking) => booking.bookingId !== bookingId);
      if (updatedBookings.length < bookings.length) {
        setBookings(updatedBookings);
        setSnackbarMessage("Booking cancelled successfully");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setSnackbarMessage("Failed to cancel booking");
      setOpenSnackbar(true);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const getStatusTag = (status) => {
    const statusProps = {
      PENDING: { color: "orange", icon: <ClockCircleOutlined /> },
      ASSIGNED: { color: "blue", icon: <CarOutlined /> },
      COMPLETED: { color: "green", icon: <CheckCircleOutlined /> },
      CANCELLED: { color: "red", icon: <DeleteOutlined /> },
    };
    const { color, icon } = statusProps[status] || statusProps.PENDING;
    return (
      <Tag icon={icon} color={color}>
        {status}
      </Tag>
    );
  };

  return (
    <Layout style={{ background: colors.background }}>
      <Content style={{ padding: "2rem" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={2} style={{ color: colors.text, margin: 0 }}>
              Your Bookings
            </Title>
            <Button
              type="primary"
              onClick={handleBookNowClick}
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                border: "none",
              }}
            >
              Book Now
            </Button>
          </div>

          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={bookings}
            renderItem={(booking) => (
              <List.Item>
                <Card
                  style={{
                    background: `linear-gradient(135deg, ${colors.cardBg}, rgba(108, 99, 255, 0.05))`,
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                  hoverable
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Text style={{ color: colors.text, fontSize: "16px", fontWeight: "bold" }}>
                        Cab Type: {booking.cabBrand}
                        {booking.cabType}
                        {booking.cabName}
                      </Text>
                      {getStatusTag(booking.status)}
                    </div>

                    {/* Location Information */}
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <Space direction="vertical" size="small">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <EnvironmentOutlined style={{ color: "#52c41a" }} />
                          <Text style={{ color: colors.text }}>From: {booking.pickupLocation}</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <EnvironmentOutlined style={{ color: "#f5222d" }} />
                          <Text style={{ color: colors.text }}>To: {booking.dropLocation}</Text>
                        </div>
                      </Space>
                    </div>

                    {/* Driver Information */}
                    {booking.assignedDriver && (
                      <div
                        style={{
                          background: "rgba(108, 99, 255, 0.1)",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid rgba(108, 99, 255, 0.2)",
                        }}
                      >
                        <Space direction="vertical" size="small">
                          <Text style={{ color: colors.text, fontWeight: "bold" }}>Driver Details</Text>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <CarOutlined style={{ color: colors.primary }} />
                            <Text style={{ color: colors.text }}>{booking.assignedDriver.name}</Text>
                          </div>
                          <Text style={{ color: colors.text, fontSize: "12px" }}>📞 {booking.assignedDriver.phone}</Text>
                        </Space>
                      </div>
                    )}

                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text style={{ color: colors.text }}>
                          <ClockCircleOutlined /> {booking.date} at {booking.time}
                        </Text>
                        <Text style={{ color: colors.text }}>
                          <DollarOutlined /> LKR. {booking.price}.00
                        </Text>
                      </div>
                    </Space>

                    {booking.status !== "CANCELLED" && (
                      <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleOpenDialog(booking)} style={{ width: "100%" }}>
                        Cancel Booking
                      </Button>
                    )}
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </Space>

        <Modal
          title="Cancel Booking"
          open={openDialog}
          onOk={() => {
            if (selectedBooking) {
              handleCancelBooking(selectedBooking.bookingId);
              message.info(snackbarMessage);
            }
          }}
          onCancel={() => setOpenDialog(false)}
          okText="Yes, Cancel"
          cancelText="No"
        >
          <Text>Are you sure you want to cancel this booking?</Text>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Dashboard;
