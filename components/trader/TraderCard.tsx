import {
  Avatar,
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
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
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                bgcolor: '#FFFFFF',
                width: 54,
                height: 54,
                fontSize: 38,
                mr: 1.2,
              }}
            >
              🧑‍💼
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1}>
                <Typography>Trader</Typography>
                <Link href={`/traders/${trader.id}`} passHref>
                  <MuiLink underline="none">
                    <Typography>{addressToShortAddress(trader.id)}</Typography>
                  </MuiLink>
                </Link>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 0.4 }}>
                <Typography color="success.main">
                  <b>👍{trader.positiveReputation}</b>
                </Typography>
                <Typography color="error.main">
                  <b>👎{trader.negativeReputation}</b>
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }
  return <></>;
}
