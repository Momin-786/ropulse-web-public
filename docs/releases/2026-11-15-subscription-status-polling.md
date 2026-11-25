# Subscription status polling

Status requests now share the existing pending read within the mounted checkout
session. Completed, failed and expired invoices stop polling immediately.
Unmount or invoice/session changes abort the pending GET; late results cannot
update another session. The interval remains ten seconds and all reads remain
no-store. Safepay checkout reporting and verified activation rules are unchanged.

Validated with TypeScript checking, all44 existing Node tests, and local headless
Chrome against the actual Next.js page. Slow responses spanning three intervals
produce no overlapping requests; all three terminal outcomes stop further reads.
The browser API is intercepted: this is not a Safepay charge or live AWS proof.
Run the targeted browser check with a local web server using
node tests/subscription-polling-browser.mjs (default localhost port3105), or set
TEST_BASE_URL. Development Strict Mode may make an initial aborted request.
No migrations, new dependencies, Neon or API configuration changes.
