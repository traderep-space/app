import {
  AccountBalanceWallet,
  ContentCopy,
  Edit,
  PeopleAlt,
} from '@mui/icons-material';
import {
  Button,
  CardMedia,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import AboutClubDialog from 'components/dialog/AboutClubDialog';
import JoinClubDialog from 'components/dialog/JoinClubDialog';
import Layout from 'components/layout/Layout';
import { DataContext } from 'context/data';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import { ethers } from 'ethers';
import useEarlyAdopterToken from 'hooks/useEarlyAdopterToken';
import useError from 'hooks/useError';
import useIpfs from 'hooks/useIpfs';
import useToast from 'hooks/useToast';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext, useEffect, useState } from 'react';
import { handleCopyInvitationLinkEvent } from 'utils/analytics';

/**
 * Beta page.
 */
export default function BetaPage() {
  const { account, connectWallet } = useContext(Web3Context);
  const { accountEarlyAdopterToken } = useContext(DataContext);
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { t } = useTranslation('common');
  const { handleError } = useError();
  const { ipfsUrlToHttpUrl } = useIpfs();
  const { getEarlyAdopterTokenUriData } = useEarlyAdopterToken();
  const [accountEarlyAdopterTokenVideo, setAccountEarlyAdopterTokenVideo] =
    useState<string | null>(null);

  /**
   * Load video for account's early adopter token.
   */
  useEffect(() => {
    setAccountEarlyAdopterTokenVideo(null);
    if (accountEarlyAdopterToken) {
      getEarlyAdopterTokenUriData(accountEarlyAdopterToken.id)
        .then((uriData) =>
          setAccountEarlyAdopterTokenVideo(ipfsUrlToHttpUrl(uriData?.image)),
        )
        .catch((error: any) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountEarlyAdopterToken]);

  return (
    <Layout>
      {/* If account not connected */}
      {!account && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ mb: 2 }}>
            {t('page-home-connect-wallet')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AccountBalanceWallet />}
            onClick={() => connectWallet?.()}
          >
            {t('button-connect-wallet')}
          </Button>
        </Box>
      )}
      {/* If account connected, but doesn't have early adopter token */}
      {account && !accountEarlyAdopterToken && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            {t('page-home-join-club-1')}
          </Typography>
          <Typography sx={{ mb: 4 }}>{t('page-home-join-club-2')}</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Edit />}
              onClick={() =>
                showDialog?.(<JoinClubDialog onClose={closeDialog} />)
              }
            >
              {t('button-fill-form')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PeopleAlt />}
              onClick={() =>
                showDialog?.(<AboutClubDialog onClose={closeDialog} />)
              }
            >
              {t('button-learn-club')}
            </Button>
          </Stack>
        </Box>
      )}
      {/* If account connected and has early adopter token */}
      {account && accountEarlyAdopterToken && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Welcome to the private club EARLY ADOPTER!
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            You are {accountEarlyAdopterToken.id} of 142 members.
          </Typography>
          {accountEarlyAdopterTokenVideo && (
            <CardMedia
              component="video"
              src={accountEarlyAdopterTokenVideo}
              loop
              autoPlay
              muted
              controls
              sx={{
                width: { xs: 1, md: 1 / 2 },
                borderRadius: '16px',
                mt: 1,
                mb: 4,
              }}
            />
          )}
          <Typography sx={{ mb: 1.5 }}>
            TradeRep application will be available to you soon. We&apos;ll send
            an email when it happens.
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            For now, you can invite 3 of your friends.
          </Typography>
          <InvitationLink
            account={account}
            sx={{ width: { xs: 1, md: 1 / 2 }, mt: 1.5 }}
          />
        </Box>
      )}
    </Layout>
  );
}

function InvitationLink(props: { account: string; sx?: any }) {
  const { showToastSuccess } = useToast();

  const link =
    window.location.origin +
    '/invitations/' +
    ethers.utils
      .keccak256(ethers.utils.toUtf8Bytes(props.account))
      .slice(2, 12)
      .toUpperCase();

  return (
    <OutlinedInput
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="copy invitation link"
            onClick={() => {
              navigator.clipboard.writeText(link);
              handleCopyInvitationLinkEvent(link);
              showToastSuccess('Link copied');
            }}
            edge="end"
          >
            <ContentCopy />
          </IconButton>
        </InputAdornment>
      }
      disabled
      value={link}
      sx={{ ...props.sx }}
    />
  );
}

/**
 * Define localized texts at build time.
 */
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
