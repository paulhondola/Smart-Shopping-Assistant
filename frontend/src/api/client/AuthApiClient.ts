import { http } from "@/api/base/http";
import type {
  AuthResponseModel,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  UserModel,
} from "@/api/models/AuthModel";

export const authApi = {
  register: (data: RegisterInput) =>
    http.post<AuthResponseModel, RegisterInput>("/auth/register", data),

  login: (data: LoginInput) =>
    http.post<AuthResponseModel, LoginInput>("/auth/login", data),

  me: () => http.get<UserModel>("/auth/me"),

  updateProfile: (data: UpdateProfileInput) =>
    http.put<UserModel, UpdateProfileInput>("/auth/me", data),
};
