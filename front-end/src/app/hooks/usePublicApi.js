// usePublicApi.js
import { useState, useEffect } from "react";

export const usePublicApi = (endpoint, method = "GET", options = {}) => {
  const URL = process.env.NEXT_PUBLIC_BACK_END_URL || "http://localhost";
  const PORT = process.env.NEXT_PUBLIC_BACK_END_PORT || "4000";
  const baseUrl = process.env.NODE_ENV === "development" ? `${URL}:${PORT}` : URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (fetchOptions = {}) => {
    try {
      setLoading(true);

      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
        body: method !== "GET" ? JSON.stringify(fetchOptions.body) : null,
      });

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

  return { data, loading, error };
};