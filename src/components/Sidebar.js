import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { CarOutlined, UserOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: <Link to="/">Home</Link>,
  },
  {
    key: "about",
    icon: <InfoCircleOutlined />,
    label: <Link to="/about">About</Link>,
  },
  {
    key: "cars",
    icon: <CarOutlined />,
    label: <Link to="/cars">Cars</Link>,
  },
  {
    key: "drivers",
    icon: <UserOutlined />,
    label: <Link to="/drivers">Drivers</Link>,
  },
];

const App = () => (
  <Layout>
    <Sider>
      <Menu items={items} />
    </Sider>
    <Layout>
      <Header>Header</Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
  </Layout>
);

export default App;
