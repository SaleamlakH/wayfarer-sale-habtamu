import { useCallback } from "react";
import { useSearchParams } from "react-router";
import type { Category, Place } from "@weyfarer/types";
import { getCategories, getPlaces } from "../services/places.service";
import { useAsyncData, type AsyncData } from "./useAsyncData";

export interface PlaceDiscovery {
  currentCategoryId: string;
  sort: string;
  selectCategory: (categoryId: string) => void;
  selectSort: (sort: string) => void;
  categories: AsyncData<Category[]>;
  places: AsyncData<Place[]>;
}

export function usePlaceDiscovery(): PlaceDiscovery {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId") ?? "";
  const sort = searchParams.get("sort") ?? "rate";

  const categories = useAsyncData(getCategories);

  const loadPlaces = useCallback(
    (signal: AbortSignal) =>
      getPlaces(
        {
          categoryId: currentCategoryId || undefined,
          sort: sort === "default" ? undefined : sort,
        },
        signal,
      ),
    [currentCategoryId, sort],
  );

  const places = useAsyncData(loadPlaces);

  const updateParam = useCallback(
    (name: string, value: string) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          if (value) {
            next.set(name, value);
          } else {
            next.delete(name);
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const selectCategory = useCallback(
    (value: string) => updateParam("categoryId", value),
    [updateParam],
  );

  const selectSort = useCallback(
    (value: string) => updateParam("sort", value),
    [updateParam],
  );

  return {
    currentCategoryId,
    sort,
    selectCategory,
    selectSort,
    categories,
    places,
  };
}
