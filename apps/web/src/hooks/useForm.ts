import {
  useCallback,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";

export type FormErrors<TValues extends object> = Partial<
  Record<keyof TValues | "submit", string>
>;

interface UseFormOptions<TValues extends object> {
  initialValues: TValues;
  validate: (values: TValues) => FormErrors<TValues>;
  onSubmit: (values: TValues) => Promise<void>;
}

export function useForm<TValues extends object>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<TValues>) {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors<TValues>>({});
  const [submitting, setSubmitting] = useState(false);

  const reset = useCallback((nextValues: TValues) => {
    setValues(nextValues);
    setErrors({});
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setValues((current) => ({ ...current, [name]: value }) as TValues);
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    try {
      await onSubmit(values);
    } catch (cause) {
      setErrors({
        submit:
          cause instanceof Error
            ? cause.message
            : "Something went wrong. Please try again.",
      } as FormErrors<TValues>);
    } finally {
      setSubmitting(false);
    }
  }

  return {
    values,
    reset,
    errors,
    submitting,
    handleChange,
    handleSubmit,
  };
}
