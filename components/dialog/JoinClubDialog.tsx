import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import { LOCAL_STORAGE_INVITATION_CODE_KEY } from 'constants/localStorage';
import { Web3Context } from 'context/web3';
import useError from 'hooks/useError';
import useFormSubmit from 'hooks/useFormSubmit';
import useToast from 'hooks/useToast';
import { JSONSchema7 } from 'json-schema';
import { useContext, useState } from 'react';

/**
 * Dialog to fill out join club form.
 */
export default function JoinClubDialog(props: {
  isClose?: boolean;
  onClose?: Function;
}) {
  const { account } = useContext(Web3Context);
  const { handleError } = useError();
  const { showToastSuccess } = useToast();
  const { submitForm } = useFormSubmit();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!props.isClose);
  const formType = 'joinClub';

  const schema: JSONSchema7 = {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: {
        type: 'string',
        title: 'Your name or pseudonym',
      },
      email: {
        type: 'string',
        title: 'Your email',
      },
      invitation: {
        type: 'string',
        title: 'Your invitation code (optional)',
        default: localStorage.getItem(LOCAL_STORAGE_INVITATION_CODE_KEY),
      },
      blog: {
        type: 'string',
        title: 'Your blog (optional)',
      },
      about: {
        type: 'string',
        title: 'About yourself (optional)',
      },
    },
  };

  const uiSchema = {
    name: {
      'ui:placeholder': 'Jordan Belfort',
    },
    email: {
      'ui:placeholder': 'thewolfofwallstreet@gmail.com',
      'ui:help': 'We will send information on the next steps to this email.',
    },
    invitation: {
      'ui:placeholder': '',
      'ui:help': '',
    },
    blog: {
      'ui:placeholder': 'https://jb.online',
      'ui:help': 'Telegram or Youtube channel, website.',
    },
    about: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
      },
      'ui:placeholder':
        'How long have you been trading?\nWhat exchanges do you usually use?',
    },
  };

  async function close() {
    setIsLoading(false);
    setIsOpen(false);
    props.onClose?.();
  }

  async function submit({ formData }: any) {
    try {
      setIsLoading(true);
      submitForm(formType, {
        account: account,
        ...formData,
      });
      showToastSuccess('Data sent successfully!');
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
      <DialogContent>
        <Typography variant="h6">
          Form to join the club EARLY ADOPTERS
        </Typography>
        <Form
          schema={schema}
          uiSchema={uiSchema}
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
                Sending data
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  Send
                </Button>
                <Button variant="outlined" onClick={() => props.onClose?.()}>
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
