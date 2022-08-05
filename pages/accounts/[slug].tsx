import { Button, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Forecast from 'classes/Forecast';
import ForecastList from 'components/forecast/ForecastList';
import ForecastPostDialog from 'components/forecast/ForecastPostDialog';
import Layout from 'components/layout/Layout';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import useError from 'hooks/useError';
import useForecast from 'hooks/useForecast';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';

/**
 * Account page.
 */
export default function Account() {
  const { account } = useContext(Web3Context);
  const { showDialog, closeDialog } = useContext(DialogContext);
  const router = useRouter();
  const { slug } = router.query;
  const { handleError } = useError();
  const { getForecasts } = useForecast();
  const [forecastsPosted, setForecastsPosted] =
    useState<Array<Forecast> | null>(null);
  const [forecastsOwned, setForecastsOwned] = useState<Array<Forecast> | null>(
    null,
  );

  async function loadData() {
    try {
      // Clear states
      setForecastsPosted(null);
      setForecastsOwned(null);
      // Load data
      const forecastsPosted = await getForecasts(slug as string);
      const forecastsOwned = await getForecasts(undefined, slug as string);
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
          Account {addressToShortAddress(slug as string)}
        </Typography>
        <Divider sx={{ mt: 2 }} />
        <Typography sx={{ mt: 1 }} color="success.main">
          Positive Reputation: ...
        </Typography>
        <Typography sx={{ mt: 1 }} color="error.main">
          Negative Reputation: ...
        </Typography>
      </Box>
    );
  }

  function ForecastsPosted() {
    return (
      <Box sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">Forecasts posted by account</Typography>
          {account === slug && (
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
        <ForecastList items={forecastsPosted} sx={{ mt: 1 }} />
      </Box>
    );
  }

  function ForecastsOwned() {
    return (
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5">Forecasts owned by account</Typography>
        <Divider sx={{ mt: 2 }} />
        <ForecastList items={forecastsOwned} sx={{ mt: 1 }} />
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

/**
 * Define localized texts before rendering the page.
 */
export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
