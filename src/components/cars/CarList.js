import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Modal, Form } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import carService from "../../services/carService";
import AddCarForm from "./AddCarForm";
import EditCarForm from "./EditCarForm";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAuthorized = userRoles.includes("ADMIN"); // Changed this line
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCars = async (page = 0, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await carService.getAllCars(page, pageSize);
      setCars(response.data.content);
      setPagination({
        current: page + 1,
        pageSize: pageSize,
        total: response.data.totalElements,
      });
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
    Modal.confirm({
      title: "Are you sure you want to delete this car?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          await carService.deleteCar(carId);
          message.success("Car deleted successfully");
          fetchCars();
        } catch (error) {
          message.error("Failed to delete car");
        }
      },
    });
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

  const handleEdit = (car) => {
    setEditingCar(car);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    editForm.resetFields();
    setIsEditModalVisible(false);
    setEditingCar(null);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      setLoading(true);

      const updatedCar = {
        ...editingCar,
        ...values,
      };

      await carService.updateCar(updatedCar);
      await fetchCars(); // First fetch the updated list
      message.success("Car updated successfully");
      setIsEditModalVisible(false);
      editForm.resetFields();
      setEditingCar(null);
    } catch (error) {
      console.error("Error updating car:", error);
      message.error("Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Brand", dataIndex: "carBrand", key: "carBrand" },
    { title: "Name", dataIndex: "carName", key: "carName" },
    { title: "Type", dataIndex: "carType", key: "carType" },
    { title: "Number", dataIndex: "carNumber", key: "carNumber" },
    { title: "Location", dataIndex: "carLocation", key: "carLocation" },
    {
      title: "Image",
      dataIndex: "carImage",
      key: "carImage",
      render: (carImage) => (carImage ? <img src={carImage} alt="Car" style={{ width: "100px" }} /> : "No Image"),
    },
    { title: "Available", dataIndex: "isAvailable", key: "isAvailable", render: (isAvailable) => (isAvailable ? "Yes" : "No") },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
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
            <h2>Car Management</h2>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchCars} loading={loading}>
                Refresh
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCar}>
                Add New Car
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={cars}
            loading={loading}
            rowKey={(record) => record.carId}
            pagination={{
              ...pagination,
              onChange: (page, pageSize) => {
                fetchCars(page - 1, pageSize);
              },
            }}
          />

          <Modal title="Add New Car" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading} width={600}>
            <AddCarForm form={form} />
          </Modal>

          <Modal title="Edit Car" open={isEditModalVisible} onOk={handleEditModalOk} onCancel={handleEditModalCancel} confirmLoading={loading} width={600}>
            <EditCarForm form={editForm} initialValues={editingCar} />
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default CarList;
