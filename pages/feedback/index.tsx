import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import Layout from 'components/layout/Layout';
import useError from 'hooks/useError';
import useFormSubmit from 'hooks/useFormSubmit';
import useToast from 'hooks/useToast';
import { JSONSchema7 } from 'json-schema';
import { useState } from 'react';

/**
 * Feedback page.
 */
export default function FeedbackPage() {
  const { handleError } = useError();
  const { showToastSuccess } = useToast();
  const { submitForm } = useFormSubmit();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const formType = 'sendFeedback';

  const schema: JSONSchema7 = {
    type: 'object',
    required: ['contact', 'feedback'],
    properties: {
      name: {
        type: 'string',
        title: 'Your name or pseudonym (optional)',
      },
      contact: {
        type: 'string',
        title: 'Your email',
      },
      feedback: {
        type: 'string',
        title: 'Your question or suggestion',
        default: '',
      },
    },
  };

  const uiSchema = {
    feedback: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
      },
    },
  };

  async function submit({ formData }: any) {
    try {
      setFormData(formData);
      setIsLoading(true);
      await submitForm(formType, formData);
      setFormData({});
      showToastSuccess('Data sent successfully!');
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <Typography gutterBottom variant="h6">
        Do you have a question or suggestion?
      </Typography>
      <Typography>Write to us, we will be glad to help!</Typography>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={submit}
        disabled={isLoading}
        formData={formData}
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
            <Button variant="contained" type="submit">
              Send
            </Button>
          )}
        </Stack>
      </Form>
    </Layout>
  );
}
