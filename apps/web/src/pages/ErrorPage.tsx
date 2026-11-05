import { isRouteErrorResponse, useRouteError } from "react-router";
import { BackToPlacesLink } from "../components/places/BackToPlacesLink";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function ErrorPage() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="flex w-full max-w-md flex-col items-center gap-3 p-8 text-center">
        <p className="text-5xl font-bold tracking-tight text-(--accent)">
          {isRouteErrorResponse(error) ? error.status : 500}
        </p>
        <h1 className="text-xl font-semibold">
          {isNotFound ? "Page not found" : "Something went wrong"}
        </h1>
        <p className="text-sm text-(--ink-muted)">
          {isNotFound
            ? "The page you're looking for doesn't exist or may have moved."
            : "An unexpected error occurred. Try again or return to the places list."}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Button onClick={() => window.location.reload()}>Try again</Button>
          <BackToPlacesLink />
        </div>
      </Card>
    </div>
  );
}
