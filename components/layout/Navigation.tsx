import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';

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
        </Toolbar>
      </Container>
    </AppBar>
  );
}
