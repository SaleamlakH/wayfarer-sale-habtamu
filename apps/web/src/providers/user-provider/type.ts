import type { User } from "@weyfarer/types";

export interface UserContextValue {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
