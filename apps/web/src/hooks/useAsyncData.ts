import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../api/client";

export interface AsyncData<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useAsyncData<T>(
  load: (signal: AbortSignal) => Promise<T>,
): AsyncData<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => {
    setVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    load(controller.signal)
      .then((value) => {
        if (controller.signal.aborted) return;

        setData(value);
        setLoading(false);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;

        setData(null);
        setError(cause as ApiError);
        setLoading(false);
      });

    return () => controller.abort();
  }, [load, version]);

  return { data, loading, error, refetch };
}
