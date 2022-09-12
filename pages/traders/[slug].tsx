import {
  AddOutlined,
  Check,
  Language,
  LockOutlined,
  MailOutlineRounded,
  ModeEditOutlineOutlined,
  PersonOutlineOutlined,
  Telegram,
  ThumbDown,
  ThumbUp,
  Twitter,
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Avatar,
  Button,
  Link as MuiLink,
  Skeleton,
  Stack,
  Tab,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { default as BioClass } from 'classes/Bio';
import Forecast, { FORECAST_TYPE } from 'classes/Forecast';
import Trader from 'classes/Trader';
import BioEdidDialog from 'components/bio/BioEditDialog';
import ForecastList from 'components/forecast/ForecastList';
import ForecastPostDialog from 'components/forecast/ForecastPostDialog';
import ForecastVerifyDialog from 'components/forecast/ForecastVerifyDialog';
import Layout from 'components/layout/Layout';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import useBio from 'hooks/useBio';
import useError from 'hooks/useError';
import useForecast from 'hooks/useForecast';
import useIpfs from 'hooks/useIpfs';
import useTrader from 'hooks/useTrader';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * Trader page.
 */
export default function TraderPage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout>
      <Bio traderId={slug as string} />
      <ForecastsTabs traderId={slug as string} sx={{ mt: 4 }} />
    </Layout>
  );
}

function Bio(props: { traderId: string; sx?: any }) {
  const { account } = useContext(Web3Context);
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { handleError } = useError();
  const { ipfsUrlToHttpUrl } = useIpfs();
  const { getTrader } = useTrader();
  const { getBio } = useBio();
  const [trader, setTrader] = useState<Trader | null>(null);
  const [bio, setBio] = useState<BioClass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAccountOwner =
    account?.toLowerCase() === props.traderId?.toLowerCase();

  async function loadData() {
    try {
      setIsLoading(true);
      setTrader(await getTrader(props.traderId));
      setBio(await getBio(props.traderId));
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setTrader(null);
    setBio(null);
    if (props.traderId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.traderId]);

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={320} height={28} />
        <Skeleton
          variant="rectangular"
          width={240}
          height={28}
          sx={{ mt: 1 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {/* Left part */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Image */}
        <Avatar
          sx={{ bgcolor: '#FFFFFF', width: 164, height: 164, borderRadius: 4 }}
          // src={ipfsUrlToHttpUrl(bio?.uriData?.image)} // TODO: Fix code
        >
          <PersonOutlineOutlined sx={{ fontSize: 42 }} />
        </Avatar>
        {/* Reputation */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography color="success.main">
              <b>{trader?.positiveReputation || 0}</b>
            </Typography>
            <ThumbUp sx={{ color: 'success.main' }} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography color="error.main">
              <b>{trader?.negativeReputation || 0}</b>
            </Typography>
            <ThumbDown sx={{ color: 'error.main' }} />
          </Stack>
        </Stack>
      </Box>
      {/* Righ part */}
      <Box sx={{ ml: 4 }}>
        {/* Name and address */}
        {bio?.uriData?.name ? (
          <>
            <Typography variant="h4">{bio.uriData.name}</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.4 }}>
              {addressToShortAddress(props.traderId)}
            </Typography>
          </>
        ) : (
          <Typography variant="h4">
            {addressToShortAddress(props.traderId)}
          </Typography>
        )}
        {/* Description */}
        {bio?.uriData?.description && (
          <Typography sx={{ mt: 1 }}>{bio.uriData.description}</Typography>
        )}
        {/* Links */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {bio?.uriData?.email && (
            <MuiLink href={`mailto:${bio.uriData.email}`} target="_blank">
              <MailOutlineRounded />
            </MuiLink>
          )}
          {bio?.uriData?.website && (
            <MuiLink href={bio.uriData.website} target="_blank">
              <Language />
            </MuiLink>
          )}
          {bio?.uriData?.twitter && (
            <MuiLink
              href={`https://twitter.com/${bio.uriData.twitter}`}
              target="_blank"
            >
              <Twitter />
            </MuiLink>
          )}
          {bio?.uriData?.telegram && (
            <MuiLink
              href={`https://t.me/${bio.uriData.telegram}`}
              target="_blank"
            >
              <Telegram />
            </MuiLink>
          )}
        </Stack>
        {/* Owner actions */}
        {isAccountOwner && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* Edit bio button */}
            <Button
              startIcon={<ModeEditOutlineOutlined />}
              variant="outlined"
              onClick={() =>
                showDialog?.(
                  <BioEdidDialog data={bio?.uriData} onClose={closeDialog} />,
                )
              }
            >
              Edit Bio
            </Button>
          </Stack>
        )}
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

/**
 * Define localized texts before rendering the page.
 *
 * TODO: Fix vercel error - https://vercel.com/docs/error/application/FUNCTION_INVOCATION_TIMEOUT
 */
// export async function getServerSideProps({ locale }: any) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//     },
//   };
// }
