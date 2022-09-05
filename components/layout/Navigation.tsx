import {
  AccountCircleRounded,
  AlternateEmail,
  GitHub,
} from '@mui/icons-material';
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Web3Context } from 'context/web3';
import ProjectIcon from 'icons/ProjectIcon';
import Link from 'next/link';
import { MouseEvent, useContext, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';

/**
 * Component with navigation.
 */
export default function Navigation() {
  const { account, connectWallet } = useContext(Web3Context);

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
          <ProjectIcon sx={{ fontSize: 38 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              ml: 0.8,
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TradeRep App
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ flexGrow: 1 }}
          >
            Beta
          </Typography>
          {/* GitHub Link */}
          <MuiLink href="https://github.com/traderep-space" target="_blank">
            <IconButton size="large">
              <GitHub />
            </IconButton>
          </MuiLink>
          {/* Email link */}
          <MuiLink href="mailto:traderep.space@gmail.com" target="_blank">
            <IconButton size="large">
              <AlternateEmail />
            </IconButton>
          </MuiLink>
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
            <Stack direction="column" spacing={0}>
              <Typography>My Page</Typography>
              <Typography color="text.secondary" variant="body2">
                {addressToShortAddress(account)}
              </Typography>
            </Stack>
          </MenuItem>
        </Link>
        {/* Traders link */}
        <Link href="/traders">
          <MenuItem onClick={handleCloseAccountMenu}>
            <Typography>Traders</Typography>
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
