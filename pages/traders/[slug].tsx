import {
  AddOutlined,
  Check,
  Language,
  LockOutlined,
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
import Forecast, { FORECAST_TYPE } from 'classes/Forecast';
import Trader from 'classes/Trader';
import ForecastList from 'components/forecast/ForecastList';
import ForecastPostDialog from 'components/forecast/ForecastPostDialog';
import ForecastVerifyDialog from 'components/forecast/ForecastVerifyDialog';
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
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout>
      <Details traderId={slug as string} />
      <ForecastsTabs traderId={slug as string} sx={{ mt: 4 }} />
    </Layout>
  );
}

function Details(props: { traderId: string; sx?: any }) {
  const { handleError } = useError();
  const { getTrader } = useTrader();
  const [trader, setTrader] = useState<Trader | null>(null);

  useEffect(() => {
    setTrader(null);
    if (props.traderId) {
      getTrader(props.traderId)
        .then((trader) => setTrader(trader))
        .catch((error: any) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.traderId]);

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
            Trader <b>{addressToShortAddress(props.traderId)}</b>
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

function ForecastsTabs(props: { traderId: string; sx?: any }) {
  const [tabValue, setTabValue] = useState('1');

  function handleChange(_: any, newTabValue: any) {
    setTabValue(newTabValue);
  }

  return (
    <Box sx={{ width: '100%', ...props.sx }}>
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
          <Tab label="Posted Public Forecasts" value="1" />
          <Tab label="Posted Private Forecasts" value="2" />
          <Tab label="Bought Forecasts" value="3" />
        </TabList>
        <TabPanel value="1" sx={{ px: 0 }}>
          <Forecasts type="postedPublic" traderId={props.traderId} />
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0 }}>
          <Forecasts type="postedPrivate" traderId={props.traderId} />
        </TabPanel>
        <TabPanel value="3" sx={{ px: 0 }}>
          <Forecasts type="bought" traderId={props.traderId} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

function Forecasts(props: {
  type: 'postedPublic' | 'postedPrivate' | 'bought';
  traderId: string;
  sx?: any;
}) {
  const { account } = useContext(Web3Context);
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { handleError } = useError();
  const { getForecasts } = useForecast();
  const [forecasts, setForecasts] = useState<Array<Forecast> | null>(null);
  const isAccountOwner =
    account?.toLowerCase() === props.traderId?.toLowerCase();

  useEffect(() => {
    setForecasts(null);
    if (props.type && props.traderId) {
      if (props.type === 'postedPublic') {
        getForecasts({ author: props.traderId, type: FORECAST_TYPE.public })
          .then((forecasts) => setForecasts(forecasts))
          .catch((error: any) => handleError(error, true));
      }
      if (props.type === 'postedPrivate') {
        getForecasts({ author: props.traderId, type: FORECAST_TYPE.private })
          .then((forecasts) => setForecasts(forecasts))
          .catch((error: any) => handleError(error, true));
      }
      if (props.type === 'bought') {
        getForecasts({ notAuthor: props.traderId, owner: props.traderId })
          .then((forecasts) => setForecasts(forecasts))
          .catch((error: any) => handleError(error, true));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.type, props.traderId]);

  return (
    <Box>
      {/* Actions for public forecasts */}
      {props.type === 'postedPublic' && (
        <Box sx={{ mb: 4 }}>
          {isAccountOwner && (
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              sx={{ mr: 2 }}
              onClick={() =>
                showDialog?.(
                  <ForecastPostDialog
                    type={FORECAST_TYPE.public}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              Post Public Forecast
            </Button>
          )}
          <Button
            variant={isAccountOwner ? 'outlined' : 'contained'}
            startIcon={<Check />}
            onClick={() =>
              showDialog?.(
                <ForecastVerifyDialog
                  traderId={props.traderId}
                  onClose={closeDialog}
                />,
              )
            }
          >
            Verify Forecasts
          </Button>
        </Box>
      )}
      {/* Actions for private forecasts */}
      {props.type === 'postedPrivate' && isAccountOwner && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<LockOutlined />}
            onClick={() =>
              showDialog?.(
                <ForecastPostDialog
                  type={FORECAST_TYPE.private}
                  onClose={closeDialog}
                />,
              )
            }
          >
            Post Private Forecast
          </Button>
        </Box>
      )}
      <ForecastList forecasts={forecasts} />
    </Box>
  );
}
