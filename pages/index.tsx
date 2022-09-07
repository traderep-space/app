import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import { Web3Context } from 'context/web3';
import { useContext } from 'react';

/**
 * Home page.
 */
export default function HomePage() {
  const { account, connectWallet } = useContext(Web3Context);

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
            Application is available only for members of the private club EARLY
            ADOPTERS.
          </Typography>
        </Box>
      )}
    </Layout>
  );
}
