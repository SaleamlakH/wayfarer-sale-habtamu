import { useEffect, useState } from "react";
import type { User } from "@weyfarer/types";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getUsers } from "../../services/users.service";
import type { UserContextValue } from "./type";

export function useUsersService(): UserContextValue {
  const { data, loading, error, refetch } = useAsyncData(getUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const users = data ?? [];

  useEffect(() => {
    if (users.length === 0) return;

    const currentUserIsValid =
      currentUser !== null && users.some((user) => user.id === currentUser.id);

    if (!currentUserIsValid) {
      setCurrentUser(users[0]);
    }
  }, [currentUser, users]);

  return {
    users,
    currentUser,
    setCurrentUser,
    isLoading: loading,
    error: error?.message ?? null,
    refetch,
  };
}
