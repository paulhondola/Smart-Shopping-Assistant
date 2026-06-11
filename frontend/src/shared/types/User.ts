import type { UserModel } from "@/api/models/AuthModel";

export interface User {
  id: number;
  email: string;
  displayName: string;
  role: "User" | "Admin";
}

export const toUser = (dto: UserModel): User => ({
  id: dto.id,
  email: dto.email,
  displayName: dto.displayName,
  role: dto.role as User["role"],
});
