import {
  GroupOutlined,
  HandshakeOutlined,
  LocalActivityOutlined,
  LoyaltyOutlined,
  RocketOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useState } from 'react';

/**
 * Dialog to learn about the club.
 */
export default function AboutClubDialog(props: {
  isClose?: boolean;
  onClose?: Function;
}) {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(!props.isClose);

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  function Feature({ title, subtitle, icon }: any) {
    return (
      <Stack direction="row" spacing={2}>
        <Avatar
          sx={{
            bgcolor: '#FFFFFF',
            color: 'primary.main',
            width: 48,
            height: 48,
            mt: 0.7,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography>{title}</Typography>
          <Typography color="text.secondary">{subtitle}</Typography>
        </Box>
      </Stack>
    );
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="h6">{t('dialog-about-club-title')}</Typography>
        <Box sx={{ mt: 2 }}>
          <Image
            src="/images/early-adopter-3d-card.gif"
            layout="responsive"
            loading="lazy"
            width={600}
            height={338}
            alt="Early Adopter 3D Card"
            style={{ borderRadius: '16px' }}
          />
        </Box>
        <Stack sx={{ mt: 3 }} spacing={3}>
          <Feature
            title={t('dialog-about-feature-1-title')}
            subtitle={t('dialog-about-feature-1-subtitle')}
            icon={<LocalActivityOutlined />}
          />
          <Feature
            title={t('dialog-about-feature-2-title')}
            subtitle={t('dialog-about-feature-2-subtitle')}
            icon={<GroupOutlined />}
          />
          <Feature
            title={t('dialog-about-feature-3-title')}
            subtitle={t('dialog-about-feature-3-subtitle')}
            icon={<LoyaltyOutlined />}
          />
          <Feature
            title={t('dialog-about-feature-4-title')}
            subtitle={t('dialog-about-feature-4-subtitle')}
            icon={<HandshakeOutlined />}
          />
          <Feature
            title={t('dialog-about-feature-5-title')}
            subtitle={t('dialog-about-feature-5-subtitle')}
            icon={<RocketOutlined />}
          />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => props.onClose?.()}>
            {t('button-close')}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
