import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';

/**
 * Component with footer.
 */
export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <Box>
      <Divider />
      <Typography
        color="text.secondary"
        variant="body2"
        sx={{ my: { xs: 8, md: 4 }, textAlign: 'center' }}
      >
        {t('page-footer-default')}
      </Typography>
    </Box>
  );
}
