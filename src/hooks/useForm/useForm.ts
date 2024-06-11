import { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from "react";

type FormValues = { [key: string]: any };
type FormErrors = { [key: string]: string };
type ValidateFunction<T> = (values: T) => FormErrors;
type SubmitFunction<T> = (values: T) => void;

interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

function useForm<T extends FormValues>(
  initialValues: T,
  validate: ValidateFunction<T>,
  onSubmit: SubmitFunction<T>
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  // Handle form value changes
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      } else {
        setErrors(validationErrors);
      }
    },
    [values, validate, onSubmit]
  );

  // Reset form values and errors
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  };
}

export default useForm;
