import { Card, CardContent, Typography } from '@mui/material';
import { addressToShortAddress } from 'utils/converters';

/**
 * A component with a card with forecast.
 */
export default function ForecastCard({ forecast }: any) {
  if (forecast) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: '10px !important' }}>
          <Typography>ID: {forecast.id}</Typography>
          <Typography>
            Author: {addressToShortAddress(forecast.author)}
          </Typography>
          <Typography>
            Owner: {addressToShortAddress(forecast.owner)}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return <></>;
}
