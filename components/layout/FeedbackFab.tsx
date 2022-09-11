import { Fab } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

/**
 * A component with a feedback floating action button.
 */
export default function FeedbackFab() {
  const { t } = useTranslation('common');

  return (
    <Link href="/feedback">
      <Fab
        color="primary"
        variant="extended"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          textTransform: 'initial',
        }}
      >
        {t('button-feedback')}
      </Fab>
    </Link>
  );
}
