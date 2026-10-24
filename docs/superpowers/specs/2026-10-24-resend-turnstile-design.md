# Resend enquiries protected by Turnstile

The owner selected Resend, confirmed both recipient mailboxes are team-controlled,
requested Cloudflare Turnstile protection, and requested publication without a
physical address because none is available. Implementation follows that scope.

Contact and demo forms share the enquiry API. Keep browser validation separate
from server delivery. Configure the sender and comma-separated recipients in
server environment variables. Only the Turnstile site key goes to the browser;
neither secret nor the private recipient list is serialized into page props.

Preserve origin, byte-limit, field and consent checks. Validate each Turnstile
token against Cloudflare before calling Resend, matching both the deployment
hostname and `business_enquiry` action. Fail closed on missing configuration,
invalid/expired challenges and provider/network errors. Update the CSP only for
Cloudflare's script, frame and connection origin. No general wildcard is needed.

Generate fresh Turnstile tokens on retries while preserving email idempotency
for unchanged form values. Resend acceptance requires an email ID and does not
prove inbox delivery. Email reply-to is used only for valid email contacts;
phone-only contacts remain in the message body. Do not send visitor autoresponses
or enroll visitors in marketing.

Publish an enquiry-specific privacy notice using confirmed business facts and
actual processors. No physical address, fixed retention period, tax/legal
certification, support SLA or verified-mailbox claim is invented. General terms
and deferred billing policy remain separate from this form's activation.

Verify provider request shapes, recipient validation, replay/error paths and
fail-closed behavior with tests. Exercise the production server with synthetic
provider responses and a stub widget to verify browser/API integration without
external sends. Real domain/key configuration and mailbox receipt/reply tests
remain owner-operated launch steps. Turnstile reduces automated abuse; platform
firewall controls remain appropriate for traffic limits.
