import { useUsersContext } from "../../providers/user-provider/useUsersContext";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Spinner } from "../ui/Spinner";

export function UserSwitcher() {
  const { users, currentUser, setCurrentUser, isLoading, error, refetch } =
    useUsersContext();

  if (isLoading) {
    return (
      <span className="flex items-center gap-2 text-sm text-(--ink-muted)">
        <Spinner />
        Loading users
      </span>
    );
  }

  if (error) {
    return (
      <Button variant="secondary" className="px-2 py-1 text-sm" onClick={refetch}>
        Retry users
      </Button>
    );
  }

  return (
    <Select
      aria-label="Acting as"
      value={currentUser?.id ?? ""}
      onChange={(event) => {
        const user = users.find((item) => item.id === event.target.value);
        if (user) setCurrentUser(user);
      }}
    >
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </Select>
  );
}
