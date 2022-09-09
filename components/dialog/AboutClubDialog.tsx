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
import Image from 'next/image';
import { useState } from 'react';

/**
 * Dialog to learn about the club.
 */
export default function AboutClubDialog(props: {
  isClose?: boolean;
  onClose?: Function;
}) {
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
        <Typography variant="h6">Private club EARLY ADOPTERS</Typography>
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
            title="Unique NFT"
            subtitle="Each member of a private club receives an NFT with a unique number."
            icon={<LocalActivityOutlined />}
          />
          <Feature
            title="Limited number of participants"
            subtitle="Only 142 lucky people will be able to join the private club EARLY ADOPTERS."
            icon={<GroupOutlined />}
          />
          <Feature
            title="Special badge"
            subtitle="Members of the private club get a special badge that helps them stand out among the other traders."
            icon={<LoyaltyOutlined />}
          />
          <Feature
            title="Recognition"
            subtitle="As a club member, you recognize that your reputation as a trader is not just empty words to you."
            icon={<HandshakeOutlined />}
          />
          <Feature
            title="Extra benefits"
            subtitle="Which will be revealed as the project progresses to all members of the private club EARLY ADOPTERS."
            icon={<RocketOutlined />}
          />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => props.onClose?.()}>
            Close
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
