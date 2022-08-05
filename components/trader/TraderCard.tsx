import {
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { addressToShortAddress } from 'utils/converters';

/**
 * A component with a card with trader.
 */
export default function TraderCard({ trader }: any) {
  if (trader) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: '10px !important' }}>
          <Stack direction="row" spacing={1}>
            <Typography>Trader:</Typography>
            <Link href={`/traders/${trader.id}`} passHref>
              <MuiLink underline="none">
                <Typography>{addressToShortAddress(trader.id)}</Typography>
              </MuiLink>
            </Link>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Typography>Reputation:</Typography>
            <Typography sx={{ mt: 1 }} color="success.main">
              +{trader.positiveReputation}
            </Typography>
            <Typography sx={{ mt: 1 }} color="error.main">
              -{trader.negativeReputation}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }
  return <></>;
}
