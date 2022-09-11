import { PersonOutlineOutlined, ThumbDown, ThumbUp } from '@mui/icons-material';
import {
  Avatar,
  Card,
  CardContent,
  Link as MuiLink,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import Bio from 'classes/Bio';
import Trader from 'classes/Trader';
import useBio from 'hooks/useBio';
import useError from 'hooks/useError';
import useIpfs from 'hooks/useIpfs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { addressToShortAddress } from 'utils/converters';

/**
 * A component with a card with trader.
 */
export default function TraderCard(props: { trader: Trader }) {
  const { handleError } = useError();
  const { ipfsUrlToHttpUrl } = useIpfs();
  const { getBio } = useBio();
  const [bio, setBio] = useState<Bio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBio(null);
    if (props.trader) {
      setIsLoading(true);
      getBio(props.trader.id)
        .then((bio) => setBio(bio))
        .catch((error: any) => handleError(error, true))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.trader]);

  if (props.trader) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: '16px !important' }}>
          {isLoading ? (
            <>
              <Skeleton variant="rectangular" width={320} height={28} />
              <Skeleton
                variant="rectangular"
                width={240}
                height={28}
                sx={{ mt: 1 }}
              />
            </>
          ) : (
            <Stack direction="row" spacing={2}>
              {/* Left part */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Image */}
                <Avatar
                  sx={{
                    bgcolor: '#FFFFFF',
                    width: 94,
                    height: 94,
                    borderRadius: 2,
                  }}
                  // src={ipfsUrlToHttpUrl(bio?.uriData?.image)} // TODO: Fix code
                >
                  <PersonOutlineOutlined sx={{ fontSize: 42 }} />
                </Avatar>
                {/* Reputation */}
                <Stack
                  direction="row"
                  spacing={1.6}
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography color="success.main" variant="body2">
                      <b>{props.trader?.positiveReputation || 0}</b>
                    </Typography>
                    <ThumbUp sx={{ color: 'success.main', fontSize: 18 }} />
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography color="error.main" variant="body2">
                      <b>{props.trader?.negativeReputation || 0}</b>
                    </Typography>
                    <ThumbDown sx={{ color: 'error.main', fontSize: 18 }} />
                  </Stack>
                </Stack>
              </Box>
              {/* Right part */}
              <Box>
                {/* Address */}
                <Link href={`/traders/${props.trader.id}`} passHref>
                  <MuiLink underline="none">
                    <Typography>
                      {addressToShortAddress(props.trader.id)}
                    </Typography>
                  </MuiLink>
                </Link>
                {/* Name */}
                {bio?.uriData?.name && (
                  <Typography variant="h6">{bio.uriData.name}</Typography>
                )}
                {/* Description */}
                {bio?.uriData?.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.4 }}
                  >
                    {bio.uriData.description}
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  }
  return <></>;
}
