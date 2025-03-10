import React, { useState, useEffect } from "react";
import { Form, Input, Select, Upload, Row, Col } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Dragger } = Upload;

const EditCarForm = ({ form, initialValues }) => {
  const [imageUrl, setImageUrl] = useState(initialValues?.carImage);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setImageUrl(initialValues.carImage);
    }
  }, [form, initialValues]);

  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="carBrand" label="Car Brand" rules={[{ required: true, message: "Please enter car brand" }]}>
            <Select placeholder="Select car Brand">
              <Option value="Mercedez Benz">Mercedez Benz</Option>
              <Option value="BMW">BMW</Option>
              <Option value="AUDI">AUDI</Option>
              <Option value="TOYOTA">TOYOTA</Option>
              <Option value="HONDA">HONDA</Option>
              <Option value="SUZUKI">SUZUKI</Option>
              <Option value="NISSAN">NISSAN</Option>
              <Option value="HYUNDAI">HYUNDAI</Option>
              <Option value="KIA">KIA</Option>
              <Option value="FORD">FORD</Option>
              <Option value="VOLKSWAGEN">VOLKSWAGEN</Option>
              <Option value="CHEVROLET">CHEVROLET</Option>
              <Option value="JAGUAR">JAGUAR</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="carName" label="Car Name" rules={[{ required: true, message: "Please enter car name" }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="carType" label="Car Type" rules={[{ required: true, message: "Please select car type" }]}>
            <Select placeholder="Select car type">
              <Option value="SEDAN">Sedan</Option>
              <Option value="SUV">SUV</Option>
              <Option value="LUXURY">Luxury</Option>
              <Option value="COMPACT">Compact</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="carNumber" label="Car Number" rules={[{ required: true, message: "Please enter car number" }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="carLocation" label="Location" rules={[{ required: true, message: "Please enter car location" }]}>
        <Input />
      </Form.Item>

      <Form.Item name="carImage" label="Car Image">
        <Dragger
          beforeUpload={(file) => {
            getBase64(file, (url) => {
              form.setFieldsValue({ carImage: url });
              setImageUrl(url);
            });
            return false;
          }}
          maxCount={1}
          showUploadList={false}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Car preview" style={{ maxWidth: "100%", maxHeight: "150px", padding: "20px" }} />
          ) : (
            <>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single image upload.</p>
            </>
          )}
        </Dragger>
      </Form.Item>

      <Form.Item name="carCapacity" label="Capacity" rules={[{ required: true, message: "Please enter car capacity" }]}>
        <Input />
      </Form.Item>

      <Form.Item name="carDescription" label="Description" rules={[{ required: true, message: "Please enter car description" }]}>
        <Input.TextArea rows={4} />
      </Form.Item>
    </Form>
  );
};

export default EditCarForm;
