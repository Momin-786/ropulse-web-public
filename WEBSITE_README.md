# RoPulse website

The launch website is implemented with Next.js, TypeScript and the supplied
brand assets. It includes restaurant/retail pages, the user-manual renderer and
search, enquiry handling, release downloads and shared-account entry points.

**Current readiness:** runs locally and builds for production. Live identity,
payment collection, enquiry delivery, approved policies, public contact details
and app releases require their real configuration. No payments are accepted.
The owner confirmed Ebosoft Solutions as seller and support hours of 10 AM–10 PM
Pakistan time. These details now appear on the site. The postal address and
support working days are still pending; mailbox delivery remains unverified.

**Deployment is blocked pending a dependency security update.** See
`docs/PUBLIC_LAUNCH.md` for current owner details and release gates, and
`docs/VERCEL_DEPLOYMENT.md` for the selected host. Vercel and CI enforce the
security baseline before releasing. `/resources` is the resource hub and
`/tour` shows freshly captured real app interfaces with sample data.

The original `README.md` describes the pre-implementation content workspace.
This file is the current website setup guide; the original could not be
updated because the filesystem rejected writes to that existing file.

## Run locally

Use Node.js 22.18+ and npm:

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`. Development defaults to the labelled manual review
edition, including all 15 existing chapters. The owner has approved showing
these guides publicly with draft labels and noindex. `DOCS_PUBLIC_DRAFTS=true`
is now the default. To return to approved-only manuals, set both
`DOCS_PUBLIC_DRAFTS=false` and `DOCS_REVIEW_MODE=false`. No guide is falsely
marked release-approved by this visibility setting.

`.env.example` documents configuration. Copy it to `.env.local` when configuring
real values. Set `DOCS_REVIEW_MODE=true` in that local file if you want all
draft guides visible while reviewing. The native Register remains a separate
app; this website does not make it browser-ready.

Real screenshot figures are added through `src/content/manual-illustrations.json`;
the original guide files are read-only here and remain intact. Captions distinguish
sample data from real payments. Figures can be enlarged with keyboard-accessible
dialogs. Page/scroll motion respects reduced-motion preferences and fails open
without JavaScript. Run `npm run test:motion -- http://127.0.0.1:3001` against a
production preview to verify these behaviors.

The visual pass adds 10 actual Backoffice captures alongside the six Register,
floor and checkout images. All 13 operational chapters include screenshots with
numbered arrows and matching instructions; the two future billing/account guides
use a labelled concept diagram. Source images remain unretouched, with capture
hashes and font-only test-rendering adjustments recorded in the manifest.
`npm run test:visual` checks hero overlap, responsive service icons, expandable
manual groups, arrow overlays, keyboard behavior and mobile image enlargement.

## Validate

```powershell
npm run typecheck
npm test
npm run build
npm run check:launch
```

The launch check is expected to fail until business, policy, content, release
and delivery inputs are supplied. It reports launch readiness, not code quality.

Browser tests require a running website. On this Windows workstation they use
installed Chrome:

```powershell
npm run test:e2e
```

For Playwright Chromium, run `npx playwright install chromium`, then select
`PLAYWRIGHT_CHANNEL=chromium`. Set `TEST_BASE_URL` for a different server and
`TEST_SITE_ORIGIN` to match its configured `SITE_URL`. Screenshots and reports
go to `tmp/qa/`.

## Operate and maintain

- [Public launch milestones and blockers](docs/PUBLIC_LAUNCH.md)
- [Vercel setup](docs/VERCEL_DEPLOYMENT.md)
- [Remaining owner policy inputs](docs/OWNER_POLICY_INPUTS.md)
- [Deployment and rollback](docs/DEPLOYMENT.md)
- [Content publication](docs/WEBSITE_CONTENT.md)
- [Service integration contract](docs/WEBSITE_INTEGRATIONS.md)
- [Quality report](docs/WEBSITE_QA.md)
- [Approved website design](docs/superpowers/specs/2026-10-20-ropulse-launch-website-design.md)
- [Client brand guidance in Markdown](docs/BRAND_GUIDELINES_EXTRACTED.md)

Existing requirements remain in `docs/WEBSITE_AND_PAYMENTS_PLAN.md`; the
canonical manual chapters remain in `docs/user-guide/`.
