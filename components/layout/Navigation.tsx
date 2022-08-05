import { AccountCircleRounded } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Web3Context } from 'context/web3';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { MouseEvent, useContext, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';

/**
 * Component with navigation.
 */
export default function Navigation() {
  const { account, connectWallet } = useContext(Web3Context);
  const { t } = useTranslation('common');

  return (
    <AppBar
      color="inherit"
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {t('app-title')}
          </Typography>
          {/* Mobile logo */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {t('app-title')}
          </Typography>
          {/* Connect wallet button */}
          {!account && (
            <Button
              variant="contained"
              onClick={() => {
                connectWallet?.();
              }}
            >
              Connect Wallet
            </Button>
          )}
          {/* Setting menu */}
          {account && <AccountMenu />}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function AccountMenu(): JSX.Element {
  const { account, disconnectWallet } = useContext(Web3Context);
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
        {/* Trader link */}
        <Link href={`/traders/${account}`}>
          <MenuItem onClick={handleCloseAccountMenu}>
            <Typography>Trader ({addressToShortAddress(account)})</Typography>
          </MenuItem>
        </Link>
        {/* Disconnect wallet button */}
        <Box
          sx={{
            pt: '12px',
            pb: '6px',
            px: '16px',
            display: 'flex',
          }}
        >
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            size="small"
            onClick={() => disconnectWallet?.()}
          >
            Disconnect Wallet
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}
