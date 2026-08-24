import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const webhookUrl = import.meta.env.GHL_WEBHOOK_URL;

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

  // Honeypot check — bots fill the hidden website field
  const honeypot = formData.get('website') as string;
  if (honeypot && honeypot.trim() !== '') {
    return new Response(JSON.stringify({ success: true, message: 'Received.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = {
    firstName:   (formData.get('firstName')    as string | null)?.trim() ?? '',
    lastName:    (formData.get('lastName')     as string | null)?.trim() ?? '',
    phone:       (formData.get('phone')        as string | null)?.trim() ?? '',
    email:       (formData.get('email')        as string | null)?.trim() ?? '',
    county:      (formData.get('county')       as string | null)?.trim() ?? '',
    message:     (formData.get('message')      as string | null)?.trim() ?? '',
    smsConsent:  formData.get('smsConsent') === 'yes',
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

  // Redirect to thank-you page after submission regardless of GHL response
  return Response.redirect(new URL('/thank-you', request.url), 303);
};
