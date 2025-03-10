import React from "react";
import { Typography, Button, Layout, Row, Col, Card, Space } from "antd";
import { SafetyOutlined, ClockCircleOutlined, DollarOutlined, EnvironmentOutlined, CarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Custom color palette
const colors = {
  primary: "#6C63FF", // Modern purple
  secondary: "#2A2A72", // Deep blue
  accent: "#FF6B6B", // Coral
  background: "#1A1A2E", // Dark blue-black
  text: "#FFFFFF",
  cardBg: "rgba(255, 255, 255, 0.05)",
};

const Home = () => {
  return (
    <Layout style={{ background: colors.background }}>
      <Content>
        {/* Hero Section */}
        <div
          className="hero-section"
          style={{
            minHeight: "90vh",
            background: `linear-gradient(135deg, rgba(26, 26, 46, 0.5), rgba(42, 42, 114, 0.5)), 
                      url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            display: "flex",
            alignItems: "center",
            padding: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.1) 0%, rgba(26, 26, 46, 0) 70%)",
            }}
          />
          <Row justify="center" align="middle" style={{ width: "100%", position: "relative" }}>
            <Col xs={24} md={16} style={{ textAlign: "center" }}>
              <Title
                level={1}
                style={{
                  color: colors.text,
                  fontSize: "4.5rem",
                  marginBottom: "1rem",
                  textShadow: "0 0 20px rgba(108, 99, 255, 0.5)",
                  fontWeight: "800",
                }}
              >
                Mega Cabs
              </Title>
              <Paragraph
                style={{
                  color: colors.text,
                  fontSize: "1.5rem",
                  marginBottom: "2rem",
                  opacity: 0.9,
                }}
              >
                Experience the Future of Transportation
              </Paragraph>
              <Button
                type="primary"
                size="large"
                shape="round"
                style={{
                  background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                  height: "60px",
                  width: "220px",
                  fontSize: "1.2rem",
                  border: "none",
                  boxShadow: "0 10px 20px rgba(108, 99, 255, 0.2)",
                  transition: "all 0.3s ease",
                }}
                hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 30px rgba(108, 99, 255, 0.3)",
                }}
                component={Link}
                to="/book-cab"
              >
                Book Now
              </Button>
            </Col>
          </Row>
        </div>

        {/* Features Section */}
        <div style={{ background: colors.background, padding: "6rem 2rem" }}>
          <Title
            level={2}
            style={{
              color: colors.text,
              textAlign: "center",
              marginBottom: "4rem",
              fontSize: "2.5rem",
            }}
          >
            Why Choose Mega Cabs?
          </Title>
          <Row gutter={[32, 32]} justify="center">
            {[
              { icon: <SafetyOutlined />, title: "Safe & Secure", desc: "AI-powered safety features and real-time tracking" },
              { icon: <ClockCircleOutlined />, title: "24/7 Availability", desc: "Instant booking, anytime, anywhere" },
              { icon: <DollarOutlined />, title: "Smart Pricing", desc: "Dynamic rates with predictive pricing" },
            ].map((feature, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  style={{
                    background: `linear-gradient(135deg, ${colors.cardBg}, rgba(108, 99, 255, 0.05))`,
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    height: "100%",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                    backdropFilter: "blur(10px)",
                  }}
                  hoverable
                  className="feature-card"
                >
                  <Space direction="vertical" align="center" style={{ width: "100%", textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "3rem",
                        color: colors.primary,
                        background: "rgba(108, 99, 255, 0.1)",
                        padding: "1.5rem",
                        borderRadius: "50%",
                        marginBottom: "1rem",
                      }}
                    >
                      {feature.icon}
                    </div>
                    <Title level={4} style={{ color: colors.text, margin: "1rem 0" }}>
                      {feature.title}
                    </Title>
                    <Paragraph style={{ color: "rgba(255, 255, 255, 0.8)" }}>{feature.desc}</Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Process Section */}
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.background}, ${colors.secondary})`,
            padding: "4rem 2rem",
          }}
        >
          <Title level={2} style={{ color: "#fff", textAlign: "center", marginBottom: "3rem" }}>
            Book in Three Simple Steps
          </Title>
          <Row gutter={[32, 32]} justify="center">
            {[
              { icon: <EnvironmentOutlined />, title: "Set Location", desc: "Choose pickup & drop points" },
              { icon: <CarOutlined />, title: "Select Ride", desc: "Pick your perfect ride" },
              { icon: <CheckCircleOutlined />, title: "Confirm & Go", desc: "Instant confirmation" },
            ].map((step, index) => (
              <Col xs={24} sm={8} key={index}>
                <Space direction="vertical" align="center" style={{ width: "100%", textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      color: "#1890ff",
                      background: "rgba(24, 144, 255, 0.1)",
                      padding: "1.5rem",
                      borderRadius: "50%",
                    }}
                  >
                    {step.icon}
                  </div>
                  <Title level={4} style={{ color: "#fff", margin: "1rem 0" }}>
                    {step.title}
                  </Title>
                  <Paragraph style={{ color: "rgba(255, 255, 255, 0.8)" }}>{step.desc}</Paragraph>
                </Space>
              </Col>
            ))}
          </Row>
        </div>

        {/* CTA Section */}
        <div
          style={{
            background: colors.background,
            padding: "6rem 2rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              background: `radial-gradient(circle at center, ${colors.primary}15 0%, transparent 70%)`,
            }}
          />
          <Title level={2} style={{ color: "#fff", marginBottom: "2rem" }}>
            Ready for the Future of Transportation?
          </Title>
          <Link to="/help">
            <Button
              type="primary"
              size="large"
              shape="round"
              style={{
                background: "#1890ff",
                height: "50px",
                width: "200px",
                fontSize: "1.2rem",
              }}
            >
              Get Started
            </Button>
          </Link>
        </div>

        <Footer />
      </Content>
    </Layout>
  );
};

// Add this CSS in your stylesheet
const styles = `
  .feature-card:hover {
    transform: translateY(-10px) !important;
    box-shadow: 0 20px 40px rgba(108, 99, 255, 0.2) !important;
  }
`;

export default Home;
