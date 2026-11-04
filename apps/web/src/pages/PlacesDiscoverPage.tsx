import { CategoryFilter } from "../components/places/CategoryFilter";
import { PlaceCard } from "../components/places/PlaceCard";
import { SortSelect } from "../components/places/SortSelect";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { usePlaceDiscovery } from "../hooks/usePlaceDiscovery";

export function PlacesDiscoverPage() {
  const {
    currentCategoryId,
    sort,
    selectCategory,
    selectSort,
    categories,
    places,
  } = usePlaceDiscovery();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-(--ink-muted)">
          Categories
        </h2>
        <CategoryFilter
          categories={categories.data ?? []}
          selectedId={currentCategoryId}
          isLoading={categories.loading}
          error={categories.error?.message ?? null}
          onSelect={selectCategory}
          onRetry={categories.refetch}
        />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Discover places</h1>
          <SortSelect value={sort} onChange={selectSort} />
        </div>

        {places.loading ? (
          <Card
            nested
            className="flex items-center justify-center gap-3 p-10 text-sm text-(--ink-muted)"
          >
            <Spinner />
            Loading places
          </Card>
        ) : places.error ? (
          <Card nested className="flex flex-col items-center gap-3 p-8 text-center">
            <p role="alert" className="text-sm text-(--danger)">
              {places.error.message}
            </p>
            <Button variant="secondary" onClick={places.refetch}>
              Try again
            </Button>
          </Card>
        ) : (places.data ?? []).length === 0 ? (
          <Card nested className="p-10 text-center text-sm text-(--ink-muted)">
            No places found{currentCategoryId ? " for this category" : ""}.
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(places.data ?? []).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
