# Fresh subscriber acceptance — 2 November 2026

The owner deferred Safepay testing and requested the remaining independent checks. No payment is marked paid manually, and no old QA tenant is modified.

## Live observations

The deployed API accepted signup, sent a verification email received by the owner, accepted its single-use token (204), and accepted login (200). Verification-token replay returned 410 as expected. Authenticated subscriber catalog and workspace reads then failed with 401; API PR #24 repairs the unintended globally registered tenant staff revocation filter. That PR also supplies production defaults for direct cross-origin clients such as Flutter web. The public website instead uses its same-origin `/api/subscriber/...` proxy, so it does not depend on direct API CORS for these requests.

The public homepage, `/signup`, `/login` and `/account` returned 200. However, the actual emailed `/verify-email` route returned 404. Both GET `/api/subscriber/subscriber/auth/session` and POST `/api/subscriber/subscriber/auth/login` also returned 404 HTML on the deployed public website. These are HTTP acceptance observations, not a browser UI pass. No login cookie was created by the failed deployed website request.

## Source repair

Add `/verify-email` as a real App Router page reusing the existing signup verification component and its supported token query parameter. Tokens are consumed through the existing explicit POST; the page does not verify tokens in a server GET or expose tokens in server-rendered content. Give the route noindex, private/no-store and no-referrer headers. No duplicate verification service or new payment flow is introduced.

The login, session and subscriber proxy Route Handlers already exist in source. Their deployed 404s require checking the live artifact/project/domain routing; adding duplicate endpoints is not a repair. The responses currently do not establish whether the deployed artifact is older than main or a hosting route/build configuration is incorrect.

## Deployment and acceptance

Deploy the current public-web Next.js application with server Route Handlers, not just static page assets. On Vercel, verify that the production domain targets the intended organization repository/project and latest deployed main commit. On a Node host, use the standalone artifact with its server and required static/public assets. Set server-only `SUBSCRIBER_API_BASE_URL=https://api.ropulse.io/api/v1`; never expose credentials through public build variables. This application returns 503 for a missing subscriber base URL; the observed 404 must be corrected first.

After deployment, verify `/verify-email` returns 200 without using a real token in logs, then confirm an unauthenticated session read returns 200 with authenticated false. Login through the website should return authenticated true and an HttpOnly, Secure, SameSite=Lax session cookie. After API PR #24 deployment, authenticated session validation and catalog/workspace reads should succeed. Use a newly requested verification token for a complete browser run; the earlier email token has already been consumed by the authorized API test.

Safepay and payment-based automatic tenant provisioning remain deferred. This change has no database migrations and does not change website branding, marketing content or subscription prices.

## Validation completed

Production build passed and lists `/verify-email` plus the subscriber proxy/login/session handlers. Typecheck passed. All 44 existing Node tests passed with zero failures/skips. The first standalone typecheck hit stale `.next/types` references to the previously removed revalidation route; a normal production build regenerated the cache and subsequent typecheck passed without restoring that removed feature.

A local production-server HTTP smoke check was attempted after the build, but automatic approval review rejected the server-start command as blocked by policy. It was not retried through another launcher. Browser/native computer connections were unavailable earlier in this session. No local server, browser or Flutter UI runtime pass is claimed for this repair. Live route/session acceptance remains pending deployment.
