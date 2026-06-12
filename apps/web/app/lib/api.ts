const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers: any = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("zenith_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Sends HttpOnly cookies (refreshToken) automatically
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "An error occurred");
  }

  return data;
};
