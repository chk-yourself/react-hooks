import type { FormEvent, ChangeEvent } from 'react';
import { renderHook, act } from '@testing-library/react';
import useForm from './useForm';

// Define the type for the form values
interface MyFormValues {
  username: string;
  email: string;
  password: string;
}

// Initial form values
const initialValues: MyFormValues = {
  username: '',
  email: '',
  password: '',
};

// Form validation function
const validate = (values: MyFormValues) => {
  const errors: { [key: string]: string } = {};
  if (!values.username) {
    errors.username = 'Username is required';
  }
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
};

// Form submission function
const onSubmit = jest.fn();

// Create a mock FormEvent for form submission
const createFormEvent = (): FormEvent<HTMLFormElement> => {
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    persist: jest.fn(),
    nativeEvent: {} as Event,
    currentTarget: {} as HTMLFormElement,
    target: {} as EventTarget,
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    timeStamp: Date.now(),
    type: '',
    isDefaultPrevented: jest.fn(() => false),
    isPropagationStopped: jest.fn(() => false),
  } as unknown as FormEvent<HTMLFormElement>;
};

describe('useForm', () => {
  it('should initialize form with default values', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validate, onSubmit),
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });

  it('should update form values on change', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validate, onSubmit),
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'testuser' },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.username).toBe('testuser');
  });

  it('should validate form values on submit', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validate, onSubmit),
    );

    act(() => {
      result.current.handleSubmit(createFormEvent());
    });

    expect(result.current.errors).toEqual({
      username: 'Username is required',
      email: 'Email is required',
      password: 'Password is required',
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit when there are no validation errors', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validate, onSubmit),
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'testuser' },
      } as ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: 'email', value: 'testuser@example.com' },
      } as ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: 'password', value: 'password123' },
      } as ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleSubmit(createFormEvent());
    });

    expect(result.current.errors).toEqual({});
    expect(onSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });
  });

  it('should reset form values and errors', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validate, onSubmit),
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'testuser' },
      } as ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });
});
