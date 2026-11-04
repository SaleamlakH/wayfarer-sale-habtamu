import type { Category } from "@weyfarer/types";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";

interface CategoryFilterProps {
  categories: Category[];
  selectedId: string;
  isLoading: boolean;
  error: string | null;
  onSelect: (categoryId: string) => void;
  onRetry: () => void;
}

export function CategoryFilter({
  categories,
  selectedId,
  isLoading,
  error,
  onSelect,
  onRetry,
}: CategoryFilterProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-(--ink-muted)">
        <Spinner />
        Loading categories
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-sm text-(--ink-muted)">
        <span>Could not load categories.</span>
        <Button
          variant="secondary"
          className="px-2 py-1 text-xs"
          onClick={onRetry}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedId === "" ? "primary" : "secondary"}
        className="rounded-full px-3 py-1.5"
        aria-pressed={selectedId === ""}
        onClick={() => onSelect("")}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedId === category.id ? "primary" : "secondary"}
          className="rounded-full px-3 py-1.5"
          aria-pressed={selectedId === category.id}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
