import React from "react";
import { Form, Input, Select } from "antd";
import { useState } from "react";

const { Option } = Select;

const AddDriverForm = ({ form }) => {
  const [formValues, setFormValues] = useState({});

  const handleFormChange = (changedValues) => {
    setFormValues((prevValues) => ({ ...prevValues, ...changedValues }));
  };

  return (
    <Form form={form} layout="vertical" onChange={handleFormChange} name="driverForm" initialValues={{ driverStatus: "AVAILABLE" }}>
      <Form.Item name="driverName" label="Driver Name" rules={[{ required: true, message: "Please enter driver name!" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="driverEmailId"
        label="Email"
        rules={[
          {
            type: "email",
            message: "Invalid email format!",
          },
          { required: true, message: "Please enter driver email!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="licenseNumber" label="License Number" rules={[{ required: true, message: "Please enter license number!" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="driverPhone"
        label="Phone"
        rules={[
          { required: true, message: "Please enter phone number!" },
          { pattern: /^\+?\d{10,12}$/, message: "Please enter a valid phone number!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="driverStatus" label="Status">
        <Select>
          <Option value="AVAILABLE">Available</Option>
          <Option value="UNAVAILABLE">Unavailable</Option>
          <Option value="ON_TRIP">On Trip</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default AddDriverForm;
