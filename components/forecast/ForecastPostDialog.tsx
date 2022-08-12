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
import { FORECAST_TYPE } from 'classes/Forecast';

/**
 * Fix to support enum names in the schema.
 *
 * Details - https://github.com/rjsf-team/react-jsonschema-form/issues/2663#issuecomment-1106698186
 */
declare module 'json-schema' {
  export interface JSONSchema7 {
    enumNames?: Array<string>;
  }
}

/**
 * A dialog for create forecast.
 */
export default function ForecastPostDialog(props: {
  type: FORECAST_TYPE;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { showToastSuccess } = useToast();
  const { handleError } = useError();
  const { postPublicForecast, postPrivateForecast } = useForecast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!props.isClose);
  const [formData, setFormData] = useState({});

  const schema: JSONSchema7 = {
    type: 'object',
    required: ['symbol', 'orderPrice', 'tpPrice', 'slPrice'],
    properties: {
      symbol: {
        type: 'string',
        title: 'Symbol',
        default: 'ETHUSDT',
        enum: [
          'ETHUSDT',
          'BTCUSDT',
          'BNBUSDT',
          'XRPUSDT',
          'ADAUSDT',
          'SOLUSDT',
        ],
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
      'ui:placeholder': '1850',
    },
    tpPrice: {
      'ui:placeholder': '1910',
    },
    slPrice: {
      'ui:placeholder': '1790',
    },
  };

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    props.onClose?.();
  }

  async function submit({ formData }: any) {
    try {
      setFormData(formData);
      setIsLoading(true);
      if (props.type === FORECAST_TYPE.public) {
        await postPublicForecast(formData.symbol, formData);
      } else {
        await postPrivateForecast(formData.symbol, formData);
      }
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
                <Button variant="outlined" onClick={close}>
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
