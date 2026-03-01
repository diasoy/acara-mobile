export interface ApiMeta {
  status: number;
  message: string;
}

export interface ApiResponse<TData> {
  meta: ApiMeta;
  data: TData;
}

export interface LoginParams {
  identifier: string;
  password: string;
}

export interface RegisterParams {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  fullName: string;
  userName: string;
  email: string;
  role: "member" | "admin";
  profilePicture: string;
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type LoginData =
  | string
  | {
      accessToken?: string;
      token?: string;
    };

export type LoginResponse = ApiResponse<LoginData>;
export type RegisterResponse = ApiResponse<AuthUser>;
export type MeResponse = ApiResponse<AuthUser>;
