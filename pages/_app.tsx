import { ThemeProvider } from '@mui/material';
import { DialogProvider } from 'context/dialog';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { theme } from 'theme';
import { handlePageViewEvent, initAnalytics } from 'utils/analytics';
import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  /**
   * Init analytics
   */
  useEffect(() => {
    initAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Send page view event to analytics if page changed via router
   */
  useEffect(() => {
    const handleRouteChange = function () {
      handlePageViewEvent();
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <DialogProvider>
          <Component {...pageProps} />
        </DialogProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

// export default App;
export default appWithTranslation(App);
