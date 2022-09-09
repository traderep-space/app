import { LANDING_PAGE_LINK } from 'constants/links';
import { LOCAL_STORAGE_INVITATION_CODE_KEY } from 'constants/localStorage';
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
