import { Button, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import {
  PAGE_HOME_OVERTITLE,
  PAGE_HOME_SUBTITLE,
  PAGE_HOME_TITLE,
} from 'constants/texts';
import { Web3Context } from 'context/web3';
import BlockchainIcon from 'icons/BlockchainIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

/**
 * Home page.
 */
export default function HomePage() {
  const { account, connectWallet } = useContext(Web3Context);

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
          alignItems: { md: 'center' },
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
              <Typography color="primary">{PAGE_HOME_OVERTITLE}</Typography>
            </Stack>
          </MuiLink>
          {/* Title */}
          <Typography variant="h3" sx={{ mt: { xs: 2, md: 0 } }}>
            {PAGE_HOME_TITLE}
          </Typography>
          {/* Subtitle */}
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1.5 }}>
            {PAGE_HOME_SUBTITLE}
          </Typography>
          {/* Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            {account ? (
              <Link href="/traders">
                <Button variant="contained" sx={{ px: 5, py: 1.5 }}>
                  Browse traders
                </Button>
              </Link>
            ) : (
              <Button
                variant="contained"
                sx={{ px: 5, py: 1.5 }}
                onClick={() => connectWallet?.()}
              >
                Connect Wallet
              </Button>
            )}
          </Box>
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
    </Layout>
  );
}
