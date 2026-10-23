# Deployment and rollback

## Current state

The owner selected Vercel. Use `VERCEL_DEPLOYMENT.md` for that host and
`PUBLIC_LAUNCH.md` for current launch gates, including the required security update.

The site has a Node/Next.js production build. No domain, hosting service or
production deployment was created. `WEBSITE_QA.md` records actual verification.
Docker and GitHub Actions definitions are supplied for use after this workspace
is placed in a Git repository; neither has been executed here.

## Local production preview

Use Node.js 22.18+ with the tracked manifest and lockfile. On a machine with
registry access, run `npm ci`. Configure `.env.local` from the example. Use the
real `SITE_URL` for a deployed host, or `http://localhost:3000` locally. Set
`DOCS_REVIEW_MODE=false` and `SITE_INDEXABLE=false` for a public-content preview.

```powershell
npm run typecheck
npm test
npm run build
npm start
```

Run `npm run test:e2e` in another terminal with matching origin configuration.
The browser script defaults to installed Chrome. For Playwright's Chromium,
run `npx playwright install chromium` and select `PLAYWRIGHT_CHANNEL=chromium`.
Do not build review and public production artifacts into the same `.next`
directory concurrently. Stop the production server before replacing its build.

To exercise the actual standalone artifact, run `npm run preview:production`.
It copies public/static assets into the standalone package and serves it on
`http://127.0.0.1:3001`. Test it with `node tests/browser.mjs http://127.0.0.1:3001`.
The request origin in tests must still match the configured `SITE_URL`.

## Public launch

1. Choose the milestone: `site`, `enquiries`, `distribution` or `paid`. Approve
   the facts and policies needed for that milestone. Installer release hashes
   and operational manual signoff are distribution gates, not prerequisites
   for an information-only launch. Paid checkout remains separately gated.
2. Configure the public HTTPS origin and identity destination if ready. Match
   the origin exactly; enquiry POSTs use it for cross-origin protection.
3. Connect the enquiry endpoint using `WEBSITE_INTEGRATIONS.md`. Verify durable
   receipt, deduplication, failure recovery and gateway rate limiting.
4. Set `DOCS_REVIEW_MODE=false` and run `npm run check:launch -- site` (or the
   chosen later milestone). Resolve missing inputs. Verify the patched dependency
   set through `npm run check:security`, audit and clean-install CI before release.
5. Set `SITE_INDEXABLE=true` only for the approved public host and rebuild with
   final public settings. Prerendered pages use build-time configuration.
6. Run production browser tests on the real artifact and host. Check HTTPS,
   canonical URLs, robots, sitemap, headers, contact origin and real delivery.
7. Route the domain after verification. Preserve the previous artifact.

## Node host

Use a Node-capable host or reverse proxy to Next. Serve HTTPS at the edge.
Configure request timeouts, body limits and enquiry rate limits. Keep `/account`
and `/api` responses out of shared caches; host rules must honor application
private/no-store headers. Static assets can use normal CDN caching.

For standalone packaging, deploy `.next/standalone`, copy `.next/static` into
its `.next/static` directory and `public` into its `public` directory. Run
`node server.js` from the artifact root. Do not expose the whole repository
as a static directory, or expose `docs/`, PDFs, archives or environment files.
The Next trace includes necessary manual source files on the server, not as
public assets or unrestricted routes.

The Dockerfile packages that layout and runs as a non-root user on port 3000.
Public configuration uses Docker build arguments. Supply the same values at
runtime and inject server-only credentials with the host's secret mechanism.
Never put credentials into build arguments. The Docker image has not been
built or tested in this session.

## Operations and rollback

Monitor page availability, enquiry error/timeout rates and accepted-delivery
IDs. Avoid request-body logs. Apply dependency updates in a review branch and
repeat checks. Back up source content and configuration separately from builds.

Keep an immutable previous artifact and configuration. On failure, route traffic
back, verify homepage/manual/enquiry availability and retain restricted logs.
This website has no local financial database migration to reverse. Do not
discard provider transactions as part of a website rollback. Preserve the
receiving service's idempotency records.
