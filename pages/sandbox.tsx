import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * Sandbox page.
 */
export default function Sandbox() {
  return (
    <Layout>
      <Typography variant="h4">Sandbox</Typography>
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ mt: 2 }}>
        <Typography>...</Typography>
      </Box>
    </Layout>
  );
}

/**
 * Define localized texts at build time.
 */
export async function getStaticProps({ locale, nextI18NextConfig }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], nextI18NextConfig)),
    },
  };
}
