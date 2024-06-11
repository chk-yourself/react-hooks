type FormValues = {
    [key: string]: any;
};
type FormErrors = {
    [key: string]: string;
};
type ValidateFunction<T> = (values: T) => FormErrors;
type SubmitFunction<T> = (values: T) => void;
interface UseFormReturn<T> {
    values: T;
    errors: FormErrors;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    resetForm: () => void;
}
declare function useForm<T extends FormValues>(initialValues: T, validate: ValidateFunction<T>, onSubmit: SubmitFunction<T>): UseFormReturn<T>;
export default useForm;
