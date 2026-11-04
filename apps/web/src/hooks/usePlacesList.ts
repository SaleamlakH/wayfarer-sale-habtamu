import { useCallback } from "react";
import { useSearchParams } from "react-router";
import type { Place } from "@weyfarer/types";
import { getPlaces } from "../services/places.service";
import { useAsyncData, type AsyncData } from "./useAsyncData";

export interface PlacesList {
  places: AsyncData<Place[]>;
  sort: string;
  selectSort: (sort: string) => void;
}

export function usePlacesList(categoryId?: string): PlacesList {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? "rate";

  const load = useCallback(
    (signal: AbortSignal) =>
      getPlaces(
        {
          categoryId,
          sort: sort === "default" ? undefined : sort,
        },
        signal,
      ),
    [categoryId, sort],
  );

  const places = useAsyncData(load);

  const selectSort = useCallback(
    (value: string) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          if (value) {
            next.set("sort", value);
          } else {
            next.delete("sort");
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { places, sort, selectSort };
}
