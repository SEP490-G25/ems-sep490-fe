import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification utilities
 * Wraps sonner toast with consistent styling and patterns
 */
export const toast = {
  /**
   * Show a success toast
   */
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an error toast
   */
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * Show a warning toast
   */
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an info toast
   */
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a loading toast
   * Returns a function to dismiss the toast
   */
  loading: (message: string, description?: string) => {
    const id = sonnerToast.loading(message, {
      description,
    });
    return () => sonnerToast.dismiss(id);
  },

  /**
   * Show a promise toast with loading, success, and error states
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};
