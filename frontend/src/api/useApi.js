// src/api/useApi.js
import { useState, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, { method = "GET", body = null, headers = {} } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const config = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        };
        if (body !== null && body !== undefined) config.body = JSON.stringify(body);

        const res = await fetch(`${BASE_URL}${endpoint}`, config);
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;

        if (!res.ok) {
          const err = { status: res.status, data };
          setLoading(false);
          setError(err);
          throw err;
        }

        setLoading(false);
        return { data, status: res.status };
      } catch (err) {
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return { request, loading, error };
}
