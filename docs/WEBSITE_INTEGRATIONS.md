# Website service integration contract

## Enquiries

The browser sends JSON to `POST /api/enquiries`. The route checks the configured
origin, JSON format, actual body size (8 KB maximum), field lengths, contact
format, branch count and explicit contact permission. Client validation
complements server checks. Retrying an unchanged enquiry reuses its request
UUID; changing the body creates a new request ID.

Configure `SITE_URL`, `COMPANY_NAME` and `CONTACT_ENDPOINT`, then publish approved
privacy text/date/flag. These gates control whether the form is enabled.
`CONTACT_API_TOKEN`, if supplied, is forwarded as a server-only Bearer credential.
The browser never receives that endpoint or token. Redirects are rejected.
The upstream deadline is eight seconds; the browser deadline is twelve seconds.

The configured HTTPS endpoint receives:

```text
Content-Type: application/json
Idempotency-Key: the website request UUID
Authorization: Bearer configured-token (when configured)

name, business, contact, country, branches, consent,
requestId, source="ropulse-website", consentVersion="demo-enquiry-v1"
```

The destination must authenticate this integration, rate-limit it, deduplicate
request IDs and durably accept the enquiry before returning HTTP 200, 201 or
202. Those statuses are the explicit acceptance contract. Other statuses,
network errors and timeouts produce an unconfirmed delivery message. A retry
of the same key must not create another lead. Do not point this adapter at an
endpoint whose 200 response does not acknowledge that contract.

The website does not implement a durable lead database, send email directly
or log enquiry bodies. Configure rate limiting at the host/gateway and receiving
service before public submission. Preserve request IDs in restricted service
logs, redact personal data and apply the approved retention policy. Verify
actual delivery after configuration.

Response statuses: 400 malformed data; 403 wrong origin; 413 oversized body;
415 unsupported format; 422 validation; 503 unavailable; 502 unconfirmed
upstream outcome; 200 accepted delivery.

## Shared account

`IDENTITY_URL` is an approved HTTPS account-service destination. It is a plain
handoff link; no reusable tokens or passwords are placed in URLs. Without it,
account routes explain availability and link to onboarding. Supplying a URL
does not certify SSO, membership linking or recovery; those remain backend-owned.

## Billing

Safepay setup is deferred by the owner. No provider secrets, fake checkout,
invoice payment number or client-side activation are present. `/checkout`
explains that paid checkout is unavailable. 1Bill remains a required future
route under the existing plan.

Before live portal implementation, obtain server examples for verified signup,
membership selection, authoritative offers, owned invoices, hosted payment
creation, bill issue/status, fulfilment, cancellation and route changes. Define
authorization, idempotency, minor-unit amounts, currency, service dates and
session exchange. Keep private responses out of public caches/search. Do not
introduce a competing user database.

Paid-launch acceptance remains the journey in `WEBSITE_AND_PAYMENTS_PLAN.md`,
including provider evidence, duplicate/out-of-order events, renewals, cancellation
and recovery. Website tests do not certify those external systems.
