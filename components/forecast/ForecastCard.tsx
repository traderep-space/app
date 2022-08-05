import { Button, Card, CardContent, Typography } from '@mui/material';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import { ethers } from 'ethers';
import useError from 'hooks/useError';
import useToast from 'hooks/useToast';
import useZora from 'hooks/useZora';
import { useContext, useEffect, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';
import ForecastCreateAskDialog from './ForecastCreateAskDialog';

/**
 * A component with a card with forecast.
 */
export default function ForecastCard({ forecast }: any) {
  const { account } = useContext(Web3Context);
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { handleError } = useError();
  const { showToastSuccess } = useToast();
  const { getAsk, fillAsk } = useZora();
  const [ask, setAsk] = useState<any>(null);

  function CreateAskButton() {
    if (ask?.askPrice.isZero() && forecast.owner === account.toLowerCase()) {
      return (
        <Button
          size="small"
          variant="contained"
          sx={{ mt: 2 }}
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
          sx={{ mt: 2 }}
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
          {ask && !ask.askPrice.isZero() && (
            <Typography>
              Price: {ethers.utils.formatEther(ask.askPrice)}{' '}
              {process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL}
            </Typography>
          )}
          <CreateAskButton />
          <FillAskButton />
        </CardContent>
      </Card>
    );
  }
  return <></>;
}
