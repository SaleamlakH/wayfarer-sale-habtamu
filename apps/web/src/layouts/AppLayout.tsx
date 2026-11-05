import { Link, Outlet } from "react-router";
import { UserSwitcher } from "../components/user-switcher/UserSwitcher";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-(--bg)">
      <header className="sticky top-0 z-10 border-b border-(--border) bg-(--surface-primary)">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link
            to="/"
            aria-label="Wayfarer home"
            className="text-lg font-bold tracking-[0.2em]"
          >
            <span className="text-(--accent)">WAY</span>
            <span className="text-(--stars)">FARER</span>
          </Link>
          <UserSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
