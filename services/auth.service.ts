import { api } from "@/lib/axios";
import {
    LoginParams,
    LoginResponse,
    MeResponse,
    RegisterParams,
    RegisterResponse,
} from "@/types/auth";

export async function login(params: LoginParams): Promise<LoginResponse> {
  const response = await api.post("/auth/login", params);
  return response.data;
}

export async function register(
  params: RegisterParams,
): Promise<RegisterResponse> {
  const response = await api.post("/auth/register", params);
  return response.data;
}

export async function me(): Promise<MeResponse> {
  const response = await api.get("/auth/me");
  return response.data;
}
