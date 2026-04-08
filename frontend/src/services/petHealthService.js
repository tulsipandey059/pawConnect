import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/pet-health",
});

export const checkPetHealth = async (formData) => {
  const response = await API.post("/check", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
