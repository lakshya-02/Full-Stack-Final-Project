const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin;

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const apiRequest = async (endpoint, options = {}, token) => {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  return parseResponse(response);
};

export const getAssetUrl = (path) => {
  if (!path) {
    return "";
  }

  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
};
