import { truncate } from 'lodash';
import { useSnackbar } from 'notistack';

/**
 * Hook for work with toasts.
 */
export default function useToast() {
  const { enqueueSnackbar } = useSnackbar();

  let showToastSuccess = function (message: string) {
    enqueueSnackbar(message, {
      variant: 'success',
    });
  };

  let showToastError = function (error: any) {
    const message = truncate(`Error: ${error.message}`, {
      length: 256,
    });
    enqueueSnackbar(message, {
      variant: 'error',
    });
  };

  return {
    showToastSuccess,
    showToastError,
  };
}
