// tanstack query for api call

// src/api/useRegister.js
import { useMutation } from "@tanstack/react-query";

const API_URL = "http://localhost:8080/register"; 

export const useRegister = () => {    //useregister is a custome hook
  return useMutation({
    mutationFn: async (userData) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      return res.json(); // returns user data
    },
  });
};
