import React from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

const AddCarForm = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item name="carName" label="Car Name" rules={[{ required: true, message: "Please enter car name" }]}>
        <Input />
      </Form.Item>

      <Form.Item name="carType" label="Car Type" rules={[{ required: true, message: "Please select car type" }]}>
        <Select>
          <Option value="SEDAN">Sedan</Option>
          <Option value="SUV">SUV</Option>
          <Option value="LUXURY">Luxury</Option>
          <Option value="COMPACT">Compact</Option>
        </Select>
      </Form.Item>

      <Form.Item name="carNumber" label="Car Number" rules={[{ required: true, message: "Please enter car number" }]}>
        <Input />
      </Form.Item>

      <Form.Item name="carLocation" label="Location" rules={[{ required: true, message: "Please enter car location" }]}>
        <Input />
      </Form.Item>

      <Form.Item name="carStatus" label="Status" rules={[{ required: true, message: "Please select status" }]}>
        <Select>
          <Option value="ACTIVE">Active</Option>
          <Option value="MAINTENANCE">Maintenance</Option>
          <Option value="INACTIVE">Inactive</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default AddCarForm;
