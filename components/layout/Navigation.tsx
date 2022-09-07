import { AccountCircleRounded } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Menu,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Web3Context } from 'context/web3';
import ProjectIcon from 'icons/ProjectIcon';
import { MouseEvent, useContext, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';

/**
 * Component with navigation.
 */
export default function Navigation() {
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
            <ProjectIcon sx={{ fontSize: 38 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                ml: 1,
                mr: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              TradeRep App
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Beta
            </Typography>
          </Box>
          {/* Account menu */}
          <AccountMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function AccountMenu(): JSX.Element {
  const { account, connectWallet, disconnectWallet } = useContext(Web3Context);
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
        {/* Account address */}
        {account && (
          <Box sx={{ px: '16px', py: '6px' }}>
            <Stack direction="column" spacing={0}>
              <Typography>Account</Typography>
              <Typography color="text.secondary" variant="body2">
                {addressToShortAddress(account)}
              </Typography>
            </Stack>
          </Box>
        )}
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
            <Button
              sx={{ flex: 1 }}
              variant="contained"
              size="small"
              onClick={() => disconnectWallet?.()}
            >
              Disconnect Wallet
            </Button>
          ) : (
            <Button
              sx={{ flex: 1 }}
              variant="contained"
              size="small"
              onClick={() => connectWallet?.()}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Menu>
    </Box>
  );
}
