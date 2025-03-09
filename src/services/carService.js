import api from "../api/axiosConfig";

const CAR_API_BASE_URL = "/api/v1/cars";

const carService = {
  getAllCars: () => {
    return api.get(CAR_API_BASE_URL);
  },

  getCarById: (carId) => {
    return api.get(`${CAR_API_BASE_URL}/${carId}`);
  },

  createCar: async (car) => {
    try {
      const response = await api.post(CAR_API_BASE_URL, {
        carName: car.carName,
        carType: car.carType,
        carNumber: car.carNumber,
        carLocation: car.carLocation,
        carStatus: car.carStatus,
        carImage: car.carImage, // Added image field from AddCarForm
        isAvailable: car.isAvailable !== undefined ? car.isAvailable : true,
        // Added missing fields to match backend Car model
        carCapacity: car.carCapacity || "",
        carDescription: car.carDescription || "",
        carBrand: car.carBrand || "",
      });
      return response;
    } catch (error) {
      console.error("Error creating car:", error.response?.data || error.message);
      throw error;
    }
  },

  updateCar: (car) => {
    return api.put(CAR_API_BASE_URL, car);
  },

  deleteCar: (carId) => {
    return api.delete(`${CAR_API_BASE_URL}/${carId}`);
  },
};

export default carService;
