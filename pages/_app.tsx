import { ThemeProvider } from '@mui/material';
import { DataProvider } from 'context/data';
import { DialogProvider } from 'context/dialog';
import { Web3Provider } from 'context/web3';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { theme } from 'theme';
import { handlePageViewEvent, initAnalytics } from 'utils/analytics';
import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';

const LitJsSdk = require('lit-js-sdk');

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  /**
   * Init Lit protocol.
   */
  async function initLitProtocol() {
    // Init client
    const client = new LitJsSdk.LitNodeClient({ debug: false });
    await client.connect();
    (window as any).litNodeClient = client;
    // Listen when Lit protocol is ready
    document.addEventListener(
      'lit-ready',
      function () {
        console.log('Lit protocol is ready');
      },
      false,
    );
  }

  /**
   * Init analytics.
   */
  useEffect(() => {
    initAnalytics();
    initLitProtocol();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Send page view event to analytics if page changed via router.
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
        <Web3Provider>
          <DataProvider>
            <DialogProvider>
              <NextNProgress height={4} />
              <Component {...pageProps} />
            </DialogProvider>
          </DataProvider>
        </Web3Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
