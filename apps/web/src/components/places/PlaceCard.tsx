import type { Place } from "@weyfarer/types";
import { Link } from "react-router";
import { Card } from "../ui/Card";
import { Star } from "../ui/Star";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { average, reviewCount } = place.rating;

  return (
    <Link
      to={`/places/${place.id}`}
      className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
    >
      <Card className="flex h-full flex-col gap-1.5 transition-colors group-hover:border-(--accent) group-hover:bg-(--accent)/5">
        <span className="font-semibold text-(--ink)">{place.name}</span>
        <span
          className="flex flex-wrap items-center gap-1 text-sm"
          aria-label={`Rated ${average} out of 5 from ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`}
        >
          <Star />
          <span className="font-medium text-(--ink)">{average}</span>
          <span className="text-xs text-(--ink-muted)">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
          <span aria-hidden="true" className="text-xs text-(--ink-muted)">
            ·
          </span>
          <span className="text-xs text-(--ink-muted)">
            {place.category.name}
          </span>
        </span>
        <p className="line-clamp-2 text-sm text-(--ink-muted)">
          {place.description}
        </p>
      </Card>
    </Link>
  );
}
