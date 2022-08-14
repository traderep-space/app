import { Grid, Typography } from '@mui/material';
import ForecastCard from './ForecastCard';

/**
 * A component with a list of forecasts.
 */
export default function ForecastList({ forecasts, sx }: any) {
  return (
    <Grid container spacing={2} sx={{ ...sx }}>
      {!forecasts && (
        <Grid item xs={12}>
          <Typography>Loading...</Typography>
        </Grid>
      )}
      {forecasts?.length === 0 && (
        <Grid item xs={12}>
          <Typography>No Forecasts</Typography>
        </Grid>
      )}
      {forecasts?.length > 0 && (
        <>
          {forecasts.map((forecast: any, index: number) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <ForecastCard forecast={forecast} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}
