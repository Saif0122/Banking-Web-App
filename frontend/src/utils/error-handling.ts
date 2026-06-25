import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { AxiosError } from "axios";

interface BackendError {
  path?: string;
  message?: string;
  msg?: string;
}

interface BackendErrorResponse {
  message?: string;
  error?: string;
  errors?: BackendError[] | Record<string, string>;
}

/**
 * Handles form errors by parsing Axios backend error responses and setting field-specific errors.
 * Returns a general error message to be displayed if no field-specific errors were found or if a top-level message exists.
 */
export function handleFormError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): string {
  if (!(error instanceof AxiosError)) {
    return error instanceof Error ? error.message : "An unexpected error occurred.";
  }

  const responseData = error.response?.data as BackendErrorResponse | undefined;
  
  if (!responseData) {
    return error.message || "A network error occurred.";
  }

  let hasFieldErrors = false;

  // Handle array of errors (e.g. Zod validation errors from backend)
  if (Array.isArray(responseData.errors)) {
    responseData.errors.forEach((err) => {
      if (err.path || err.msg) {
        const fieldName = (err.path || err.msg) as Path<T>;
        const errorMessage = err.message || err.msg || "Invalid field";
        setError(fieldName, { type: "server", message: errorMessage });
        hasFieldErrors = true;
      }
    });
  } 
  // Handle record of errors (e.g. Record<string, string>)
  else if (responseData.errors && typeof responseData.errors === "object") {
    Object.entries(responseData.errors).forEach(([key, value]) => {
      setError(key as Path<T>, { type: "server", message: String(value) });
      hasFieldErrors = true;
    });
  }

  const generalMessage = responseData.message || responseData.error;

  // Return the general message if it exists, or fallback if no field errors were found
  if (generalMessage) {
    return generalMessage;
  }

  if (hasFieldErrors) {
    return "Please correct the errors in the form.";
  }

  return "An unexpected error occurred. Please try again.";
}
