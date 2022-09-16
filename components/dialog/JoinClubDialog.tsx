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
import { useTranslation } from 'next-i18next';
import { useContext, useState } from 'react';
import { handleSubmitFormEvent } from 'utils/analytics';

/**
 * Dialog to fill out join club form.
 */
export default function JoinClubDialog(props: {
  isClose?: boolean;
  onClose?: Function;
}) {
  const { account } = useContext(Web3Context);
  const { i18n, t } = useTranslation('common');
  const { handleError } = useError();
  const { showToastSuccess } = useToast();
  const { submitForm } = useFormSubmit();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!props.isClose);
  const formType = 'joinClub';

  const schema: JSONSchema7 = {
    type: 'object',
    required: ['name', 'email', 'about'],
    properties: {
      name: {
        type: 'string',
        title: t('input-name-or-pseudonym-title'),
      },
      email: {
        type: 'string',
        title: t('input-email-title'),
      },
      about: {
        type: 'string',
        title: t('input-yourselft-title'),
      },
      invitation: {
        type: 'string',
        title:
          t('input-invitation-code-title') +
          ' ' +
          t('input-optional-title-part'),
        default: localStorage.getItem(LOCAL_STORAGE_INVITATION_CODE_KEY),
      },
    },
  };

  const uiSchema = {
    name: {
      'ui:placeholder': t('input-name-or-pseudonym-placeholder'),
    },
    email: {
      'ui:placeholder': t('input-email-placeholder'),
      'ui:help': t('input-email-help'),
    },
    invitation: {
      'ui:placeholder': t('input-invitation-code-placeholder'),
    },
    about: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
      },
      'ui:placeholder': t('input-yourselft-help'),
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
      const expandedFormData = {
        ...formData,
        account: account,
        language: i18n.language,
      };
      await submitForm(formType, expandedFormData);
      handleSubmitFormEvent(formType, expandedFormData);
      showToastSuccess(t('text-data-sent-successfully'));
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
        <Typography variant="h6">{t('dialog-join-club-title')}</Typography>
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
                {t('button-sending-data')}
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  {t('button-send')}
                </Button>
                <Button variant="outlined" onClick={() => props.onClose?.()}>
                  {t('button-close')}
                </Button>
              </>
            )}
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
