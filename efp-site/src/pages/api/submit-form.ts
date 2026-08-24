import type { APIRoute } from 'astro';

export const prerender = false;

const SPAM_KEYWORDS = [
  'bitcoin', 'crypto', 'cryptocurrency', 'nft', 'blockchain',
  'loan offer', 'payday loan', 'personal loan', 'cash advance',
  'seo service', 'backlink', 'link building', 'google ranking', 'search ranking',
  'digital marketing agency', 'web design agency', 'we can help your website',
  'click here', 'buy now', 'limited time offer', 'act now', 'free money',
  'wire transfer', 'western union', 'money gram', 'unclaimed funds',
  'casino', 'poker', 'gambling', 'viagra', 'cialis', 'pharmacy',
  'work from home', 'earn from home', 'make money online', 'passive income',
  'instagram followers', 'youtube views', 'social media followers',
  'cheap pills', 'weight loss', 'diet pills',
];

const MIN_SUBMIT_MS = 3000;

export const POST: APIRoute = async ({ request }) => {
  const webhookUrl      = import.meta.env.GHL_WEBHOOK_URL;
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;

  if (!webhookUrl) {
    console.error('[submit-form] GHL_WEBHOOK_URL is not configured');
    return new Response(JSON.stringify({ success: false, message: 'Server configuration error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Invalid form submission.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Layer 1: Honeypot ──────────────────────────────────────────────────────
  const honeypot = (formData.get('website') as string | null) ?? '';
  if (honeypot.trim() !== '') {
    console.warn('[submit-form] Honeypot triggered');
    return new Response(JSON.stringify({ success: true, message: 'Received.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Layer 2: Time check — reject if submitted in under 3 seconds ───────────
  const loadedAt = parseInt((formData.get('_loaded_at') as string | null) ?? '0', 10);
  if (loadedAt > 0 && Date.now() - loadedAt < MIN_SUBMIT_MS) {
    console.warn('[submit-form] Time-check failed — submitted too fast');
    return new Response(JSON.stringify({ success: true, message: 'Received.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Layer 3: Cloudflare Turnstile ──────────────────────────────────────────
  if (turnstileSecret) {
    const token = (formData.get('cf-turnstile-response') as string | null) ?? '';
    if (!token) {
      console.warn('[submit-form] Turnstile token missing');
      return new Response(JSON.stringify({ success: false, message: 'Security check incomplete. Please try again.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    try {
      const verifyRes  = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: turnstileSecret, response: token }).toString(),
      });
      const verifyData = await verifyRes.json() as { success: boolean };
      if (!verifyData.success) {
        console.warn('[submit-form] Turnstile verification failed');
        return new Response(JSON.stringify({ success: false, message: 'Security check failed. Please refresh and try again.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (err) {
      console.error('[submit-form] Turnstile request error:', err);
    }
  }

  // ── Layer 4: Keyword filter ────────────────────────────────────────────────
  const message  = ((formData.get('message')   as string | null) ?? '').toLowerCase();
  const email    = ((formData.get('email')      as string | null) ?? '').toLowerCase();
  const combined = message + ' ' + email;

  const hasSpamKeyword = SPAM_KEYWORDS.some(kw => combined.includes(kw));
  const hasUrl         = /https?:\/\//.test(combined) || /\bwww\./i.test(combined);

  if (hasSpamKeyword || hasUrl) {
    console.warn('[submit-form] Keyword/URL filter triggered');
    return new Response(JSON.stringify({ success: true, message: 'Received.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── All checks passed — forward to GHL ────────────────────────────────────
  const payload = {
    firstName:   (formData.get('firstName')    as string | null)?.trim() ?? '',
    lastName:    (formData.get('lastName')     as string | null)?.trim() ?? '',
    phone:       (formData.get('phone')        as string | null)?.trim() ?? '',
    email:       (formData.get('email')        as string | null)?.trim() ?? '',
    county:      (formData.get('county')       as string | null)?.trim() ?? '',
    message:     (formData.get('message')      as string | null)?.trim() ?? '',
    smsMarketingConsent:     formData.get('smsMarketingConsent') === 'yes',
    smsTransactionalConsent: formData.get('smsTransactionalConsent') === 'yes',
    formVariant: (formData.get('form_variant') as string | null) ?? 'b2c',
    source:      'eforestproducts.com',
    submittedAt: new Date().toISOString(),
  };

  try {
    const ghlResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!ghlResponse.ok) {
      console.error('[submit-form] GHL webhook returned', ghlResponse.status);
    }
  } catch (err) {
    console.error('[submit-form] Failed to reach GHL webhook:', err);
  }

  return Response.redirect(new URL('/thank-you', request.url), 303);
};
