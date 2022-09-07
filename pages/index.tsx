import { Button, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import AboutClubDialog from 'components/dialog/AboutClubDialog';
import JoinClubDialog from 'components/dialog/JoinClubDialog';
import Layout from 'components/layout/Layout';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import { useContext } from 'react';

/**
 * Home page.
 */
export default function HomePage() {
  const { account, connectWallet } = useContext(Web3Context);
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <Layout>
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
      {account && (
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
    </Layout>
  );
}
