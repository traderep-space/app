import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import { ethers } from 'ethers';
import useError from 'hooks/useError';
import useForecast from 'hooks/useForecast';
import useToast from 'hooks/useToast';
import useZora from 'hooks/useZora';
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
        Open Details
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
    if (forecast) {
      setAsk(null);
      getAsk(
        process.env.NEXT_PUBLIC_FORECAST_CONTRACT_ADDRESS || '',
        forecast.id,
      )
        .then((ask) => setAsk(ask))
        .catch((error: any) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast]);

  if (forecast) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: '10px !important' }}>
          <Typography>#{forecast.id}</Typography>
          <Typography>
            Author: {addressToShortAddress(forecast.author)}
          </Typography>
          <Typography>
            Owner: {addressToShortAddress(forecast.owner)}
          </Typography>
          {forecast.isVerified && (
            <Typography>
              {forecast.isTrue ? 'Is true' : 'Is not true'}
            </Typography>
          )}
          {ask && !ask.askPrice.isZero() && (
            <Typography>
              Price: {ethers.utils.formatEther(ask.askPrice)}{' '}
              {process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL}
            </Typography>
          )}
          <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
            <OpenDetailsButton />
            <VerifyButton />
            <CreateAskButton />
            <FillAskButton />
          </Stack>
        </CardContent>
      </Card>
    );
  }
  return <></>;
}
