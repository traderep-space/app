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
import useForecast from 'hooks/useForecast';
import useToast from 'hooks/useToast';
import useZora from 'hooks/useZora';
import { capitalize } from 'lodash';
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
  const { verifyForecast } = useForecast();
  const { getAsk, fillAsk } = useZora();
  const [ask, setAsk] = useState<any>(null);

  function CreateAskButton() {
    if (
      ask?.askPrice.isZero() &&
      props.forecast.owner === account.toLowerCase()
    ) {
      return (
        <Button
          size="small"
          variant="contained"
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
    return <></>;
  }

  function FillAskButton() {
    if (
      ask &&
      !ask.askPrice.isZero() &&
      props.forecast.owner !== account.toLowerCase()
    ) {
      return (
        <Button
          size="small"
          variant="contained"
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

  function OpenParamsButton() {
    return (
      <Button
        size="small"
        variant="contained"
        onClick={() =>
          showDialog?.(
            <ForecastParamsDialog
              forecast={props.forecast}
              onClose={closeDialog}
            />,
          )
        }
      >
        Params
      </Button>
    );
  }

  function VerifyButton() {
    if (!props.forecast.isVerified) {
      return (
        <Button
          size="small"
          variant="contained"
          onClick={() =>
            verifyForecast(props.forecast.id)
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
    if (account && props.forecast) {
      setAsk(null);
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
                <Typography>#{props.forecast.id}</Typography>
                <OpenParamsButton />
              </Stack>
            </Stack>
            {/* Type */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary">Type</Typography>
              <Typography>{capitalize(props.forecast.type as any)}</Typography>
            </Stack>
            {/* Created date */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary">Created Date</Typography>
              <Typography>
                {new Date(
                  (props.forecast.createdDate as any) * 1000,
                ).toLocaleString()}
              </Typography>
            </Stack>
            {/* Verification status */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary">Verification</Typography>
              {props.forecast.isVerified ? (
                <Typography>
                  {props.forecast.isTrue ? '👍 Is True' : 'Is Not True'}
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
              <>
                <Divider />
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
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }
  return <></>;
}
