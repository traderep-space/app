import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import useError from 'hooks/useError';
import useForecast from 'hooks/useForecast';
import { useEffect, useState } from 'react';

/**
 * A dialog to display forecast details.
 */
export default function ForecastDetailsDialog({
  forecast,
  isClose,
  onClose,
}: any) {
  const { handleError } = useError();
  const { getForecastDetails } = useForecast();
  const [forecastDetails, setForecastDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  async function close() {
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  useEffect(() => {
    if (forecast) {
      setIsLoading(true);
      getForecastDetails(forecast.id)
        .then((forecastDetails) => setForecastDetails(forecastDetails))
        .catch((error: any) => {
          handleError(error, true);
          close();
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast]);

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? () => {} : close}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Forecast #{forecast.id}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : forecastDetails ? (
          <Stack spacing={1}>
            {/* Symbol */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Symbol</Typography>
              <Typography>{forecastDetails.symbol}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Order Price</Typography>
              <Typography>{forecastDetails.orderPrice}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Take Profie Price</Typography>
              <Typography>{forecastDetails.tpPrice}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Stop Loss Price</Typography>
              <Typography>{forecastDetails.slPrice}</Typography>
            </Stack>
          </Stack>
        ) : (
          <></>
        )}
      </DialogContent>
    </Dialog>
  );
}
