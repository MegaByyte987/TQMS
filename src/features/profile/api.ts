import { api } from "@/lib/fetcher";
import type { AuthUser } from "@/lib/auth";

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const profileApi = {
  me: () => api.get<AuthUser>("/profile"),
  changePassword: (body: ChangePasswordRequest) =>
    api.post<null>("/profile/change-password", body),
};