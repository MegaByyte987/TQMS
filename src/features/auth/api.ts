import { api } from "@/lib/fetcher";
import type { AuthUser, LoginRequest } from "./types";

export const authApi = {
  login: (body: LoginRequest) => api.post<AuthUser>("/auth/login", body),
  logout: () => api.post<null>("/auth/logout"),
  me: () => api.get<AuthUser>("/auth/me"),
};