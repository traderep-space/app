import { useTranslation } from 'next-i18next';
import { Html, Head, Main, NextScript } from 'next/document';

function Document() {
  const { t } = useTranslation('common');

  return (
    <Html>
      <Head>
        <meta name="description" content={t('app-description')} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
