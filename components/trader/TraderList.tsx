import { Grid, Typography } from '@mui/material';
import Trader from 'classes/Trader';
import TraderCard from './TraderCard';

/**
 * A component with a list of traders.
 */
export default function TraderList(props: {
  traders: Array<Trader> | null;
  sx: any;
}) {
  return (
    <Grid container spacing={2} sx={{ ...props.sx }}>
      {!props.traders && (
        <Grid item xs={12}>
          <Typography>Loading...</Typography>
        </Grid>
      )}
      {props.traders && props.traders.length === 0 && (
        <Grid item xs={12}>
          <Typography>No Results</Typography>
        </Grid>
      )}
      {props.traders && props.traders.length > 0 && (
        <>
          {props.traders.map((trader: any, index: number) => (
            <Grid key={index} item xs={12} sm={6}>
              <TraderCard trader={trader} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}
