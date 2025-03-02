import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Modal, Form } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import carService from "../../services/carService";
import AddCarForm from "./AddCarForm";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAuthorized = userRoles.includes("ADMIN"); // Changed this line
  const navigate = useNavigate();

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await carService.getAllCars();
      setCars(response.data);
    } catch (error) {
      message.error("Failed to fetch cars");
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

    fetchCars();
  }, [navigate, isAuthorized]);

  const handleDelete = async (carId) => {
    try {
      await carService.deleteCar(carId);
      message.success("Car deleted successfully");
      fetchCars();
    } catch (error) {
      message.error("Failed to delete car");
    }
  };

  const handleAddCar = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const carData = {
        ...values,
        isAvailable: true,
      };

      console.log("Sending car data:", carData); // Debug log

      const response = await carService.createCar(carData);
      console.log("Response:", response); // Debug log

      message.success("Car added successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchCars();
    } catch (error) {
      console.error("Error in handleModalOk:", error);
      message.error(`Failed to add car: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "carName", key: "carName" },
    { title: "Type", dataIndex: "carType", key: "carType" },
    { title: "Number", dataIndex: "carNumber", key: "carNumber" },
    { title: "Status", dataIndex: "carStatus", key: "carStatus" },
    { title: "Location", dataIndex: "carLocation", key: "carLocation" },
    { title: "Available", dataIndex: "isAvailable", key: "isAvailable", render: (isAvailable) => (isAvailable ? "Yes" : "No") },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/cars/edit/${record.carId}`)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.carId)}>
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
            <h2>Cars Management</h2>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchCars} loading={loading}>
                Refresh
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCar}>
                Add New Car
              </Button>
            </Space>
          </div>

          <Table columns={columns} dataSource={cars} loading={loading} rowKey={(record) => record.carId} pagination={{ pageSize: 10 }} />

          <Modal title="Add New Car" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading} width={600}>
            <AddCarForm form={form} />
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default CarList;
