import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import Layout from 'components/layout/Layout';
import useError from 'hooks/useError';
import useFormSubmit from 'hooks/useFormSubmit';
import useToast from 'hooks/useToast';
import { JSONSchema7 } from 'json-schema';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { handleSubmitFormEvent } from 'utils/analytics';

/**
 * Feedback page.
 */
export default function FeedbackPage() {
  const { t, i18n } = useTranslation('common');
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
        title:
          t('input-name-or-pseudonym-title') +
          ' ' +
          t('input-optional-title-part'),
      },
      contact: {
        type: 'string',
        title: t('input-email-title'),
      },
      feedback: {
        type: 'string',
        title: t('input-question-or-suggestion-title'),
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
      const expandedFormData = {
        ...formData,
        language: i18n.language,
      };
      await submitForm(formType, expandedFormData);
      handleSubmitFormEvent(formType, expandedFormData);
      setFormData({});
      showToastSuccess(t('text-data-sent-successfully'));
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <Typography gutterBottom variant="h6">
        {t('page-feedback-title')}
      </Typography>
      <Typography>{t('page-feedback-subtitle')}</Typography>
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
              {t('button-sending-data')}
            </LoadingButton>
          ) : (
            <Button variant="contained" type="submit">
              {t('button-send')}
            </Button>
          )}
        </Stack>
      </Form>
    </Layout>
  );
}

/**
 * Define localized texts at build time.
 */
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
