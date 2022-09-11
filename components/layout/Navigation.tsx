import {
  AccountBalanceWallet,
  AccountCircleRounded,
  Language,
} from '@mui/icons-material';
import {
  AppBar,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import ProjectIcon from 'icons/ProjectIcon';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { MouseEvent, useContext, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';

/**
 * Component with navigation.
 */
export default function Navigation() {
  const { t } = useTranslation('common');

  return (
    <AppBar
      color="inherit"
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
            <ProjectIcon sx={{ fontSize: 32 }} />
            <Link href="/" passHref>
              <Typography
                variant="h6"
                component="a"
                sx={{
                  ml: 1,
                  mr: 1,
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {t('app-title')}
              </Typography>
            </Link>
            <Typography color="text.secondary" variant="body2">
              {t('app-subtitle')}
            </Typography>
          </Box>
          {/* Language menu */}
          <LanguageMenu />
          {/* Account menu */}
          <AccountMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function AccountMenu(): JSX.Element {
  const { account, connectWallet, disconnectWallet } = useContext(Web3Context);
  const { t } = useTranslation('common');
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  function handleOpenAccountMenu(event: MouseEvent<HTMLElement>) {
    setAnchorElUser(event.currentTarget);
  }
  function handleCloseAccountMenu() {
    setAnchorElUser(null);
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton size="large" onClick={handleOpenAccountMenu}>
        <AccountCircleRounded />
      </IconButton>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseAccountMenu}
      >
        {/* Link to home page */}
        <Link href="/">
          <MenuItem onClick={handleCloseAccountMenu}>
            {t('navigation-about-item')}
          </MenuItem>
        </Link>
        {/* Link to feedback page */}
        <Link href="/feedback">
          <MenuItem onClick={handleCloseAccountMenu}>
            {t('navigation-feedback-item')}
          </MenuItem>
        </Link>
        <Divider />
        {/* Connect or disconnect wallet button */}
        <Box
          sx={{
            pt: '6px',
            pb: '6px',
            px: '16px',
            display: 'flex',
          }}
        >
          {account ? (
            <Box>
              <Button
                sx={{ flex: 1 }}
                variant="contained"
                onClick={() => disconnectWallet?.()}
              >
                {t('button-disconnect-wallet')}
              </Button>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 1.5 }}
              >
                <AccountBalanceWallet
                  sx={{ color: 'text.secondary', fontSize: 18 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {addressToShortAddress(account)}
                </Typography>
              </Stack>
            </Box>
          ) : (
            <Button
              sx={{ flex: 1 }}
              variant="contained"
              onClick={() => {
                handleCloseAccountMenu();
                connectWallet?.();
              }}
            >
              {t('button-connect-wallet')}
            </Button>
          )}
        </Box>
      </Menu>
    </Box>
  );
}

function LanguageMenu() {
  const { t } = useTranslation('common');
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  function handleOpenLanguageMenu(event: MouseEvent<HTMLElement>) {
    setAnchorElUser(event.currentTarget);
  }
  function handleCloseLanguageMenu() {
    setAnchorElUser(null);
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton size="large" onClick={handleOpenLanguageMenu}>
        <Language />
      </IconButton>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseLanguageMenu}
      >
        <Link href="/" passHref locale="en">
          <MenuItem onClick={handleCloseLanguageMenu}>
            {t('text-english')}
          </MenuItem>
        </Link>
        <Link href="/" passHref locale="ru">
          <MenuItem onClick={handleCloseLanguageMenu}>
            {t('text-russian')}
          </MenuItem>
        </Link>
      </Menu>
    </Box>
  );
}
