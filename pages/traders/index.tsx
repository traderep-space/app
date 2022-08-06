import { Divider, Typography } from '@mui/material';
import Trader from 'classes/Trader';
import Layout from 'components/layout/Layout';
import TraderList from 'components/trader/TraderList';
import useError from 'hooks/useError';
import useTrader from 'hooks/useTrader';
import { useEffect, useState } from 'react';

/**
 * Traders page.
 */
export default function TradersPage() {
  const { handleError } = useError();
  const { getTraders } = useTrader();
  const [traders, setTraders] = useState<Array<Trader> | null>(null);

  useEffect(() => {
    getTraders()
      .then((traders) => setTraders(traders))
      .catch((error: any) => handleError(error, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Typography variant="h4">Traders</Typography>
      <Divider sx={{ mt: 2 }} />
      <TraderList traders={traders} sx={{ mt: 2 }} />
    </Layout>
  );
}
