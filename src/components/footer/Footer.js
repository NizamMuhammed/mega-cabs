import React from "react";
import { Layout, Typography, Row, Col, Space } from "antd";
import { Link } from "react-router-dom";
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const colors = {
  primary: "#6C63FF",
  secondary: "#2A2A72",
  background: "#1A1A2E",
  text: "#FFFFFF",
};

const Footer = () => {
  return (
    <AntFooter style={{ background: colors.background, padding: "3rem 2rem" }}>
      <Row gutter={[32, 32]} justify="space-between">
        <Col xs={24} sm={8}>
          <Title level={4} style={{ color: colors.primary }}>
            MegaCabs
          </Title>
          <Text style={{ color: colors.text }}>Your trusted partner for safe and reliable transportation.</Text>
        </Col>

        <Col xs={24} sm={8}>
          <Title level={4} style={{ color: colors.primary }}>
            Quick Links
          </Title>
          <Space direction="vertical">
            {[
              { to: "/", text: "Home" },
              { to: "/about", text: "About" },
              { to: "/book-cab", text: "Book a Cab" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: colors.text,
                  textDecoration: "none",
                  "&:hover": { color: colors.primary },
                }}
              >
                {link.text}
              </Link>
            ))}
          </Space>
        </Col>

        <Col xs={24} sm={8}>
          <Title level={4} style={{ color: colors.primary }}>
            Contact Us
          </Title>
          <Space direction="vertical">
            <Text style={{ color: colors.text }}>
              <MailOutlined style={{ marginRight: 8 }} />
              info@megacabs.com
            </Text>
            <Text style={{ color: colors.text }}>
              <PhoneOutlined style={{ marginRight: 8 }} />
              +94 11 123 4567
            </Text>
          </Space>
        </Col>
      </Row>

      <Row justify="center" style={{ marginTop: "2rem" }}>
        <Text style={{ color: "rgba(255,255,255,0.6)" }}>© {new Date().getFullYear()} MegaCabs. All rights reserved.</Text>
      </Row>
    </AntFooter>
  );
};

export default Footer;
