declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// @ts-expect-error - react-ga4 types may not be available
import ReactGA from 'react-ga4';

// @ts-expect-error - import.meta.env is provided by Vite
const GA_MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;
// @ts-expect-error - import.meta.env is provided by Vite
const IS_PRODUCTION: boolean = import.meta.env.PROD === true;

let gaInitialized = false;

export const initGA = (): void => {
  if (!IS_PRODUCTION) return;
  if (!GA_MEASUREMENT_ID) return;

  try {
    ReactGA.initialize(GA_MEASUREMENT_ID, { testMode: false });
    gaInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
    gaInitialized = false;
  }
};

export const trackPageView = (path: string, title?: string): void => {
  if (!IS_PRODUCTION || !GA_MEASUREMENT_ID || !gaInitialized) return;

  try {
    ReactGA.send({ hitType: 'pageview', page: path, title: title || document.title });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>,
): void => {
  if (!IS_PRODUCTION || !GA_MEASUREMENT_ID || !gaInitialized) return;

  try {
    ReactGA.event(eventName, eventParams || {});
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const isGAAvailable = (): boolean =>
  IS_PRODUCTION && !!GA_MEASUREMENT_ID && (gaInitialized || !!(window.dataLayer && window.gtag));
