import axios from 'axios';
import qs from 'qs';
import useErrors from './useError';

/**
 * Hook for work with formsubmit.io.
 */
export default function useFormSubmit() {
  const { handleError } = useErrors();

  let submitForm = async function (formType: string, formData: any) {
    try {
      const recipient = 'traderep.space@gmail.com';
      const postUrl = `https://formsubmit.co/ajax/${recipient}`;
      const postData = qs.stringify({
        type: formType,
        ...formData,
      });
      await axios.post(postUrl, postData);
    } catch (error: any) {
      handleError(error, false);
    }
  };

  return {
    submitForm,
  };
}
