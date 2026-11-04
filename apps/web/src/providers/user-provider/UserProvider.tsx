import { createContext, type ReactNode } from "react";
import type { UserContextValue } from "./type";
import { useUsersService } from "./useUsersService";

export const UserContext = createContext<UserContextValue | undefined>(
  undefined,
);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const value = useUsersService();
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
