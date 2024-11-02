// useApi.js
import { useState, useEffect } from "react";

export const useApi = (endpoint, method = "GET", options = {}) => {
  const URL = process.env.NEXT_PUBLIC_BACK_END_URL || "http://localhost";
  const PORT = process.env.NEXT_PUBLIC_BACK_END_PORT || "4000";
  const baseUrl = process.env.NODE_ENV === "development" ? `${URL}:${PORT}` : URL; // Use port only in development
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);

  const fetchData = async (fetchOptions = {}) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }
  
      setLoading(true);
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...fetchOptions.headers, // Use headers from fetchOptions if provided
        },
        body: method !== "GET" ? JSON.stringify(fetchOptions.body) : null, // Use body from fetchOptions if provided
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

  useEffect(() => {
    if (method === "GET") {
      fetchData();
    }
  }, [endpoint, method]);

  return { data, loading, error, responseStatus, fetchData };
};
