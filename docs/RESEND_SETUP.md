# Website enquiry email with Resend

The owner selected Resend for contact and demo requests. Both use
`POST /api/enquiries`. Notifications go to `support@ropulse.io` and
`momina7863@gmail.com`, configured server-side. Only the public support address
appears on the website. No account connection or DNS change is performed by code.

## Configure the sending domain

1. In Resend, add `notify.ropulse.io` as a sending domain.
2. At GoDaddy, add the exact DNS records displayed by Resend. Preserve the apex,
   `www`, `api`, existing mail MX and unrelated TXT records. Sending-domain
   verification does not configure the support mailbox; receiving and replying
   must also work through the owner's mail service.
3. Wait for the sending domain to be verified. Create a Sending-access API key
   restricted to that domain. Do not commit it, paste it in chat or expose it in
   browser configuration.

## Set Vercel environment variables

Configure these in the project's Production environment:

```dotenv
RESEND_API_KEY=<your secret Resend key>
CONTACT_FROM_EMAIL=Ropulse Website <website@notify.ropulse.io>
CONTACT_TO_EMAIL=support@ropulse.io,momina7863@gmail.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<your public Turnstile site key>
TURNSTILE_SECRET_KEY=<your secret Turnstile key>
SITE_URL=https://ropulse.io
```

Only the Turnstile site key is public. Never prefix either secret with
`NEXT_PUBLIC_`. Leave `CONTACT_ENDPOINT` and
`CONTACT_API_TOKEN` unset when using Resend. Resend configuration takes priority;
an incomplete Resend configuration fails closed instead of falling back to an
old endpoint. Recipients are comma-separated and every address must be valid.

Redeploy after changing Vercel environment variables. To test locally, put real
values only in ignored `.env.local`, with `SITE_URL` matching the development
origin. Preview deployments need separate explicit configuration and a matching
origin; do not enable previews against the production mailbox inadvertently.

## Activation and acceptance checks

In Cloudflare Dashboard, open Turnstile and create a Managed widget. Allow
`ropulse.io` (and `www.ropulse.io` if it serves the form). Copy its site key and
secret to the variables above. This does not require moving DNS from GoDaddy.
Server verification requires the returned hostname to match `SITE_URL` and the
action to equal `business_enquiry`. Do not disable these checks for previews;
use a separately allowed preview hostname and a matching `SITE_URL` instead.

The form stays unavailable until `src/content/policies.json` has an approved,
nonempty privacy notice with a review date, a seller is configured, delivery
configuration is valid, and both Turnstile keys are configured. The privacy
notice has been populated for this owner-authorized enquiry flow; it does not
claim that paid checkout or general service terms are approved. No verification
flags are set automatically. Configure Vercel Firewall abuse controls for
`POST /api/enquiries` before public activation; origin checks and body limits
alone are not spam protection or a distributed rate limiter.

1. Run `npm test`, `npm run typecheck` and `npm run build:release`.
2. Submit an owner-authorized test on `/contact` using an email contact. Confirm
   both mailboxes receive it, including business, contact, country, branches,
   consent and enquiry reference. Reply and check that the reply goes to the
   visitor's email, not to the sending address. Complete the Turnstile challenge
   before submission. Missing, expired, reused or invalid tokens must never
   result in an email. After an unsuccessful attempt the widget obtains a fresh
   token; unchanged enquiry data retains its email idempotency key.
3. Test a phone-only contact: the number must be in the body with no email
   reply-to. Replies to this notification cannot reach that visitor by email.
4. Inspect Resend delivery events and inbox/spam folders for both recipients.
   An API acceptance ID means queued/accepted, not guaranteed inbox delivery.
5. Record the test date, deployment and result without storing personal enquiry
   content in Git. Set `ENQUIRY_DELIVERY_VERIFIED=true` only after real delivery
   and abuse-control checks; verify the support mailbox independently.

Validation runs in the browser and server. The API retains exact-origin checks,
an 8 KiB request limit and consent validation. The server calls the fixed Resend
HTTPS endpoint with an 8-second timeout, no redirects and no response caching.
Before sending, the server verifies the security token with Cloudflare using a
5-second timeout. The route budget and browser timeout are 20 seconds. The CSP
allows Cloudflare scripts and challenge frames without adding general wildcards
or production `unsafe-eval` permission.
Success requires an accepted HTTP status and a nonempty Resend email ID. Provider
errors and credentials are not returned to the visitor or logged by this code.

Email contacts become `reply_to`; phone contacts remain in the plain-text body.
The sender, recipients and subject are server-controlled. No automatic visitor
email or marketing subscription is created. Retrying an unchanged form retains
the same idempotency key and body. Resend retains idempotency keys for 24 hours;
avoid retrying an uncertain enquiry after that window without checking its
delivery history. Changed form data receives a new key.

## Local simulated browser check

`tests/enquiry-browser.mjs` exercises an enabled production form with synthetic
providers. It never verifies real DNS, Turnstile challenges or mailbox delivery.
After `npm run build:release`, run the following in a separate PowerShell terminal:

```powershell
$env:ROPULSE_TEST_PROVIDERS='true'
$env:NODE_ENV='production'
$env:SITE_URL='http://127.0.0.1:3017'
$env:RESEND_API_KEY='re_test_only'
$env:CONTACT_FROM_EMAIL='Ropulse Website <website@notify.ropulse.io>'
$env:CONTACT_TO_EMAIL='support@ropulse.io,momina7863@gmail.com'
$env:NEXT_PUBLIC_TURNSTILE_SITE_KEY='site-test-only'
$env:TURNSTILE_SECRET_KEY='secret-test-only'
node --import ./tests/fixtures/enquiry-providers.mjs node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3017
```

In another terminal run `node tests/enquiry-browser.mjs`. It requires local Chrome
and intercepts only the browser widget script. The explicit server preload
intercepts the actual server-side provider requests; application code contains
no test bypass. Stop the server with Ctrl+C and close its terminal afterward so
the synthetic environment does not carry into unrelated commands. Never use this
preload or these dummy credentials in a deployed environment.

## References

- [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)
- [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction)
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Cloudflare Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
