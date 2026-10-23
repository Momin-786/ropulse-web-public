# Website content and publication

## Sources and exposure

`docs/user-guide/` remains the canonical manual source. `src/lib/manual-manifest.mjs`
explicitly maps each chapter to a stable URL, title, group and publication record.
The renderer never lists arbitrary repository documents. Internal plans, this
guide, the publication evidence ledger and brand extraction are not public routes.

Local development defaults to review mode if `DOCS_REVIEW_MODE` is unset.
Explicit `true` enables review mode in a deliberate review build; explicit
`false` disables it. The owner subsequently approved public draft manuals.
`DOCS_PUBLIC_DRAFTS=true` (default) makes all 15 allowlisted chapters readable
with draft labels, noindex, and planned-billing notices where applicable. This
does not approve their operational release status or disable indexing for the
rest of the site. Set both flags false for approved-only manual routes. Site-wide
review mode still disables all indexing. A robots directive is not access control.

The original guide files are read-only in this workspace. The versioned
`src/content/manual-illustrations.json` layer adds task-specific screenshots and
device-layout explanations before Markdown parsing. It never changes the source
files or their reviewer/release records. `product-captures.json` is the exact
asset allowlist; remote or arbitrary Markdown images are not rendered. The
figures include sample-data context and a native enlarge dialog with Escape,
close-button and focus-restoration behavior.

All 13 operational chapters now include real app screens. Numbered instructional
arrows are code overlays from `src/content/screenshot-callouts.json`; the original
PNG files remain unchanged. Each arrow has a matching text instruction below
the image and inside the enlarged dialog. The two planned account/billing
chapters use an explicitly labelled concept diagram, because live portal
screens do not exist here. Do not present that diagram as a working service.

## Publish a guide

1. Follow the actual task in the chosen product release, role and platform.
2. Correct the source chapter and validate screenshots with non-sensitive data.
3. Record `status: 'published'`, a real `reviewer`, ISO `reviewedAt` date and
   actual `release` for that slug in `src/content/manual-publication.json`.
4. Verify limitations and feature gates. Chapters 13 and 15 remain labelled
   planned/review instructions until the account/billing release is verified.
5. Run `npm test`, preview with `DOCS_REVIEW_MODE=false`, then rebuild. Check
   headings, navigation, search, related links and mobile reading.
6. Regenerate the unified reading edition after substantive chapter changes.
   It is a review convenience and is not another independent public manual.
   Run `node scripts/generate-review-manual.mjs` to update
   `docs/WEBSITE_MANUAL_REVIEW.md`, including screenshot captions and guidance.

Known `.md` chapter links map to their public descriptive slug. If the linked
chapter is not available in the selected mode, the link returns to the manual
overview. Old chapter filenames under `/docs/` redirect to an available
descriptive slug; unavailable chapters return 404.

Markdown HTML is not executed or rendered. Links permit HTTPS, mail links,
local routes and fragments. JavaScript/data/protocol-relative links are
discarded. The sources currently use text, lists, headings, tables and links.
Approved capture paths render through the explicit local image allowlist.
Other images display their alt text without fetching arbitrary sources.

## Product copy

`src/app/page.tsx` owns the homepage. `src/app/[page]/page.tsx` owns focused
public pages. Shared marketing components are in `src/components/marketing.tsx`.
Do not claim general availability for proposed Kitchen displays, Kiosk, QR,
online storefronts, procurement or universal offline operation. Preserve the
provided logo artwork.

## Policies

Approved policies live in `src/content/policies.json`: `body` is Markdown,
`approved` controls publication and `reviewedAt` records review. Empty records
intentionally do not invent seller identity or terms. Privacy approval, seller
configuration and a valid server delivery endpoint are required before online
enquiry submission is enabled.

## Downloads

`src/content/releases.json` is an array of approved release records. Each entry
requires `platform`, `version`, ISO `publishedAt`, verified `requirements`,
release `notes`, an HTTPS `url` and the actual installer's 64-character `sha256`.
Incomplete entries are excluded. Verify signatures and hashes using the actual
released artifact, and never invent supported OS requirements.

## Fonts

Inter is self-hosted as a 78 KB Latin WOFF subset with its OFL license included.
The heading stack requests Manrope and uses a system sans-serif fallback because
no Manrope asset was supplied and network retrieval was unavailable. Add an
approved licensed local Manrope asset and its `@font-face` rule in
`public/fonts/fonts.css` to finalize that face. No external font requests occur.
