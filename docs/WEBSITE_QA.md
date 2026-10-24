# Website quality and readiness report

Date: 2026-10-23. Environment: Windows, Node.js 24.19, Next.js 16.3.1,
React 19.2.8 and headless installed Google Chrome through Playwright.

## Expanded printer and KOT guide — 22 October handoff

The expanded canonical hardware chapter and `PRINTER_AND_KOT_WEBSITE_HANDOFF.md`
were read and applied. The old illustration heading no longer existed after
the source update; it now points to the expanded numbered sections. The source
chapter is preserved in full. The public title is **Printers, receipts & KOT**,
and the manual index features a direct illustrated entry to it. All 14 numbered
sections remain in the table of contents, with installation tables and recovery
checks intact. The implementation handoff remains an internal document.

Seven new real-widget captures cover local receipt printer/paper settings,
the network-printer dialog, logical destination/station assignment, category
routing, local physical bindings, queue states and original job details. Each
has three numbered arrows and matching instructions, including in the enlarged
view. The current UI path is clarified as Receipt Center → Preview & Test →
Printer on this register. The snapshot's seven printer UI/controller files were
compared byte-for-byte with the current app worktree; hashes are recorded with
the assets. The app worktree is not clean, so no released-build certification is
claimed. The capture harness uses in-memory repositories, documentation-only
TEST-NET printer addresses, mocked native printing information and test fonts.
All seven capture tests passed. No physical print, retry, reprint, scan, provider
call or production tenant mutation was performed.

All 28 website unit tests and TypeScript passed. Unit checks cover preservation
of every non-empty source line, all numbered sections, seven images, image
hashes and key safety distinctions. Browser checks passed in development for
featured-guide keyboard navigation, task search, every TOC destination, seven
images, dialogs/focus restoration, 320/390/768px fit and no-JavaScript image
instructions. Desktop, mobile and enlarged-image screenshots were inspected.
The initial cold development compilation exceeded the browser's 30-second
navigation timeout; the check was rerun with 60 seconds. Screenshot caret hiding
also caused a development hydration warning; this test-only mutation was
disabled by using `caret: initial` in the capture script.

`docs/WEBSITE_MANUAL_REVIEW.md` has been regenerated from all 15 chapters, with
original screenshots, captions and numbered text guidance. The older combined
platform guide remains a historical snapshot. Capture provenance is in
`src/content/product-captures.json`; placement and instructions are in
`manual-illustrations.json` and `screenshot-callouts.json`.

Final production verification passed: the optimized 41-page build, the dedicated
printer-guide checks against its standalone artifact, and the general browser
regression suite across 19 public routes and responsive layouts. No runtime
errors or tested document overflows were reported. The combined reading edition's
25 image references resolve to local files. Evidence includes
`tmp/qa/printer-guide-results.json`, `browser-results-production.json`,
`printer-guide-entry-mobile.png`, `printer-guide-mobile.png` and
`printer-bindings-enlarged.png`. Preview:
`http://127.0.0.1:3001/docs/hardware-and-printing`.

## Service section: photography and supplied branding

The owner subsequently requested one aesthetic across all four panels. The
current version uses a single shared template: plum surface, supplied RP logo,
serif lettering with a magenta full stop, identical eyebrow/signoff positioning
and matching white captions. The mixed photographic panels below describe the
previous iteration. Tablet and phone layouts use two columns.

TypeScript and the dedicated sector-layout browser checks passed at 320, 361,
390, 768, 1024 and 1440px. The checks verify image decoding, containment of
artwork/text, horizontal fit, keyboard activation and absence of runtime errors.
Desktop/mobile screenshots were inspected directly. Evidence:
`tmp/qa/unified-sectors-1440.png`, `unified-sectors-390.png` and
`sector-layout-results.json`. Reproduce with `node tests/sector-layout.mjs`.

The unified version's final 41-page production build and sector-layout browser
checks against its standalone artifact also passed. The local production
preview has been restored at `http://127.0.0.1:3001`.

The owner rejected the previous outline-icon treatment. The replacement uses
four editorial panels: café lettering, the app's existing burger and pizza
photography, and the supplied RP monogram for multiple branches. The retail
handoff uses the Ropulse wordmark. No customer logos or endorsements were
invented. Asset sources and design decisions are in `SERVICE_SECTION_DESIGN.md`.

TypeScript and all 27 unit tests passed. The first production build and the
updated visual-guidance browser suite passed, including image decoding, links,
hero separation and responsive widths at 320, 390, 768, 1024 and 1440 pixels.
Desktop and mobile screenshots were inspected directly. A retail-link arrow
alignment issue found during visual review was corrected for the final rebuild.
The section's hover effects respect reduced motion.

The final rebuild and visual-guidance suite also passed after the arrow fix.
The refreshed desktop screenshot confirms the retail action and arrow align
on one row. Evidence: `tmp/qa/service-visuals-1440.png`,
`service-visuals-390.png` and `visual-guidance-results.json`. The standalone
local preview is running on port 3001.

## Latest visual guidance and layout pass

The hero screen decoration is now confined to the screen itself, with a separate
action row and caption. The service strip uses four distinct line illustrations,
descriptive labels and a dedicated retail card. Manual group headings are native
expandable controls with icons, guide counts, visible focus and active links.

Ten actual Backoffice screenshots were added, bringing the capture manifest to
16 images. The nine-screen capture suite and the separately executed Orders
capture passed. These render real widgets with stub repositories in an isolated
snapshot. Font-only test shims remove Ahem placeholder boxes; dimensions and
SHA-256 hashes are recorded. The sibling app and original PNG pixels are untouched.

All 13 operational manuals now include real screens with numbered SVG guidance
and corresponding text instructions. The enlarged view retains both. Original
image links still work without JavaScript. The two future account/billing guides
use an explicitly labelled concept diagram. Homepage, platform, retail, setup
and Resources pages now include real Backoffice galleries.

The initial visual pass passed 27 unit tests, TypeScript, the optimized 41-page
build, the general production browser suite, the motion/manual suite, and the
new visual-guidance suite. Browser checks covered hero separation at 320, 390,
768, 1024 and 1440px; group collapse/keyboard expansion; all 13 illustrated
operational chapters; enlarged arrows and instructions; mobile fit; original
links without JavaScript; and no runtime errors. Direct visual inspection caught
a missing space in the mobile service heading; this was corrected before the
final rebuild. Evidence is in `tmp/qa/visual-guidance-results.json`,
`browser-results-production.json`, `motion-manuals-results.json`,
`hero-fixed-1440.png`, `service-visuals-390.png`, `manual-sidebar-groups.png`,
`stock-guide-enlarged.png` and `catalog-guide-mobile.png`.

Final verification after the spacing correction, arrow-position refinement and
planned-flow diagrams also passed: TypeScript, 27 unit tests, the optimized
41-page build and all three browser suites against the rebuilt standalone
artifact. No tested horizontal overflow or browser runtime errors were reported.
The final mobile service strip and planned billing diagram were inspected
directly, along with the desktop product gallery and enlarged annotated stock
screen. Preview: `http://127.0.0.1:3001` (local only).

The release checks still correctly block deployment: the installed Next.js and
sharp versions need patching, HTTPS deployment and clean-install CI need
verification, the support mailbox needs a delivery check, and privacy/terms
need approval. This visual work does not certify public or paid launch.

The entries below are historical records of earlier implementation stages.

## Motion, light hero and illustrated manuals

The owner requested page/scroll animation, removal of the dark hero surround,
and real app screenshots inside guides. They approved showing the existing
manuals publicly with clear draft labels. `DOCS_PUBLIC_DRAFTS=true` now exposes
all 15 allowlisted chapters, without changing their release-review records.
Draft articles and the draft manual index use noindex and are excluded from
the sitemap. Billing chapters retain their planned-service notices.

The hero now has a light frame, soft shadow and lavender backplate. Pathname
changes animate with a brief fade/translate; selected marketing blocks reveal
on scroll. Reduced motion disables these effects, and non-JavaScript content
remains visible. Native screenshot dialogs support enlargement, Escape, close,
and focus restoration. Original-image links are also available without JavaScript.

Because the source manual files are read-only, screenshot placement and added
device-layout explanations live in a separate versioned illustration layer.
Only exact image paths in the capture manifest can be rendered. Two fresh
checkout captures were generated in the isolated Flutter snapshot, with the
development banner removed and original chip-label colors preserved by the
preview font override. All 43 payment widget tests passed after this change.
The sibling app was not edited and no image pixels were retouched. Six capture
assets now have recorded dimensions and SHA-256 hashes. All 26 website unit
tests passed, including image safety, hashes, guide placement and draft settings.

The required dependency security update remains blocked by network access.
The production release guard remains active, including Docker and Vercel paths.

Final checks passed: TypeScript, all 26 unit tests, the optimized build with
41 generated pages (including all 15 guide routes), the general production
browser suite and the dedicated motion/manual suite against the standalone
artifact. The latter verifies route-entry animation on client navigation,
scroll reveal completion, reduced motion, no-JavaScript content visibility,
draft/noindex metadata, screenshot assets, desktop/mobile dialogs, Escape,
close-button focus restoration and planned billing notices. Both browser suites
reported no runtime errors. Hero and manual screenshots were visually inspected.
Evidence: `tmp/qa/motion-manuals-results.json`, `browser-results-production.json`,
`hero-light-desktop.png`, `hero-light-mobile.png`, `illustrated-register-mobile.png`
and `manual-screenshot-dialog.png`.

Earlier records below describe previous implementation stages. The owner's
later approval of labelled public drafts supersedes the previous approved-only
visibility default; it does not approve release instructions or paid services.

## Real app previews and Resources redesign

The owner clarified that the website should be improved using actual app
screenshots, with no redesign of the native application. Fresh isolated Flutter
captures passed 59 register/payment widget tests. Four unretouched screenshots
with seeded data are published; provenance and SHA-256 hashes are recorded in
`src/content/product-captures.json`. These are app-source renders, not a live
tenant or payment-provider walkthrough.

The homepage now uses the actual Register. `/tour` has four selectable views
and full-size image links. `/resources` separates six resource destinations,
provides direct manual search, and links to preparation and support. Manual
search, role filters, article navigation and cards have larger readable type
and clearer visual hierarchy. Branding now credits Ebosoft Solutions, Pakistan,
and uses the intended `support@ropulse.io` address; mailbox delivery is unverified.

After these changes, all 20 unit tests and TypeScript checking passed. Review
browser checks passed on 19 routes, all four tour views, image loading, all 15
review guides, search/roles, security rejections, menu focus and mobile navigation.
Responsive checks covered marketing, Resources, tour, manual and enquiry pages
at 320, 390, 768, 1024 and 1440 pixels. No browser runtime errors were reported.
Desktop and mobile screenshots were inspected directly. The final direct search
form change is also included in the production browser check.

Final verification passed: the optimized approved-only production build and
the browser suite against its actual standalone artifact on loopback port 3001.
The Resources search submits to `/docs?q=printer` with the query preserved;
all four app tour views load; unpublished guides remain excluded. Production
CSP excludes `unsafe-eval`. There were no browser runtime errors or tested
horizontal overflows. Results: `tmp/qa/browser-results-production.json` and
`tmp/qa/browser-results-review.json`. The security baseline check correctly
fails for the installed outdated version. The local preview remains available
at `http://127.0.0.1:3001`; it is not a public deployment.

**Public deployment remains blocked by the dependency security update.** The
local Next.js version is 16.3.1; the required patched-version install failed due
to network restrictions. Vercel's `build:release` and CI now stop at the security
baseline gate. The local build command remains available for isolated QA. See
`PUBLIC_LAUNCH.md` and `VERCEL_DEPLOYMENT.md`; no public deployment is claimed.

## Verified

Continuation changes: the owner confirmed seller Ebosoft Solutions and support
hours 10 AM–10 PM; the site displays Pakistan time explicitly. Platform and
restaurant pages now include real app screenshot sections, and public pricing
and account text avoids implementation details. Unavailable enquiry fields are
disabled as a group. Long article navigation is independently scrollable on
desktop so lower links remain reachable. The release gate checks both Next.js
and sharp against the locked and actually installed versions, including rejected
prerelease/unreviewed-major versions. All 23 unit tests and type checking passed.
The latest patched install attempt again failed with registry EACCES; neither
dependency was falsely marked updated. The public business address remains
unsupplied, and policy approval flags remain false.

The continuation production build and standalone browser suite passed, including
the new app sections, visible support hours, and disabled enquiry inputs.
All 19 public routes and responsive checks passed with no browser runtime
errors. New screenshots cover platform, restaurant and support pages. The
source-only backend search found no enquiry/contact collection controller in
`../api/src/main`; no fictitious endpoint was configured. This search is not
a deployed API audit or proof about external services.

The mobile visual review also moved a direct email action into the unavailable
form notice, ahead of its disabled fields. Visitors can contact the team without
scrolling past the form. No mail was sent by the agent. Screenshot capture now
returns the viewport to the top after lazy images load, preventing a sticky
header capture artifact from obscuring page content in full-page review images.

- TypeScript checking passed.
- All 23 unit tests passed: content allowlists, all 15 chapter sources, manual
  links/anchors, search, publication requirements, URL safety, enquiry validation,
  delivery acknowledgement/failure behavior, downloads metadata, contrast and
  separation of information/enquiry/distribution/paid launch gates.
- The optimized production build passed, generating the public pages and
  server handlers. The standalone artifact was packaged and served locally.
- Browser tests passed against both the development review edition and the
  production standalone artifact. The public artifact excludes unapproved
  articles and their search results; the review edition exposes all 15 guides
  with clear draft labels.
- Browser checks covered the homepage plus 17 public routes; one H1 per page;
  desktop/mobile layout widths; search, zero results and role filters; manual
  heading destinations; mobile navigation, Escape and focus return; internal
  route rejection; and no uncaught browser JavaScript errors.
- Layout checks covered widths of 320, 390, 768, 1024 and 1440 pixels. Review
  article content was also exercised on mobile. Mobile workflow cards have an
  explicit non-overlap check.
- Actual HTTP checks confirmed 403 for a cross-origin enquiry, 422 for invalid
  fields, 413 for an oversized body and 503 when delivery is unconfigured.
  Production security headers were present, with no `unsafe-eval` permission.
- Brand reading pairs and primary button contrast exceed the 4.5:1 target;
  interactive control borders exceed 3:1 against their white/page surfaces.
- Desktop and mobile screenshots were visually inspected for the homepage,
  enquiry form and manual. Internal drafts were not copied into public assets.
- `npm ci --dry-run --offline --ignore-scripts` accepted the dependency lock.
  All 64 lockfile package records have integrity digests and platform-specific
  optional dependencies are retained for cross-platform installation.

Browser evidence is in `tmp/qa/`, including separate review and production
JSON reports, homepage/form screenshots and review-manual screenshots. These
are local verification artifacts and are ignored by source control.

## Issues found and corrected

1. The production-style CSP initially blocked webpack's development eval,
   preventing client interactions in the preview. Eval is now allowed only
   in development and explicitly checked to remain absent in production.
2. Workflow illustration cards overlapped too much on narrow screens. Mobile
   positioning was adjusted and the browser suite checks their geometry.
3. Input borders were too faint for the component-boundary contrast target.
   Controls now use a stronger border token, with a contrast regression test.
4. Contact retries needed stable identifiers without reusing an identifier
   for a changed enquiry body. The client now preserves IDs per unchanged body.
5. Article publication is maintained independently per slug in
   `src/content/manual-publication.json`; tests check the publication rule
   rather than requiring the manual to remain permanently unpublished.
6. Enquiry availability is evaluated at request time, allowing its server-only
   delivery endpoint to be configured at runtime instead of embedding service
   configuration into a prerendered form.

## External launch inputs still missing

`npm run check:launch` correctly reports missing HTTPS production origin,
approved seller name, public support/sales contacts, approved operational
manual articles, approved privacy/terms text, a real enquiry destination and
at least one complete approved app release. Review mode is disabled by default
in a production build.

Shared identity handoff needs the actual approved service URL and integration
verification. Live portal/billing screens, server-owned invoices, provisioning,
renewal, cancellation and route switching still depend on the real backend.
Safepay setup is deferred by the owner; contracted 1Bill remains required for
the planned full paid launch. No successful payment or account provisioning
is simulated by this website.

## Verification limits

- No production hosting/domain deployment, real enquiry delivery, live
  identity session, provider transaction or native POS workflow was exercised.
- Manuals are source drafts, not certified release walkthroughs. Printer,
  hardware, offline and operational instructions need their stated release QA.
- Docker and GitHub Actions definitions are supplied but were not executed.
- Registry access was restricted. Validation used matching locally installed
  dependencies; the lockfile was normalized/validated with npm. A clean network
  install and a current dependency advisory audit must run in deployment CI.
- The computer-use preview bridge failed to initialize; browser QA instead
  used Playwright's installed Chrome and direct screenshot inspection.
- This is targeted accessibility testing, not a full screen-reader or WCAG
  conformance audit. No Lighthouse performance scores are claimed.
- The intended Manrope heading font was unavailable. The stack uses a system
  fallback; Inter body text is self-hosted with its license. Add the approved
  Manrope font when available.
- Writes to the original root `README.md` were denied by the filesystem. The
  current setup and handover guide is `WEBSITE_README.md`; the original was
  preserved, and a historical copy is in `docs/ORIGINAL_WORKSPACE_README.md`.

The website implementation is ready for local review and service configuration.
Public launch and paid launch remain distinct, externally gated readiness states.

## 2026-10-24: Resend and Turnstile enquiry update

- Implemented Resend delivery to the two owner-selected recipients through
  server-only configuration, with email reply-to and phone-only contact handling.
- Kept origin, size, consent and field validation. Added mandatory server-side
  Turnstile verification with hostname/action matching, fail-closed errors and
  fresh challenge tokens on retries. Email idempotency remains stable for
  unchanged form data. CSP allows only the necessary Cloudflare origin.
- Published an enquiry-specific privacy notice using confirmed seller/contact
  facts and actual processors. The owner confirmed both mailboxes are controlled
  by the team and requested omission of a physical address because none exists.
  No fixed retention period or legal-compliance certification is invented.
- `npm test`: 40 tests passed, including multi-recipient requests, delivery
  failures, expired/replayed/wrong-host challenge handling and verification-before-
  delivery ordering. `npm run typecheck` and `npm run build:release` passed.
- Scanned production browser JavaScript: no private recipient address, Resend
  endpoint or test-secret markers were found.
- Added a production browser test with explicit synthetic provider fixtures.
  Automatic tool review rejected starting its local server with “blocked by
  policy”; this browser test was not executed. See `RESEND_SETUP.md` for the
  manual local test commands. No actual email was sent, and live keys, domain
  verification, challenge solving and receipt/reply in both inboxes were not
  verified. No deployment or delivery verification flags were changed.
