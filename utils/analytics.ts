import { POST_HOG_EVENT, POST_HOG_PROPERTY } from 'constants/analytics';
import { IS_LOCALHOST_ANALYTICS_DISABLED } from 'constants/features';
import posthog from 'posthog-js';

export function isAnalyticsEnabled() {
  const isLocalhost =
    window.location.href.includes('127.0.0.1') ||
    window.location.href.includes('localhost');
  const isAnalyticsEnabled =
    (IS_LOCALHOST_ANALYTICS_DISABLED && !isLocalhost) ||
    !IS_LOCALHOST_ANALYTICS_DISABLED;
  return isAnalyticsEnabled;
}

export function initAnalytics() {
  if (isAnalyticsEnabled() && process.env.NEXT_PUBLIC_POST_HOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POST_HOG_KEY, {
      api_host: 'https://app.posthog.com',
    });
  }
}

export function handlePageViewEvent() {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.pageView);
  }
}

export function handleConnectAccountEvent(account: string) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.connectedAccount, {
      [POST_HOG_PROPERTY.account]: account.toLowerCase(),
    });
    posthog.alias(account.toLowerCase());
  }
}

export function handleCatchErrorEvent(error: any) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.caughtError, {
      [POST_HOG_PROPERTY.errorMessage]: error?.message,
      [POST_HOG_PROPERTY.errorStack]: error?.stack,
    });
  }
}

export function handleSubmitFormEvent(formType: string, formData: any) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.submittedForm, {
      [POST_HOG_PROPERTY.formType]: formType,
      [POST_HOG_PROPERTY.formData]: formData,
    });
  }
}

export function handleCopyInvitationLinkEvent(link: string) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.copiedInvitationLink, {
      [POST_HOG_PROPERTY.link]: link,
    });
  }
}
