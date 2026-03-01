import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

import { getAccessToken } from "@/lib/auth-token";

function setAuthorizationHeader(config: InternalAxiosRequestConfig, token: string): void {
  const headers = AxiosHeaders.from(config.headers);
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
}

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    setAuthorizationHeader(config, token);
  }

  return config;
});
