import { useContext } from "react";
import { UserContext } from "./UserProvider";

export function useUsersContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUsersContext must be used within a UserProvider.");
  }

  return context;
}
