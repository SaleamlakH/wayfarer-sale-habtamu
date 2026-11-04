import { usePlacesList } from "../../hooks/usePlacesList";
import { BackToPlacesLink } from "./BackToPlacesLink";
import { PlaceCard } from "./PlaceCard";
import { SortSelect } from "./SortSelect";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";

interface PlaceSidebarProps {
  categoryId?: string;
  categoryName?: string;
  selectedPlaceId: string;
}

export function PlaceSidebar({
  categoryId,
  categoryName,
  selectedPlaceId,
}: PlaceSidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-col md:gap-6">
      <BackToPlacesLink />

      {categoryId && categoryName ? (
        <CategoryPlacesList
          categoryId={categoryId}
          categoryName={categoryName}
          selectedPlaceId={selectedPlaceId}
        />
      ) : (
        <Card
          nested
          className="flex items-center justify-center gap-3 p-6 text-sm text-(--ink-muted)"
        >
          <Spinner />
          Loading places
        </Card>
      )}
    </aside>
  );
}

interface CategoryPlacesListProps {
  categoryId: string;
  categoryName: string;
  selectedPlaceId: string;
}

function CategoryPlacesList({
  categoryId,
  categoryName,
  selectedPlaceId,
}: CategoryPlacesListProps) {
  const { places, sort, selectSort } = usePlacesList(categoryId);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-(--ink-muted)">
          More in {categoryName}
        </h2>
        <SortSelect value={sort} onChange={selectSort} />
      </div>

      {places.loading ? (
        <Card
          nested
          className="flex items-center justify-center gap-3 p-6 text-sm text-(--ink-muted)"
        >
          <Spinner />
          Loading places
        </Card>
      ) : places.error ? (
        <Card
          nested
          className="flex flex-col items-center gap-3 p-4 text-center"
        >
          <p role="alert" className="text-sm text-(--danger)">
            {places.error.message}
          </p>
          <Button variant="secondary" onClick={places.refetch}>
            Try again
          </Button>
        </Card>
      ) : (places.data ?? []).length === 0 ? (
        <Card nested className="p-6 text-center text-sm text-(--ink-muted)">
          No More places in this category.
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {(places.data ?? []).map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              selected={place.id === selectedPlaceId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
