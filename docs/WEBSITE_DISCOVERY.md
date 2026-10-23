# RoPulse website discovery and decisions

Reviewed: 2026-10-20. Status: discovery complete; brand resolutions approved by owner.
This is an internal document, excluded from the future public website.

## Sources reviewed

- Repository README and website/payments plan.
- Feature catalog, publication evidence ledger, user-guide home and all 15 chapters.
- Unified platform guide (combined edition of the catalog and chapters).
- All 21 pages of extracted client brand guidance; selected pages visually rendered.
- Launch brand-kit README, asset inventory and visual brand preview.

The repository has content and brand assets, but no website implementation,
package manifest, test suite or deployment configuration. It is not currently
a Git repository. Existing operational articles are release-review drafts;
their existence does not certify a deployed product workflow.

## Brand conflicts and approved resolutions

| Topic | Client PDF | Existing source | Recommendation |
| --- | --- | --- | --- |
| Interface palette | Plum #35102F, magenta #D60068 | Kit approximates plum #340A30 and pink #F20E71 | Use PDF tokens for interface elements and preserve supplied logo artwork unchanged. |
| Positioning | Restaurant platform, restaurant tagline | Product plan includes restaurant and retail | Lead the homepage with restaurants and retain a separate retail solution page and relevant manual chapters. Confirm with owner. |
| Module navigation | Kitchen, Order, Kiosk, QR, Inventory, Insights | Evidence ledger gates several modules and explicitly excludes unsupported inventory claims | Publish only verified capabilities; treat the PDF module list as a future architecture rather than general availability. |
| Commercial actions | Book a demo as primary conversion | Existing plan requires automated account and paid purchase journeys | Prepare demo conversion now and retain future account/billing routes; enable paid actions only after their contracts and provider verification are ready. |

User's current instruction defers Safepay setup. This permits preparing the
site independently; it does not establish provider readiness or remove 1Bill
from the accepted billing requirements.

The owner approved PDF interface colours with unchanged supplied logos,
restaurant-led positioning with a separate retail page, and publication of
verified capabilities only. The detailed design is recorded in
`superpowers/specs/2026-10-20-ropulse-launch-website-design.md` for review.

## Website approaches to review

1. **Recommended: one Next.js application with Markdown content.** Marketing,
   searchable manual and future server-backed account pages share navigation,
   brand components and deployment. It supports the accepted portal scope,
   but requires an application host and careful public/private caching.
2. **Astro content site plus a separate account application.** Strong fit for
   mostly static marketing and manuals; introduces two applications and shared
   navigation/session integration work when billing is added.
3. **Static marketing and help center first.** Small deployment footprint;
   requires a later portal implementation to fulfil the full existing plan.

## Proposed visual direction for review

Use the supplied SVG wordmark and RP favicon, generous warm-white surfaces,
plum navigation/footer, restrained magenta actions, Manrope headings and Inter
body text as requested by the client PDF. A single flowing pulse motif supports
the headline "Every order. One pulse." Keep long manuals quiet and readable.
Preserve minimum logo sizes and clear space. No continuous decorative motion.

Homepage story: introduction, verified Register/Backoffice workflows,
restaurant operations, catalog/stock scope, reporting, first-branch setup and
demo invitation. Actual screenshots require the selected product release;
any concept illustration must be labelled. No invented customer logos,
testimonials, performance figures, prices or download links.

## Proposed delivery sequence

1. Resolve brand conflicts and approve the written website design.
2. Implement responsive public pages and the searchable Markdown manual.
3. Add demo/contact handling, approved release downloads, site configuration,
   SEO and deployment/runbook documentation.
4. Prepare account/billing boundaries against the actual shared backend
   contract. Keep unavailable integrations visibly unavailable.
5. Verify desktop/mobile layouts, keyboard use, contrast, search, internal
   links, content isolation, form validation, error paths and production build.
6. Connect identity and payments when their real services are available, then
   verify authorization, renewal, cancellation and duplicate-event recovery.

## Release dependencies and practical limits

Owner inputs still needed before public launch: approved seller identity,
support/contact destination, domain/host, released product assets and links,
approved pricing and policies. Shared identity and invoice/provisioning
contracts belong to the existing backend. No separate website password
database should be created.

Public manuals must be selected through an explicit publication manifest;
internal plans and the evidence ledger must never enter routes or search.
Chapters 13 and 15 depend on the billing release. Operational screenshots and
role-based walkthroughs remain necessary before describing the manual as
production verified.

A reliable completion date for the full paid launch needs the approved scope
and backend/provider readiness. Public site implementation can proceed before
Safepay setup after design approval. Building a marketing site alone does not
make the native Flutter Register browser ready.

## Artifacts created during discovery

- `docs/BRAND_GUIDELINES_EXTRACTED.md`: all 21 PDF pages converted to readable
  Markdown with repeated headers, footers and excessive spacing removed.
- `tmp/pdfs/brand-page-*.png`: selected rendered pages for internal visual review.

## Discovery checks

The converted document must contain exactly 21 numbered page headings, retain
the palette/type/website/handoff guidance and identify image-only concept
pages. Visual concepts remain in the PDF; text extraction cannot replace them.
Website functional tests are not applicable yet because implementation has
not started.
