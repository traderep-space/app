import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';

/**
 * Component with footer.
 */
export default function Footer() {
  return (
    <Box>
      <Divider />
      <Typography
        color="text.secondary"
        variant="body2"
        sx={{ my: { xs: 8, md: 4 }, textAlign: 'center' }}
      >
        TradeRep Metabolism — Trader reputation confirmed by blockchain © 2022
      </Typography>
    </Box>
  );
}
