import { Link as MuiLink, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import BlockchainIcon from 'icons/BlockchainIcon';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

/**
 * Home page.
 */
export default function HomePage() {
  const { t } = useTranslation('common');

  function scrollTo(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  function Header() {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          mt: { xs: 0, md: 12 },
        }}
      >
        {/* Text and button */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Overtitle */}
          <MuiLink
            underline="none"
            component="button"
            onClick={() => scrollTo('how-it-works')}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 0, md: 1 }}
              alignItems={{ xs: 'center', md: 'center' }}
            >
              <BlockchainIcon sx={{ fontSize: 36 }} />
              <Typography color="primary">
                {t('page-home-overtitle')}
              </Typography>
            </Stack>
          </MuiLink>
          {/* Title */}
          <Typography variant="h3" sx={{ mt: { xs: 2, md: 0 } }}>
            {t('page-home-title')}
          </Typography>
          {/* Subtitle */}
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1.5 }}>
            {t('page-home-subtitle')}
          </Typography>
        </Box>
        {/* Image */}
        <Box sx={{ flex: 1, mt: { xs: 4, md: 0 } }}>
          <Image
            src="/images/image-header.png"
            layout="responsive"
            priority={true}
            width={1080}
            height={540}
            alt="Reputation of traders"
          />
        </Box>
      </Box>
    );
  }

  return (
    <Layout>
      <Header />
      <Box sx={{ height: 48 }} />
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
