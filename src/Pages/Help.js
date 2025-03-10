import React from "react";
import { Layout, Typography, Collapse, Space, Divider, Card } from "antd";
import { QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Footer from "../components/footer/Footer";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const colors = {
  primary: "#6C63FF",
  secondary: "#2A2A72",
  background: "#1A1A2E",
  text: "#FFFFFF",
  cardBg: "rgba(255, 255, 255, 0.05)",
};

const Help = () => {
  const faqs = [
    {
      question: "How do I book a cab?",
      answer: "To book a cab, log in to your account, click on 'Book a Cab', select your pickup and drop locations, choose your preferred car type, and confirm your booking.",
    },
    {
      question: "How do I cancel my booking?",
      answer: "You can cancel your booking through your dashboard. Navigate to your bookings list and click the 'Cancel' button next to the relevant booking.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit/debit cards, digital wallets, and cash payments.",
    },
    {
      question: "Is there a cancellation fee?",
      answer: "Cancellation fees may apply depending on how close to the pickup time you cancel. Please check our terms and conditions for details.",
    },
  ];

  const gettingStartedSteps = [
    {
      title: "Create an Account",
      content: "Sign up using your email address and create a secure password.",
    },
    {
      title: "Complete Your Profile",
      content: "Add your personal details and verify your email address.",
    },
    {
      title: "Book Your First Ride",
      content: "Use our simple booking system to schedule your first journey.",
    },
    {
      title: "Track Your Ride",
      content: "Monitor your ride status and driver details through the dashboard.",
    },
  ];

  return (
    <Layout style={{ background: colors.background, minHeight: "100vh" }}>
      <Content style={{ padding: "2rem" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Help Center Header */}
          <Title level={1} style={{ color: colors.text, textAlign: "center" }}>
            Help Center
          </Title>

          {/* Getting Started Section */}
          <Card
            style={{
              background: `linear-gradient(135deg, ${colors.cardBg}, rgba(108, 99, 255, 0.05))`,
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Title level={2} style={{ color: colors.text }}>
              <InfoCircleOutlined /> Getting Started
            </Title>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {gettingStartedSteps.map((step, index) => (
                <Card
                  key={index}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "10px",
                  }}
                >
                  <Title level={4} style={{ color: colors.primary, marginBottom: "0.5rem" }}>
                    {index + 1}. {step.title}
                  </Title>
                  <Text style={{ color: colors.text }}>{step.content}</Text>
                </Card>
              ))}
            </Space>
          </Card>

          <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

          {/* FAQ Section */}
          <Card
            style={{
              background: `linear-gradient(135deg, ${colors.cardBg}, rgba(108, 99, 255, 0.05))`,
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Title level={2} style={{ color: colors.text }}>
              <QuestionCircleOutlined /> Frequently Asked Questions
            </Title>
            <Collapse
              ghost
              style={{
                background: "transparent",
                color: colors.text,
              }}
            >
              {faqs.map((faq, index) => (
                <Panel
                  header={<Text style={{ color: colors.text }}>{faq.question}</Text>}
                  key={index}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  }}
                >
                  <Paragraph style={{ color: colors.text }}>{faq.answer}</Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Space>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Help;
