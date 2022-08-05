import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import useError from 'hooks/useError';
import useToast from 'hooks/useToast';
import useZora from 'hooks/useZora';
import { JSONSchema7 } from 'json-schema';
import { useState } from 'react';

/**
 * A dialog for create ask for forecast.
 */
export default function ForecastCreateAskDialog({
  forecastId,
  isClose,
  onClose,
}: any) {
  const { showToastSuccess } = useToast();
  const { handleError } = useError();
  const { createAsk } = useZora();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);
  const [formData, setFormData] = useState({});

  const schema: JSONSchema7 = {
    type: 'object',
    required: ['price'],
    properties: {
      price: {
        type: 'string',
        title: `Price (${process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL})`,
      },
    },
  };

  const uiSchema = {
    price: {
      'ui:placeholder': '0.01',
    },
  };

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  async function submit({ formData }: any) {
    try {
      setFormData(formData);
      setIsLoading(true);
      await createAsk(
        process.env.NEXT_PUBLIC_FORECAST_CONTRACT_ADDRESS || '',
        forecastId,
        formData.price,
      );
      showToastSuccess('Success! Data will be updated soon');
      close();
    } catch (error: any) {
      handleError(error, true);
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? () => {} : close}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 0 }}>Sell Forecast #{forecastId}</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          onSubmit={submit}
          disabled={isLoading}
        >
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {isLoading ? (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<Save />}
                variant="outlined"
              >
                Processing
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  Sell
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
