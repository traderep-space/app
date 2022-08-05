import { Grid, Typography } from '@mui/material';
import TraderCard from './TraderCard';

/**
 * A component with a list of traders.
 */
export default function TraderList({ traders, sx }: any) {
  return (
    <Grid container spacing={2} sx={{ ...sx }}>
      {!traders && (
        <Grid item xs={12}>
          <Typography>Loading...</Typography>
        </Grid>
      )}
      {traders?.length === 0 && (
        <Grid item xs={12}>
          <Typography>No Results</Typography>
        </Grid>
      )}
      {traders?.length > 0 && (
        <>
          {traders.map((trader: any, index: number) => (
            <Grid key={index} item xs={12} md={6}>
              <TraderCard trader={trader} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}
