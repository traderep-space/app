import {
  Button,
  Card,
  CardContent,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import { ethers } from 'ethers';
import useError from 'hooks/useError';
import useForecast from 'hooks/useForecast';
import useToast from 'hooks/useToast';
import useZora from 'hooks/useZora';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';
import ForecastCreateAskDialog from './ForecastCreateAskDialog';
import ForecastDetailsDialog from './ForecastDetailsDialog';

const LitJsSdk = require('lit-js-sdk');

/**
 * A component with a card with forecast.
 */
export default function ForecastCard({ forecast }: any) {
  const { account } = useContext(Web3Context);
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { handleError } = useError();
  const { showToastSuccess } = useToast();
  const { verifyForecast } = useForecast();
  const { getAsk, fillAsk } = useZora();
  const [ask, setAsk] = useState<any>(null);

  function CreateAskButton() {
    if (ask?.askPrice.isZero() && forecast.owner === account.toLowerCase()) {
      return (
        <Button
          size="small"
          variant="contained"
          onClick={() =>
            showDialog?.(
              <ForecastCreateAskDialog
                forecastId={forecast.id}
                onClose={closeDialog}
              />,
            )
          }
        >
          Sell
        </Button>
      );
    }
    return <></>;
  }

  function FillAskButton() {
    if (
      ask &&
      !ask.askPrice.isZero() &&
      forecast.owner !== account.toLowerCase()
    ) {
      return (
        <Button
          size="small"
          variant="contained"
          onClick={() =>
            fillAsk(
              process.env.NEXT_PUBLIC_FORECAST_CONTRACT_ADDRESS || '',
              forecast.id,
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

  function OpenDetailsButton() {
    async function openDetails() {
      await LitJsSdk.checkAndSignAuthMessage({
        chain: process.env.NEXT_PUBLIC_LIT_PROTOCOL_CHAIN,
      });
      showDialog?.(
        <ForecastDetailsDialog forecast={forecast} onClose={closeDialog} />,
      );
    }

    return (
      <Button size="small" variant="contained" onClick={() => openDetails()}>
        Details
      </Button>
    );
  }

  function VerifyButton() {
    if (!forecast.isVerified) {
      return (
        <Button
          size="small"
          variant="contained"
          onClick={() =>
            verifyForecast(forecast.id)
              .then(() =>
                showToastSuccess('Success! Data will be updated soon'),
              )
              .catch((error: any) => handleError(error, true))
          }
        >
          Verify
        </Button>
      );
    }
    return <></>;
  }

  useEffect(() => {
    if (account && forecast) {
      setAsk(null);
      getAsk(
        process.env.NEXT_PUBLIC_FORECAST_CONTRACT_ADDRESS || '',
        forecast.id,
      )
        .then((ask) => setAsk(ask))
        .catch((error: any) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast, account]);

  if (forecast) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: '10px !important' }}>
          <Stack spacing={1}>
            {/* Id */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary">Forecast</Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography>#{forecast.id}</Typography>
                <OpenDetailsButton />
              </Stack>
            </Stack>
            {/* Id */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary">Created Date</Typography>
              <Typography>
                {new Date(forecast.createdDate * 1000).toLocaleString()}
              </Typography>
            </Stack>
            {/* Verification status */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary">Verification</Typography>
              {forecast.isVerified ? (
                <Typography>
                  {forecast.isTrue ? '👍 Is True' : 'Is Not True'}
                </Typography>
              ) : (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography>❓Not Verified</Typography>
                  <VerifyButton />
                </Stack>
              )}
            </Stack>
            <Divider />
            {/* Author */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Author</Typography>
              <Link href={`/traders/${forecast.author}`} passHref>
                <MuiLink underline="none">
                  <Typography>
                    {addressToShortAddress(forecast.author)}
                  </Typography>
                </MuiLink>
              </Link>
            </Stack>
            {/* Owner */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Owner</Typography>
              <Link href={`/traders/${forecast.owner}`} passHref>
                <MuiLink underline="none">
                  <Typography>
                    {addressToShortAddress(forecast.owner)}
                  </Typography>
                </MuiLink>
              </Link>
            </Stack>
            <Divider />
            {/* Price */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary">Price</Typography>
              {ask && !ask.askPrice.isZero() ? (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography>
                    {ethers.utils.formatEther(ask.askPrice)}{' '}
                    {process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL}
                  </Typography>
                  <FillAskButton />
                </Stack>
              ) : (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography>No Price</Typography>
                  <CreateAskButton />
                </Stack>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }
  return <></>;
}
