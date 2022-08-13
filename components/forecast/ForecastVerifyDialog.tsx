import {
  Cancel,
  CheckCircle,
  HourglassBottom,
  Save,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FORECAST_TYPE } from 'classes/Forecast';
import useError from 'hooks/useError';
import useForecast from 'hooks/useForecast';
import useToast from 'hooks/useToast';
import { useEffect, useState } from 'react';

/**
 * A dialog to verify forecasts.
 */
export default function ForecastVerifyDialog(props: {
  traderId: string;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { handleError } = useError();
  const { showToastSuccess } = useToast();
  const { saveForecastVerificationResults } = useForecast();
  const { getForecasts, getForecastParams } = useForecast();
  const [forecastVerifications, setForecastVerifications] = useState<
    Array<any>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(!props.isClose);

  async function loadData() {
    try {
      setIsLoading(true);
      setForecastVerifications([]);
      // Load public forecasts
      const forecasts = await getForecasts({
        author: props.traderId,
        type: FORECAST_TYPE.public,
        isVerified: false,
      });
      // Define forecast verifications
      const forecastVerifications = [];
      for (const forecast of forecasts) {
        // Load forecast params
        const forecastParams = await getForecastParams(forecast.id);
        // Define random results
        const forecastOrderPriceResult = Math.random() < 0.8;
        const forecastTpPriceResult =
          forecastOrderPriceResult && Math.random() < 0.4;
        const forecastSlPriceResult =
          forecastOrderPriceResult &&
          !forecastTpPriceResult &&
          Math.random() < 0.6;
        // Collect all data into one object
        forecastVerifications.push({
          id: forecast.id,
          symbol: forecast.symbol,
          createdDate: forecast.createdDate,
          orderPrice: forecastParams.orderPrice,
          orderPriceResult: forecastOrderPriceResult,
          tpPrice: forecastParams.tpPrice,
          tpPriceResult: forecastTpPriceResult,
          slPrice: forecastParams.slPrice,
          slPriceResult: forecastSlPriceResult,
        });
      }
      setForecastVerifications(forecastVerifications);
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsLoading(false);
    }
  }

  async function postVerifications() {
    try {
      setIsProcessing(true);
      // Define forecasts with verification results
      const forecastIds: Array<string> = [];
      const forecastVerificationResults: Array<boolean> = [];
      for (const verification of forecastVerifications) {
        if (verification.orderPriceResult && verification.tpPriceResult) {
          forecastIds.push(verification.id);
          forecastVerificationResults.push(true);
        }
        if (verification.orderPriceResult && verification.slPriceResult) {
          forecastIds.push(verification.id);
          forecastVerificationResults.push(false);
        }
      }
      // Show error if there are no forecasts with verification results
      if (forecastIds.length === 0) {
        throw new Error('There are no completed forecasts, try later');
      }
      // Save verification results
      await saveForecastVerificationResults(
        forecastIds,
        forecastVerificationResults,
      );
      showToastSuccess('Success! Data will be updated soon');
      close();
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsProcessing(false);
    }
  }

  async function close() {
    setIsLoading(false);
    setIsOpen(false);
    props.onClose?.();
  }

  function Result(props: {
    type: 'success' | 'fail' | 'inProgress';
    value: string;
  }) {
    return (
      <Stack
        direction="row"
        spacing={0.6}
        alignItems="center"
        justifyContent="flex-end"
      >
        {props.type === 'success' && (
          <>
            <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
            <Typography color="success.main">{props.value}</Typography>
          </>
        )}
        {props.type === 'fail' && (
          <>
            <Cancel sx={{ color: 'error.main', fontSize: 18 }} />
            <Typography color="error.main">{props.value}</Typography>
          </>
        )}
        {props.type === 'inProgress' && (
          <>
            <HourglassBottom sx={{ color: 'warning.main', fontSize: 18 }} />
            <Typography color="warning.main">{props.value}</Typography>
          </>
        )}
      </Stack>
    );
  }

  useEffect(() => {
    if (props.traderId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.traderId]);

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? () => {} : close}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Verify Forecasts</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <Typography>Status of unverified forecasts.</Typography>
            <Typography sx={{ mt: 1 }}>
              Post results of completed forecasts to the smart contract to mark
              them as verified and update the author&apos;s reputation.
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Forecast</TableCell>
                    <TableCell align="right">Symbol</TableCell>
                    <TableCell align="right">Created Date</TableCell>
                    <TableCell align="right">Order Price</TableCell>
                    <TableCell align="right">Take Profit Price</TableCell>
                    <TableCell align="right">Stop Loss Price</TableCell>
                    <TableCell align="right">Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forecastVerifications.map((verification) => (
                    <TableRow
                      key={verification.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      {/* Id */}
                      <TableCell component="th" scope="row">
                        #{verification.id}
                      </TableCell>
                      {/* Symbol */}
                      <TableCell align="right">{verification.symbol}</TableCell>
                      {/* Created date */}
                      <TableCell align="right">
                        {new Date(
                          (verification.createdDate as any) * 1000,
                        ).toLocaleString()}
                      </TableCell>
                      {/* Order price */}
                      <TableCell align="right">
                        <Result
                          value={verification.orderPrice}
                          type={
                            verification.orderPriceResult
                              ? 'success'
                              : 'inProgress'
                          }
                        />
                      </TableCell>
                      {/* Take profit price */}
                      <TableCell align="right">
                        <Result
                          value={verification.tpPrice}
                          type={
                            verification.tpPriceResult
                              ? 'success'
                              : verification.slPriceResult
                              ? 'fail'
                              : 'inProgress'
                          }
                        />
                      </TableCell>
                      {/* Stop loss price */}
                      <TableCell align="right">
                        <Result
                          value={verification.slPrice}
                          type={
                            verification.slPriceResult
                              ? 'success'
                              : verification.tpPriceResult
                              ? 'fail'
                              : 'inProgress'
                          }
                        />
                      </TableCell>
                      {/* Result */}
                      <TableCell align="right">
                        <Result
                          value={
                            verification.orderPriceResult &&
                            verification.tpPriceResult
                              ? 'Is True'
                              : verification.orderPriceResult &&
                                verification.slPriceResult
                              ? 'Is Not True'
                              : 'In Progress'
                          }
                          type={
                            verification.orderPriceResult &&
                            verification.tpPriceResult
                              ? 'success'
                              : verification.orderPriceResult &&
                                verification.slPriceResult
                              ? 'fail'
                              : 'inProgress'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {isProcessing ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  startIcon={<Save />}
                  variant="outlined"
                >
                  Processing
                </LoadingButton>
              ) : (
                <>
                  <Button variant="contained" onClick={postVerifications}>
                    Post Results
                  </Button>
                  <Button variant="outlined" onClick={close}>
                    Cancel
                  </Button>
                </>
              )}
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
