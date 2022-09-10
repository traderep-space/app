import { Fab } from '@mui/material';
import Link from 'next/link';

/**
 * A component with a feedback floating action button.
 */
export default function FeedbackFab() {
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
        Feedback
      </Fab>
    </Link>
  );
}
