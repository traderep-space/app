import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
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
        .catch((error: any) => handleError(error, true))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast]);

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? () => {} : close}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Details of forecast #{forecast.id}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : forecastDetails ? (
          <>
            <Typography gutterBottom>
              Symbol: {forecastDetails.symbol}
            </Typography>
            <Typography gutterBottom>
              Order Price: {forecastDetails.orderPrice}
            </Typography>
            <Typography gutterBottom>
              Take Profie Price: {forecastDetails.tpPrice}
            </Typography>
            <Typography gutterBottom>
              Stop Loss Price: {forecastDetails.slPrice}
            </Typography>
          </>
        ) : (
          <></>
        )}
      </DialogContent>
    </Dialog>
  );
}
