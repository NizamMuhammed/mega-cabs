import "./App.css";
import api from "./api/axiosConfig";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Layout from "./components/Layout";
import Header from "./components/header/Header";

function App() {
  const [cabs, setCabs] = useState([]);

  // Fetch data from backend
  const getCabs = async () => {
    try {
      const response = await api.get("/api/v1/cabs");
      console.log(response.data);
      setCabs(response.data); // Set fetched data in state
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCabs(); // Fetch data when the component mounts
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home cabs={cabs} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
