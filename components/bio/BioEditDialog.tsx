import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { JSONSchema7 } from 'json-schema';
import useToast from 'hooks/useToast';
import useError from 'hooks/useError';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import ImageInput from 'components/form/ImageInput';
import useBio from 'hooks/useBio';

/**
 * A dialog for edit bio.
 */
export default function BioEdidDialog(props: {
  data?: object;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { showToastSuccess } = useToast();
  const { handleError } = useError();
  const { editBio } = useBio();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!props.isClose);
  const [formData, setFormData] = useState({
    ...props.data,
  });

  const schema: JSONSchema7 = {
    type: 'object',
    required: [],
    properties: {
      image: {
        type: 'string',
        title: 'Image',
      },
      name: {
        type: 'string',
        title: 'Name or Pseudonym',
      },
      description: {
        type: 'string',
        title: 'Description',
      },
      email: {
        type: 'string',
        title: 'Email',
      },
      website: {
        type: 'string',
        title: 'Website Link',
      },
      twitter: {
        type: 'string',
        title: 'Twitter Username',
      },
      telegram: {
        type: 'string',
        title: 'Telegram Username',
      },
    },
  };

  const uiSchema = {
    image: {
      'ui:widget': 'imageInput',
    },
    description: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3,
      },
    },
  };

  const widgets = {
    imageInput: ImageInput,
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
      await editBio(formData);
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
      <DialogTitle sx={{ pb: 0 }}>Edit Bio</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          widgets={widgets}
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
                  Edit
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
