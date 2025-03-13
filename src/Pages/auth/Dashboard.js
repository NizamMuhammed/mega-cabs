// d:\SE\mega-cabs\frontend\src\Pages\auth\Dashboard.js
import React, { useState, useEffect } from "react";
import { Layout, Typography, Card, List, Button, Tag, Space, Modal, message, Descriptions } from "antd";
import { CarOutlined, ClockCircleOutlined, CheckCircleOutlined, EnvironmentOutlined, DollarOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
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
  const [isBillModalVisible, setIsBillModalVisible] = useState(false);
  const [currentBillBooking, setCurrentBillBooking] = useState(null);

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

  const showBillModal = (booking) => {
    setCurrentBillBooking(booking);
    setIsBillModalVisible(true);
  };

  const handleBillModalCancel = () => {
    setIsBillModalVisible(false);
  };

  return (
    <Layout style={{ background: colors.background }}>
      <Content style={{ padding: "2rem" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <EnvironmentOutlined style={{ color: "#52c41a" }} />
                          <Text style={{ color: colors.text }}>From: {booking.pickupLocation}</Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
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
                          <Text
                            style={{
                              color: colors.text,
                              fontWeight: "bold",
                            }}
                          >
                            Driver Details
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <CarOutlined style={{ color: colors.primary }} />
                            <Text style={{ color: colors.text }}>{booking.assignedDriver.name}</Text>
                          </div>
                          <Text style={{ color: colors.text, fontSize: "12px" }}>📞 {booking.assignedDriver.phone}</Text>
                        </Space>
                      </div>
                    )}

                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: colors.text }}>
                          <ClockCircleOutlined /> {booking.date} at {booking.time}
                        </Text>
                        <Text style={{ color: colors.text }}>
                          <DollarOutlined /> LKR. {booking.price}.00
                        </Text>
                      </div>
                    </Space>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {booking.status !== "CANCELLED" && (
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleOpenDialog(booking)} style={{ width: "48%" }}>
                          Cancel Booking
                        </Button>
                      )}

                      {booking.status === "COMPLETED" && (
                        <Button type="primary" icon={<FileTextOutlined />} onClick={() => showBillModal(booking)} style={{ width: "48%" }}>
                          View Bill
                        </Button>
                      )}
                    </div>
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
        {/* Bill Modal */}
        <Modal
          title="Bill Details"
          open={isBillModalVisible}
          onCancel={handleBillModalCancel}
          footer={[
            <Button key="back" onClick={handleBillModalCancel}>
              Close
            </Button>,
          ]}
        >
          {currentBillBooking && (
            <Descriptions bordered>
              <Descriptions.Item label="Booking ID" span={3}>
                {currentBillBooking.bookingId}
              </Descriptions.Item>
              <Descriptions.Item label="Cab Type" span={3}>
                {currentBillBooking.cabBrand} {currentBillBooking.cabType} {currentBillBooking.cabName}
              </Descriptions.Item>
              <Descriptions.Item label="Pickup Location" span={3}>
                {currentBillBooking.pickupLocation}
              </Descriptions.Item>
              <Descriptions.Item label="Drop Location" span={3}>
                {currentBillBooking.dropLocation}
              </Descriptions.Item>
              <Descriptions.Item label="Date" span={3}>
                {currentBillBooking.date}
              </Descriptions.Item>
              <Descriptions.Item label="Time" span={3}>
                {currentBillBooking.time}
              </Descriptions.Item>
              {currentBillBooking.assignedDriver && (
                <Descriptions.Item label="Driver Details" span={3}>
                  {currentBillBooking.assignedDriver.name} - 📞 {currentBillBooking.assignedDriver.phone}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Total Price" span={3}>
                LKR. {currentBillBooking.price}.00
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default Dashboard;
