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
          <Typography variant="h4">How does it work?</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Steps that allow to build a trustworthy reputation and filter out
            scammers.
          </Typography>
        </Box>
        {/* Rows */}
        <Row
          title="Send a forecast to the blockchain"
          subtitle="This way the community will be sure that your market analysis has not been tampered with or recorded retroactively."
          image="/images/image-how-it-works-1.png"
        />
        <Row
          title="Get reputation"
          subtitle="A blockchain-based smart contract will verify your forecast. If the market confirms it, your reputation will be raised, otherwise lowered."
          image="/images/image-how-it-works-2.png"
          sx={{ flexDirection: { xs: 'column-reverse', md: 'row' } }}
        />
        <Row
          title="Get to the top."
          subtitle="Together we will determine who understands the market better than anyone else and who is trying to deceive others."
          image="/images/image-how-it-works-3.png"
        />
      </Box>
    );
  }

  return (
    <Layout>
      <Header />
      <HowItWorks />
    </Layout>
  );
}
