import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FOOTER_DEFAULT } from 'constants/texts';

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
        {FOOTER_DEFAULT}
      </Typography>
    </Box>
  );
}
