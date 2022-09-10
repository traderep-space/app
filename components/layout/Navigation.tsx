import { AccountCircleRounded } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import AboutClubDialog from 'components/dialog/AboutClubDialog';
import { DialogContext } from 'context/dialog';
import { Web3Context } from 'context/web3';
import ProjectIcon from 'icons/ProjectIcon';
import Link from 'next/link';
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
            <ProjectIcon sx={{ fontSize: 32 }} />
            <Typography
              variant="h6"
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
  const { showDialog, closeDialog } = useContext(DialogContext);
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
          <Link href="/">
            <MenuItem onClick={handleCloseAccountMenu}>
              <Stack direction="column" spacing={0}>
                <Typography>Account</Typography>
                <Typography color="text.secondary" variant="body2">
                  {addressToShortAddress(account)}
                </Typography>
              </Stack>
            </MenuItem>
          </Link>
        )}
        {/* Link to landing page */}
        <MenuItem
          onClick={handleCloseAccountMenu}
          component="a"
          href="https://traderep.space/"
          target="_blank"
        >
          About project
        </MenuItem>
        {/* Information about private club */}
        <MenuItem
          onClick={() => {
            handleCloseAccountMenu();
            showDialog?.(<AboutClubDialog onClose={closeDialog} />);
          }}
        >
          About club
        </MenuItem>
        {/* Link to feedback page */}
        <Link href="/feedback">
          <MenuItem onClick={handleCloseAccountMenu}>Feedback</MenuItem>
        </Link>
        {/* Connect or disconnect wallet button */}
        <Box
          sx={{
            pt: '16px',
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
