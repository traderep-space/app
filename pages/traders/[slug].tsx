import {
  AddOutlined,
  EnhancedEncryptionOutlined,
  Language,
  MailOutlineRounded,
  Telegram,
  Twitter,
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Avatar,
  Button,
  Link as MuiLink,
  Stack,
  Tab,
  Typography,
} from '@mui/material';
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

  function Details() {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {/* Left part with avatar */}
        <Box sx={{ mt: 1 }}>
          <Avatar
            sx={{ bgcolor: '#FFFFFF', width: 56, height: 56, fontSize: 32 }}
          >
            🧑‍💼
          </Avatar>
        </Box>
        {/* Righ part */}
        <Box sx={{ ml: 3 }}>
          {/* Address and reputation */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h4">
              Trader <b>{addressToShortAddress(slug as string)}</b>
            </Typography>
            {trader && (
              <>
                <Typography color="success.main" variant="h6">
                  <b>👍{trader.positiveReputation}</b>
                </Typography>
                <Typography color="error.main" variant="h6">
                  <b>👎{trader.negativeReputation}</b>
                </Typography>
              </>
            )}
          </Stack>
          {/* Links */}
          {/* TODO: Use real links */}
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <MuiLink href="#" target="_blank">
              <MailOutlineRounded />
            </MuiLink>
            <MuiLink href="#" target="_blank">
              <Language />
            </MuiLink>
            <MuiLink href="#" target="_blank">
              <Twitter />
            </MuiLink>
            <MuiLink href="#" target="_blank">
              <Telegram />
            </MuiLink>
          </Stack>
        </Box>
      </Box>
    );
  }

  function Forecasts() {
    const [tabValue, setTabValue] = useState('1');

    function handleChange(_: any, newTabValue: any) {
      setTabValue(newTabValue);
    }

    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <TabContext value={tabValue}>
          <TabList
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 1,
              maxWidth: 'calc(100vw - 32px)',
            }}
          >
            <Tab label="Posted Forecasts" value="1" />
            <Tab label="Owned Forecasts" value="2" />
          </TabList>
          {/* Posted forecasts */}
          <TabPanel value="1" sx={{ px: 0 }}>
            {account?.toLowerCase() === (slug as string)?.toLowerCase() && (
              <Box sx={{ mb: 4 }}>
                {/* TODO: Implement this button */}
                <Button variant="contained" startIcon={<AddOutlined />}>
                  Post New
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EnhancedEncryptionOutlined />}
                  sx={{ ml: 2 }}
                  onClick={() =>
                    showDialog?.(<ForecastPostDialog onClose={closeDialog} />)
                  }
                >
                  Post New Encrypted
                </Button>
              </Box>
            )}
            <ForecastList forecasts={forecastsPosted} />
          </TabPanel>
          {/* Owned forecasts */}
          <TabPanel value="2" sx={{ px: 0 }}>
            <ForecastList forecasts={forecastsOwned} />
          </TabPanel>
        </TabContext>
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
      <Details />
      <Forecasts />
    </Layout>
  );
}
