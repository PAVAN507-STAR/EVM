import { useSnackbar } from 'notistack';

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = (message, variant = 'default') => {
    enqueueSnackbar(message, { variant });
  };

  return { showNotification };
}; 