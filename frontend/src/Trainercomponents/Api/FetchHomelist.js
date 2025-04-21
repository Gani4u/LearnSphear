import api from "../../Api/globalapi";

// Utility to fetch image and return blob URL
export const fetchImageBlob = async (filename) => {
    const response = await api.get(`/images/${filename}`, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  };
  