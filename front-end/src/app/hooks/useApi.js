// useApi.js
import { useState, useEffect } from "react";
export const useApi = (endpoint, method = "GET", options = {}) => {
  const URL = process.env.NEXT_PUBLIC_BACK_END_URL || "http://localhost";
  const PORT = process.env.NEXT_PUBLIC_BACK_END_PORT || "4000";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      const response = await fetch(`${URL}:${PORT}/${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...options.headers, // Additional headers if needed
        },
        body: method !== "GET" ? JSON.stringify(options.body) : null,
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
  }, [endpoint, method, options]);

  return { data, loading, error, responseStatus, fetchData };
};
