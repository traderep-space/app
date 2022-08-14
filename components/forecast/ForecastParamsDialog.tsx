import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import Forecast, { FORECAST_TYPE } from 'classes/Forecast';
import useError from 'hooks/useError';
import useForecast from 'hooks/useForecast';
import { useEffect, useState } from 'react';

const LitJsSdk = require('lit-js-sdk');

/**
 * A dialog to display forecast params.
 */
export default function ForecastParamsDialog(props: {
  forecast: Forecast;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { handleError } = useError();
  const { getForecastParams } = useForecast();
  const [forecastParams, setForecastParams] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!props.isClose);

  async function loadData() {
    try {
      setIsOpen(true);
      setIsLoading(true);
      setForecastParams(null);
      // Check auth sig for lit protocol
      if (props.forecast.type === FORECAST_TYPE.private) {
        setIsOpen(false);
        await LitJsSdk.checkAndSignAuthMessage({
          chain: process.env.NEXT_PUBLIC_LIT_PROTOCOL_CHAIN,
        });
        setIsOpen(true);
      }
      // Load forecast params
      setForecastParams(await getForecastParams(props.forecast.id));
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsLoading(false);
    }
  }

  async function close() {
    setIsLoading(false);
    setIsOpen(false);
    props.onClose?.();
  }

  useEffect(() => {
    if (props.forecast) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.forecast]);

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? () => {} : close}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Forecast #{props.forecast.id}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : forecastParams ? (
          <Stack spacing={1}>
            {/* Symbol */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Symbol</Typography>
              <Typography>{forecastParams.symbol}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Order Price</Typography>
              <Typography>{forecastParams.orderPrice}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Take Profie Price</Typography>
              <Typography>{forecastParams.tpPrice}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Stop Loss Price</Typography>
              <Typography>{forecastParams.slPrice}</Typography>
            </Stack>
          </Stack>
        ) : (
          <Typography>No params</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
