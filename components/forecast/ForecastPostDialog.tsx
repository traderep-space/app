import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import useError from 'hooks/useError';
import useToast from 'hooks/useToast';
import { useState } from 'react';
import { JSONSchema7 } from 'json-schema';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import useForecast from 'hooks/useForecast';

/**
 * A dialog for create forecast.
 */
export default function ForecastPostDialog({ isClose, onClose }: any) {
  const { showToastSuccess } = useToast();
  const { handleError } = useError();
  const { postForecast } = useForecast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);
  const [formData, setFormData] = useState({});

  const schema: JSONSchema7 = {
    type: 'object',
    required: ['symbol', 'orderPrice', 'tpPrice', 'slPrice'],
    properties: {
      symbol: {
        type: 'string',
        title: 'Symbol',
      },
      orderPrice: {
        type: 'string',
        title: 'Order Price',
      },
      tpPrice: {
        type: 'string',
        title: 'Take Profit Price',
      },
      slPrice: {
        type: 'string',
        title: 'Stop Loss Price',
      },
    },
  };

  const uiSchema = {
    symbol: {
      'ui:placeholder': 'ETHUSDT',
    },
    orderPrice: {
      'ui:placeholder': '1800',
    },
    tpPrice: {
      'ui:placeholder': '1900',
    },
    slPrice: {
      'ui:placeholder': '1700',
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
      setIsLoading(true);
      await postForecast(formData);
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
      <DialogTitle sx={{ pb: 0 }}>Post Forecast</DialogTitle>
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
                  Post
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
