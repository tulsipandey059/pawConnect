import axios from "axios";
import { API_BASE } from "./api";

const API = axios.create({
  baseURL: `${API_BASE}/pet-health`,
});

export const checkPetHealth = async (formData) => {
  const response = await API.post("/check", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
