import { useCallback } from "react";
import { useSearchParams } from "react-router";
import type { Category, Place } from "@weyfarer/types";
import { getCategories } from "../services/places.service";
import { useAsyncData, type AsyncData } from "./useAsyncData";
import { usePlacesList } from "./usePlacesList";

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

  const categories = useAsyncData(getCategories);
  const { places, sort, selectSort } = usePlacesList(
    currentCategoryId || undefined,
  );

  const selectCategory = useCallback(
    (value: string) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          if (value) {
            next.set("categoryId", value);
          } else {
            next.delete("categoryId");
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
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
