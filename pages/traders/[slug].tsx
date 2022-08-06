import { Button, Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Forecast from 'classes/Forecast';
import Trader from 'classes/Trader';
import ForecastList from 'components/forecast/ForecastList';
import ForecastPostDialog from 'components/forecast/ForecastPostDialog';
import Layout from 'components/layout/Layout';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import useError from 'hooks/useError';
import useForecast from 'hooks/useForecast';
import useTrader from 'hooks/useTrader';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';

/**
 * Trader page.
 */
export default function TraderPage() {
  const { account } = useContext(Web3Context);
  const { showDialog, closeDialog } = useContext(DialogContext);
  const router = useRouter();
  const { slug } = router.query;
  const { handleError } = useError();
  const { getTrader } = useTrader();
  const { getForecasts } = useForecast();
  const [trader, setTrader] = useState<Trader | null>(null);
  const [forecastsPosted, setForecastsPosted] =
    useState<Array<Forecast> | null>(null);
  const [forecastsOwned, setForecastsOwned] = useState<Array<Forecast> | null>(
    null,
  );

  async function loadData() {
    try {
      // Clear states
      setTrader(null);
      setForecastsPosted(null);
      setForecastsOwned(null);
      // Load data
      const trader = await getTrader(slug as string);
      const forecastsPosted = await getForecasts(undefined, slug as string);
      const forecastsOwned = await getForecasts(
        undefined,
        undefined,
        slug as string,
      );
      setTrader(trader);
      setForecastsPosted(forecastsPosted);
      setForecastsOwned(forecastsOwned);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  function Header() {
    return (
      <Box>
        <Typography variant="h4">
          Trader {addressToShortAddress(slug as string)}
        </Typography>
        <Divider sx={{ mt: 2 }} />
        {trader && (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Typography>Reputation:</Typography>
            <Typography sx={{ mt: 1 }} color="success.main">
              +{trader.positiveReputation}
            </Typography>
            <Typography sx={{ mt: 1 }} color="error.main">
              -{trader.negativeReputation}
            </Typography>
          </Stack>
        )}
      </Box>
    );
  }

  function ForecastsPosted() {
    return (
      <Box sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">Forecasts posted by trader</Typography>
          {account?.toLowerCase() === (slug as string)?.toLowerCase() && (
            <Button
              onClick={() =>
                showDialog?.(<ForecastPostDialog onClose={closeDialog} />)
              }
              variant="outlined"
            >
              Post new
            </Button>
          )}
        </Box>
        <Divider sx={{ mt: 2 }} />
        <ForecastList forecasts={forecastsPosted} sx={{ mt: 1 }} />
      </Box>
    );
  }

  function ForecastsOwned() {
    return (
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5">Forecasts owned by trader</Typography>
        <Divider sx={{ mt: 2 }} />
        <ForecastList forecasts={forecastsOwned} sx={{ mt: 1 }} />
      </Box>
    );
  }

  useEffect(() => {
    if (slug) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, slug]);

  return (
    <Layout>
      <Header />
      <ForecastsPosted />
      <ForecastsOwned />
    </Layout>
  );
}
