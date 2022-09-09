import { ContentCopy } from '@mui/icons-material';
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
import { useContext, useEffect, useState } from 'react';

/**
 * Home page.
 */
export default function HomePage() {
  const { account, connectWallet } = useContext(Web3Context);
  const { accountEarlyAdopterToken } = useContext(DataContext);
  const { showDialog, closeDialog } = useContext(DialogContext);
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
        <Box>
          <Typography sx={{ mb: 1.5 }}>
            Connect a wallet to access the TradeRep application.
          </Typography>
          <Button variant="contained" onClick={() => connectWallet?.()}>
            Connect wallet
          </Button>
        </Box>
      )}
      {/* If account connected, but doesn't have early adopter token */}
      {account && !accountEarlyAdopterToken && (
        <Box>
          <Typography sx={{ mb: 1.5 }}>
            TradeRep Application is available only for members of the private
            club EARLY ADOPTERS.
          </Typography>
          <Typography sx={{ mb: 4 }}>
            To join the club and start earning a reputation before anyone else,
            you need to fill out the form.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() =>
                showDialog?.(<JoinClubDialog onClose={closeDialog} />)
              }
            >
              Fill out the form
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                showDialog?.(<AboutClubDialog onClose={closeDialog} />)
              }
            >
              Learn about the club
            </Button>
          </Stack>
        </Box>
      )}
      {/* If account connected and has early adopter token */}
      {account && accountEarlyAdopterToken && (
        <Box>
          <Typography sx={{ mb: 1.5 }}>
            You are a member #{accountEarlyAdopterToken.id} of the private club
            EARLY ADOPTERS.
          </Typography>
          {accountEarlyAdopterTokenVideo && (
            <CardMedia
              component="video"
              src={accountEarlyAdopterTokenVideo}
              loop
              autoPlay
              sx={{
                width: { xs: 1, md: 1 / 2 },
                borderRadius: '16px',
                mt: 4,
                mb: 4,
              }}
            />
          )}
          <Typography sx={{ mb: 1.5 }}>
            Features will be available to you very soon.
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            We will write to you when that happens.
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            In the meantime, you can invite your three friends.
          </Typography>
          <InvitationLink account={account} sx={{ mt: 1.5 }} />
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
            aria-label="toggle password visibility"
            onClick={() => {
              navigator.clipboard.writeText(link);
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
      sx={{ width: 1, ...props.sx }}
    />
  );
}
