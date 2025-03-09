import React from "react";
import { Layout, Typography, Row, Col, Card, Space } from "antd";
import { SafetyCertificateOutlined, FieldTimeOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import Footer from "../components/footer/Footer";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const colors = {
  primary: "#6C63FF",
  secondary: "#2A2A72",
  accent: "#FF6B6B",
  background: "#1A1A2E",
  text: "#FFFFFF",
  cardBg: "rgba(255, 255, 255, 0.05)",
};

const About = () => {
  return (
    <Layout style={{ background: colors.background }}>
      <Content>
        {/* Hero Section */}
        <div style={{ padding: "6rem 2rem 4rem", textAlign: "center" }}>
          <Title level={1} style={{ color: colors.text, fontSize: "3.5rem", marginBottom: "1.5rem" }}>
            About MegaCabs
          </Title>
          <Paragraph style={{ color: colors.text, fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto" }}>
            MegaCabs is a leading transportation service committed to providing safe, reliable, and convenient rides for everyone.
          </Paragraph>
        </div>

        {/* Values Section */}
        <div style={{ background: colors.background, padding: "4rem 2rem" }}>
          <Row gutter={[32, 32]} justify="center">
            {[
              { icon: <SafetyCertificateOutlined />, title: "Safety First", desc: "Your security is our top priority" },
              { icon: <FieldTimeOutlined />, title: "Reliability", desc: "Punctual and dependable service" },
              { icon: <CustomerServiceOutlined />, title: "24/7 Support", desc: "Always here when you need us" },
            ].map((value, index) => (
              <Col xs={24} sm={8} key={index}>
                <Card
                  style={{
                    background: `linear-gradient(135deg, ${colors.cardBg}, rgba(108, 99, 255, 0.05))`,
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    height: "100%",
                    transition: "all 0.3s ease",
                  }}
                  hoverable
                >
                  <Space direction="vertical" align="center" style={{ width: "100%", textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "2.5rem",
                        color: colors.primary,
                        background: "rgba(108, 99, 255, 0.1)",
                        padding: "1.5rem",
                        borderRadius: "50%",
                        marginBottom: "1rem",
                      }}
                    >
                      {value.icon}
                    </div>
                    <Title level={4} style={{ color: colors.text, margin: "1rem 0" }}>
                      {value.title}
                    </Title>
                    <Paragraph style={{ color: "rgba(255, 255, 255, 0.8)" }}>{value.desc}</Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Story Section */}
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.background}, ${colors.secondary})`,
            padding: "4rem 2rem",
          }}
        >
          <Title level={2} style={{ color: colors.text, textAlign: "center", marginBottom: "3rem" }}>
            Our Story
          </Title>
          <Row justify="center">
            <Col xs={24} md={16}>
              <Card
                style={{
                  background: colors.cardBg,
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Paragraph style={{ color: colors.text, fontSize: "1.1rem", lineHeight: "1.8" }}>
                  MegaCabs was founded in 2024 with a vision to transform urban transportation. We started with a small fleet and a big dream, and we have grown into a trusted provider by focusing on
                  our core values.
                </Paragraph>
                <Paragraph style={{ color: colors.text, fontSize: "1.1rem", lineHeight: "1.8" }}>
                  Today, we serve thousands of passengers daily, continuously innovating to make your rides even better. We are proud of our journey and grateful for the trust our customers place in
                  us.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        <Footer />
      </Content>
    </Layout>
  );
};

export default About;
