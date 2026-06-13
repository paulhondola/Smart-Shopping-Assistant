export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserModel {
  id: number;
  email: string;
  displayName: string;
  role: string;
  avatarUrl?: string;
}

export interface AuthResponseModel {
  token: string;
  expiresAt: string;
  user: UserModel;
}

export interface UpdateProfileInput {
  displayName: string;
}
