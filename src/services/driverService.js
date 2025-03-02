import api from "../api/axiosConfig";

const DRIVER_API_BASE_URL = "/api/v1/drivers";

const driverService = {
  getAllDrivers: () => {
    return api.get(DRIVER_API_BASE_URL);
  },

  getDriverById: (driverId) => {
    return api.get(`${DRIVER_API_BASE_URL}/${driverId}`);
  },

  createDriver: (driverData) => {
    return api.post(DRIVER_API_BASE_URL, driverData);
  },

  updateDriver: (driverId, driverData) => {
    return api.put(`${DRIVER_API_BASE_URL}/${driverId}`, driverData);
  },

  deleteDriver: (driverId) => {
    return api.delete(`${DRIVER_API_BASE_URL}/${driverId}`);
  },
};

export default driverService;
