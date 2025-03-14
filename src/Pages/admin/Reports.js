import { useState } from "react";
import { Card, DatePicker, Button, Table, Typography, Space, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import api from "../../api/axiosConfig";

const { RangePicker } = DatePicker;
const { Title } = Typography;

/**
 * React component implementing Observer and Presenter patterns
 * - Observer: Uses React's useState hooks to observe and react to state changes
 * - Presenter: Separates the presentation logic from business logic
 * - Container/Component: Implements container pattern managing state and child components
 */
const Reports = () => {
  const [bookingData, setBookingData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const fetchReport = async (type) => {
    if (!dateRange) {
      message.error("Please select a date range");
      return;
    }

    setLoading(true);
    try {
      const startDate = dateRange[0].toISOString();
      const endDate = dateRange[1].toISOString();

      const response = await api.get(`/api/v1/reports/${type}`, {
        params: { startDate, endDate },
      });

      switch (type) {
        case "bookings":
          setBookingData(response.data);
          break;
        case "revenue":
          setRevenueData(response.data);
          break;
        case "drivers":
          setDriverData(response.data);
          break;
        default:
          break;
      }

      message.success(`${type} report generated successfully`);
    } catch (error) {
      message.error("Failed to generate report");
    }
    setLoading(false);
  };

  const downloadReport = (data, type) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_report_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Reports</Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="Generate Reports">
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <RangePicker showTime onChange={handleDateChange} style={{ width: "100%" }} />

            <Space>
              <Button type="primary" onClick={() => fetchReport("bookings")} loading={loading}>
                Generate Booking Report
              </Button>
              <Button type="primary" onClick={() => fetchReport("revenue")} loading={loading}>
                Generate Revenue Report
              </Button>
              <Button type="primary" onClick={() => fetchReport("drivers")} loading={loading}>
                Generate Driver Report
              </Button>
            </Space>
          </Space>
        </Card>

        {bookingData && (
          <Card
            title="Booking Report"
            extra={
              <Button icon={<DownloadOutlined />} onClick={() => downloadReport(bookingData, "booking")}>
                Download
              </Button>
            }
          >
            <Table
              dataSource={bookingData.data}
              columns={[
                { title: "Booking ID", dataIndex: "bookingId" },
                { title: "Status", dataIndex: "status" },
                { title: "Price", dataIndex: "price" },
              ]}
            />
          </Card>
        )}

        {revenueData && (
          <Card
            title="Revenue Report"
            extra={
              <Button icon={<DownloadOutlined />} onClick={() => downloadReport(revenueData, "revenue")}>
                Download
              </Button>
            }
          >
            <Typography.Text strong>Total Revenue: LKR {revenueData.data.totalRevenue}</Typography.Text>
          </Card>
        )}

        {driverData && (
          <Card
            title="Driver Report"
            extra={
              <Button icon={<DownloadOutlined />} onClick={() => downloadReport(driverData, "driver")}>
                Download
              </Button>
            }
          >
            <Table
              dataSource={driverData.data}
              columns={[
                { title: "Driver ID", dataIndex: "driverId" },
                { title: "Name", dataIndex: "driverName" },
                { title: "Status", dataIndex: "status" },
              ]}
            />
          </Card>
        )}
      </Space>
    </div>
  );
};

export default Reports;
