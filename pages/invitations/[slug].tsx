import { LANDING_PAGE_LINK } from 'constants/links';
import { LOCAL_STORAGE_INVITATION_CODE_KEY } from 'constants/localStorage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Invitation page.
 */
export default function InvitationPage() {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_INVITATION_CODE_KEY, slug as string);
    router.push(LANDING_PAGE_LINK);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}

/**
 * Define localized texts before rendering the page.
 */
export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
