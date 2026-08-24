/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA4_MEASUREMENT_ID: string;
  readonly PUBLIC_GHL_LOCATION_ID: string;
  readonly PUBLIC_GHL_API_BASE: string;
  readonly PUBLIC_TRACKING_SCRIPT_ID: string;
  readonly GHL_WEBHOOK_URL: string;
  readonly DATAFORSEO_LOGIN: string;
  readonly DATAFORSEO_PASSWORD: string;
  readonly TURNSTILE_SITE: string;
  readonly TURNSTILE_SECRET_KEY: string;
  // Future — do not uncomment until ecommerce is scoped:
  // readonly STRIPE_SECRET_KEY: string;
  // readonly PUBLIC_STRIPE_PAYMENT_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
