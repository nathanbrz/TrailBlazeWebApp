// useApi.js
import { useState, useEffect } from "react";

export const useApi = (endpoint, method = "GET", options = {}) => {
  // Base URL setup
  const URL = process.env.NEXT_PUBLIC_BACK_END_URL || "http://localhost";
  const PORT = process.env.NEXT_PUBLIC_BACK_END_PORT || "4000";
  const baseUrl = process.env.NODE_ENV === "development" ? `${URL}:${PORT}` : URL; // Use port only in development

  const [data, setData] = useState(null); // State to store API response data
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to store any error messages
  const [responseStatus, setResponseStatus] = useState(null); // State to store the HTTP response status

  // Function to fetch data from the API
  const fetchData = async (fetchOptions = {}) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated"); // Throw error if token is missing
      }
  
      setLoading(true);
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method, // HTTP method (GET, POST, etc.)
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...fetchOptions.headers, // Use headers from fetchOptions if provided
        },
        body: method !== "GET" ? JSON.stringify(fetchOptions.body) : null, // Request body if method is not GET
      });
  
      setResponseStatus(response.status);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      const result = await response.json(); 
      setData(result); 
      setError(null); 
    } catch (err) {
      setError(err.message); 
      setData(null); 
    } finally {
      setLoading(false);
    }
  };

  // Effect to automatically fetch data for GET requests
  useEffect(() => {
    if (method === "GET") {
      fetchData();
    }
  }, [endpoint, method]);

  return { data, loading, error, responseStatus, fetchData };
};
