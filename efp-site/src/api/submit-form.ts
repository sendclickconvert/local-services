// ⚠️ MANUAL-ONLY — GHL (CRST Web) webhook routing. Do not edit with Agent.
// This endpoint receives form submissions and routes to the CRM pipeline.
// Real routing logic must be wired manually by Bryan Collins.
//
// Current state: Stub only — returns 200 with placeholder JSON.
// Pipeline stages, field mapping, and lead source tagging are manual config.

import type { APIRoute } from 'astro';

export const prerender = false;  // This endpoint must NOT be statically rendered

export const POST: APIRoute = async ({ request }) => {
  // [STUB] — Real GHL webhook routing goes here
  // Steps to implement manually:
  // 1. Parse form data from request
  // 2. Map fields to GHL contact schema
  // 3. POST to PUBLIC_GHL_API_BASE with location auth
  // 4. Assign correct pipeline stage (B2C vs B2B via form_variant field)
  // 5. Trigger GHL automation workflow for lead nurture
  // 6. Return redirect or JSON confirmation

  return new Response(
    JSON.stringify({
      success: true,
      message: "[STUB] Form submission received. Endpoint not yet wired.",
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
