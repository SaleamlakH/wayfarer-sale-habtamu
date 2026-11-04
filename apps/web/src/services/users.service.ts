import type { User } from "@weyfarer/types";
import { request } from "../api/client";

export function getUsers(signal?: AbortSignal): Promise<User[]> {
  return request<User[]>("/api/users", { signal });
}
