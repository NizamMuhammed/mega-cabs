import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Modal, Form } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import driverService from "../../services/driverService";
import AddDriverForm from "./AddDriverForm";
import api from "../../api/axiosConfig"; // Add this import

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAuthorized = userRoles.includes("ADMIN");
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await driverService.getAllDrivers();
      // Sort drivers by driverId in descending order to show newest first
      const sortedDrivers = response.data.sort((a, b) => b.driverId - a.driverId);
      setDrivers(sortedDrivers);
    } catch (error) {
      message.error("Failed to fetch drivers");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthorized) {
      message.error("You are not authorized to access this page");
      navigate("/");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      message.error("Please login to continue");
      navigate("/login");
      return;
    }

    fetchDrivers();
  }, [navigate, isAuthorized]);

  const handleDelete = async (driverId) => {
    try {
      await driverService.deleteDriver(driverId);
      message.success("Driver deleted successfully");
      fetchDrivers();
    } catch (error) {
      message.error("Failed to delete driver");
    }
  };

  const handleAddDriver = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const tempPassword = generateRandomPassword();
      console.log("Generated password for", values.driverName, ":", tempPassword);

      // First create user account
      const userResponse = await api.post("/api/v1/auth/register", {
        userName: values.driverName,
        userEmailId: values.driverEmailId,
        userPassword: tempPassword,
        roles: ["DRIVER"],
      });

      // Then create driver profile
      const driverData = {
        licenseNumber: values.licenseNumber,
        driverPhone: values.driverPhone,
        driverStatus: values.driverStatus || "AVAILABLE",
        user: {
          userId: userResponse.data.userId,
        },
      };

      await driverService.createDriver(driverData);

      message.success("Driver added successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchDrivers();
    } catch (error) {
      console.error("Error in handleModalOk:", error);
      message.error(`Failed to add driver: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: ["user", "userName"],
      key: "userName",
      render: (_, record) => record.user?.userName || "-",
    },
    {
      title: "Email",
      dataIndex: ["user", "userEmailId"],
      key: "userEmailId",
      render: (_, record) => record.user?.userEmailId || "-",
    },
    {
      title: "License Number",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
    },
    {
      title: "Phone",
      dataIndex: "driverPhone",
      key: "driverPhone",
    },
    {
      title: "Status",
      dataIndex: "driverStatus",
      key: "driverStatus",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/drivers/edit/${record.driverId}`)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.driverId)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {isAuthorized ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2>Drivers Management</h2>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchDrivers} loading={loading}>
                Refresh
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDriver}>
                Add New Driver
              </Button>
            </Space>
          </div>

          <Table columns={columns} dataSource={drivers} loading={loading} rowKey={(record) => record.driverId} pagination={{ pageSize: 10 }} />

          <Modal title="Add New Driver" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading} width={600}>
            <AddDriverForm form={form} />
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default DriverList;
