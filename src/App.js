import "./App.css";
import api from "./api/axiosConfig";
import { useEffect, useState } from "react";

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
      <h1>Cabs Data</h1>
      <pre>{JSON.stringify(cabs, null, 2)}</pre> {/* Display cabs data */}
    </div>
  );
}

export default App;
