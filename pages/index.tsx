import { VerifiedOutlined, VpnLock } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import BlockchainIcon from 'icons/BlockchainIcon';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';

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
          {/* Button */}
          <Link href="/beta">
            <Button
              variant="contained"
              sx={{ mt: { xs: 4, md: 3 }, px: 5, py: 1.5 }}
            >
              {t('button-start')}
            </Button>
          </Link>
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

  function Advantages() {
    function Advantage({ title, subtitle, icon }: any) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#FFFFFF',
              color: 'primary.main',
              width: 60,
              height: 60,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h5" sx={{ mt: 1 }}>
            {title}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ px: { xs: 0, md: 8 }, mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={6} sx={{ mt: { xs: 4, md: 9 } }}>
        <Grid item xs={12} md={6}>
          <Advantage
            title={t('page-home-advantage-1-title')}
            subtitle={t('page-home-advantage-1-subtitle')}
            icon={<VpnLock sx={{ fontSize: 28 }} />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Advantage
            title={t('page-home-advantage-2-title')}
            subtitle={t('page-home-advantage-2-subtitle')}
            icon={<VerifiedOutlined sx={{ fontSize: 28 }} />}
          />
        </Grid>
      </Grid>
    );
  }

  function HowItWorks() {
    function Row({ title, subtitle, image, sx }: any) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', md: 'row-reverse' },
            mt: 8,
            alignItems: { xs: 'none', md: 'center' },
            ...sx,
          }}
        >
          {/* Text */}
          <Box sx={{ flex: 1, textAlign: 'center', mt: { xs: 1, md: 0 } }}>
            <Typography variant="h6" sx={{ px: { xs: 0, md: 4 } }}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ px: { xs: 0, md: 12 }, mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          </Box>
          {/* Image */}
          <Box sx={{ flex: 1 }}>
            <Image
              src={image}
              layout="responsive"
              priority={true}
              width={1080}
              height={540}
              alt="How it works"
            />
          </Box>
        </Box>
      );
    }

    return (
      <Box id="how-it-works" sx={{ mt: 12 }}>
        {/* Title and subtitle */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4">
            {t('page-home-how-it-works-title')}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {t('page-home-how-it-works-subtitle')}
          </Typography>
        </Box>
        {/* Rows */}
        <Row
          title={t('page-home-how-it-works-row-1-title')}
          subtitle={t('page-home-how-it-works-row-1-subtitle')}
          image="/images/image-how-it-works-1.png"
        />
        <Row
          title={t('page-home-how-it-works-row-2-title')}
          subtitle={t('page-home-how-it-works-row-2-subtitle')}
          image="/images/image-how-it-works-2.png"
          sx={{ flexDirection: { xs: 'column-reverse', md: 'row' } }}
        />
        <Row
          title={t('page-home-how-it-works-row-3-title')}
          subtitle={t('page-home-how-it-works-row-3-subtitle')}
          image="/images/image-how-it-works-3.png"
        />
        {/* Button to become a user */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Link href="/beta">
            <Button variant="contained" sx={{ px: 5, py: 1.5 }}>
              {t('button-start-earn-reputation')}
            </Button>
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Layout>
      <Header />
      <Advantages />
      <Divider sx={{ mt: 12 }} />
      <HowItWorks />
      <Box sx={{ height: 48 }} />
    </Layout>
  );
}

/**
 * Define localized texts at build time.
 */
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
