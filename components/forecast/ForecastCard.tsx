import {
  AccountBalanceWalletOutlined,
  HourglassBottom,
  InfoOutlined,
  LockOutlined,
  ThumbDown,
  ThumbUp,
  TrendingUp,
} from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import Forecast, { FORECAST_TYPE } from 'classes/Forecast';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import { ethers } from 'ethers';
import useError from 'hooks/useError';
import useToast from 'hooks/useToast';
import useZora from 'hooks/useZora';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';
import ForecastCreateAskDialog from './ForecastCreateAskDialog';
import ForecastParamsDialog from './ForecastParamsDialog';

/**
 * A component with a card with forecast.
 */
export default function ForecastCard(props: { forecast: Forecast }) {
  const { account } = useContext(Web3Context);
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { handleError } = useError();
  const { showToastSuccess } = useToast();
  const { getAsk, fillAsk } = useZora();
  const [ask, setAsk] = useState<any>(null);
  const isAccountOwner =
    account?.toLowerCase() === props.forecast.owner?.toLowerCase();

  function AskButton() {
    // Sell button
    if (ask?.askPrice.isZero() && isAccountOwner) {
      return (
        <Button
          startIcon={<AccountBalanceWalletOutlined />}
          size="small"
          variant="outlined"
          onClick={() =>
            showDialog?.(
              <ForecastCreateAskDialog
                forecastId={props.forecast.id}
                onClose={closeDialog}
              />,
            )
          }
        >
          Sell
        </Button>
      );
    }
    // Buy button
    if (ask && !ask.askPrice.isZero() && !isAccountOwner) {
      return (
        <Button
          startIcon={<AccountBalanceWalletOutlined />}
          size="small"
          variant="outlined"
          onClick={() =>
            fillAsk(
              process.env.NEXT_PUBLIC_FORECAST_CONTRACT_ADDRESS || '',
              props.forecast.id,
              ethers.utils.formatEther(ask.askPrice),
            )
              .then(() =>
                showToastSuccess('Success! Data will be updated soon'),
              )
              .catch((error: any) => handleError(error, true))
          }
        >
          Buy
        </Button>
      );
    }
    return <></>;
  }

  useEffect(() => {
    setAsk(null);
    if (account && props.forecast) {
      getAsk(
        process.env.NEXT_PUBLIC_FORECAST_CONTRACT_ADDRESS || '',
        props.forecast.id,
      )
        .then((ask) => setAsk(ask))
        .catch((error: any) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.forecast, account]);

  if (props.forecast) {
    return (
      <Card variant="outlined">
        <CardContent>
          {/* Id */}
          <Stack direction="row" spacing={0.6} alignItems="center">
            <TrendingUp sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Forecast #<b>{props.forecast.id}</b>
            </Typography>
          </Stack>
          {/* Symbol */}
          <Typography variant="h4" sx={{ mt: 1.5 }}>
            {props.forecast.symbol}
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Stack spacing={1} sx={{ mt: 2 }}>
            {/* Created date */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Posted</Typography>
              <Typography>
                {new Date(
                  (props.forecast.createdDate as any) * 1000,
                ).toLocaleString()}
              </Typography>
            </Stack>
            {/* Verification */}
            {props.forecast.type === FORECAST_TYPE.public && (
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Verification</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {props.forecast.isVerified ? (
                    props.forecast.isTrue ? (
                      <>
                        <ThumbUp sx={{ color: 'success.main', fontSize: 18 }} />
                        <Typography color="success.main">Is True</Typography>
                      </>
                    ) : (
                      <>
                        <ThumbDown sx={{ color: 'error.main', fontSize: 18 }} />
                        <Typography color="error.main">Is Not True</Typography>
                      </>
                    )
                  ) : (
                    <>
                      <HourglassBottom
                        sx={{ color: 'warning.main', fontSize: 18 }}
                      />
                      <Typography color="warning.main">
                        Is Not Verified
                      </Typography>
                    </>
                  )}
                </Stack>
              </Stack>
            )}
            {/* Author */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Author</Typography>
              <Link href={`/traders/${props.forecast.author}`} passHref>
                <MuiLink underline="none">
                  <Typography>
                    {addressToShortAddress(props.forecast.author)}
                  </Typography>
                </MuiLink>
              </Link>
            </Stack>
            {/* Owner */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Owner</Typography>
              <Link href={`/traders/${props.forecast.owner}`} passHref>
                <MuiLink underline="none">
                  <Typography>
                    {addressToShortAddress(props.forecast.owner)}
                  </Typography>
                </MuiLink>
              </Link>
            </Stack>
            {/* Price */}
            {props.forecast.type === FORECAST_TYPE.private && (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary">Price</Typography>
                {ask && !ask.askPrice.isZero() ? (
                  <Typography>
                    {ethers.utils.formatEther(ask.askPrice)}{' '}
                    {process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL}
                  </Typography>
                ) : (
                  <Typography>No Price</Typography>
                )}
              </Stack>
            )}
          </Stack>
          {/* Actions */}
          <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
            {/* Show params button */}
            <Button
              startIcon={
                props.forecast.type === FORECAST_TYPE.private ? (
                  <LockOutlined />
                ) : (
                  <InfoOutlined />
                )
              }
              size="small"
              variant="outlined"
              onClick={() =>
                showDialog?.(
                  <ForecastParamsDialog
                    forecast={props.forecast}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              Show Params
            </Button>
            {/* Buy and sell button */}
            {props.forecast.type === FORECAST_TYPE.private && <AskButton />}
          </Stack>
        </CardContent>
      </Card>
    );
  }
  return <></>;
}
