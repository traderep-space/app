import { Container, Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { PAGE_TITLE_DEFAULT } from 'constants/texts';
import Head from 'next/head';
import FeedbackFab from './FeedbackFab';
import Footer from './Footer';
import Navigation from './Navigation';

/**
 * Component with layout.
 */
export default function Layout({ children }: any) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Head>
        <title>{PAGE_TITLE_DEFAULT}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Navigation />
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100%',
        }}
      >
        <Box sx={{ py: 4 }}>
          <Toolbar />
          {children}
        </Box>
        <FeedbackFab />
        <Footer />
      </Container>
    </Box>
  );
}
