import { BackToPlacesLink } from "../components/places/BackToPlacesLink";
import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="flex w-full max-w-md flex-col items-center gap-3 p-8 text-center">
        <p className="text-5xl font-bold tracking-tight text-(--accent)">
          404
        </p>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-(--ink-muted)">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <BackToPlacesLink />
        </div>
      </Card>
    </div>
  );
}
