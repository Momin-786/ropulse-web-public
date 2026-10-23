# RoPulse launch website design

Date: 2026-10-20
Status: approved by owner; implementation authorized.
Scope: website implementation in this workspace. Safepay setup is deferred.

## 1. Accepted brand decisions

Use the client PDF's interface colours: plum `#35102F`, magenta `#D60068`,
warm white `#FAF8FB`, lavender `#EEE7F2`, ink `#241D29`, muted `#665B6B`
and border `#D8CEDD`. Preserve the provided SVG/PNG logos without recolouring
or redrawing them. Use Manrope headings and Inter body text, locally hosted
when font assets can be obtained. Retain a readable sans-serif fallback.

Lead with restaurants, with a separate retail solution page. Advertise only
capabilities supported by the selected release. The PDF's proposed modules
are design direction, not evidence of shipping functionality.

## 2. Purpose and audience

Help a restaurant or retail owner understand RoPulse, evaluate its operating
workflows, request a demo, prepare a first branch and find practical user help.
Provide a maintained entry point for released applications and future shared
RoPulse account/billing services.

Public pages are readable without authentication. Native Register installation,
browser Backoffice availability and subscription purchase are separate journeys.
The site must explain their actual supported availability without implying
that the marketing website runs the POS.

## 3. Architecture

Use Next.js App Router with TypeScript and a single shared design system.
Prefer server-rendered/static public content with small client components for
navigation, search and forms. Use CSS for styling and restrained transitions.
Keep dependencies focused; avoid a general UI framework for the marketing shell.

Markdown remains the manual's editable source. A server-only content module
reads a literal allowlist of public article files, extracts headings and text,
rewrites known manual links and returns safe rendered content. Do not enable
arbitrary Markdown HTML or execute MDX. Filesystem paths never come directly
from route parameters. Unknown slugs return a proper 404.

Organize responsibilities into site configuration, marketing components,
documentation parsing/manifest, search, contact delivery and backend integration
boundaries. Keep request-specific data out of shared mutable module state.

## 4. Routes and content

| Routes | Experience |
| --- | --- |
| `/` | Brand introduction, Register/Backoffice distinction, operating workflows, setup journey and demo invitation. |
| `/restaurant`, `/retail` | Audience-specific problems, supported workflows, relevant guides and focused next steps. |
| `/features` | Catalog, ordering, payments/receipts, team, stock/recipes and reporting; release-specific limits stay visible beside the relevant feature. |
| `/pricing` | Explain package structure and quantities without invented amounts; paid purchase remains unavailable until approved offers and backend contracts exist. |
| `/get-started` | First-branch preparation sequence with direct links into the manual. |
| `/demo`, `/contact` | Accessible enquiry form with real delivery status when configured. |
| `/support` | Task-based recovery links and configured support contact. |
| `/downloads`, `/release-notes` | Approved versioned installers/store destinations only; explicit empty state until release records exist. |
| `/docs`, `/docs/[slug]` | Role/task navigation, article search, table of contents, heading links and related guides. |
| `/login`, `/signup`, `/account` | Real configured shared-identity handoff when available; otherwise an honest availability state without collecting credentials. |
| `/legal/terms`, `/legal/privacy`, `/legal/billing-refunds` | Approved policy content when supplied; no invented legal identity or claim that draft text is approved. |

The full billing routes from `WEBSITE_AND_PAYMENTS_PLAN.md` remain the target
for subsequent backend integration. They must not be implemented as simulated
financial records or successful payments in this public-site milestone.

## 5. Visual composition

Use a warm-white editorial layout with a plum brand shell and magenta primary
actions. Desktop content has a maximum width of 1280 px. The hero uses the
headline "Every order. One pulse.", clear supporting text, a demo action and
an explore-platform link. A broad cropped curve derived from the brand's flow
provides a restrained signature motif. Preserve generous logo clear space.

Show the connection between taking an order, serving it, recording payment
and reviewing the business through labelled workflow visuals. Do not fabricate
screenshots of implemented software. Any illustrative interface is explicitly
labelled as a concept; prefer workflow diagrams until real screenshots exist.

Alternate spacious text-led sections with focused workflow panels. Use short
headings and concrete explanations rather than a wall of generic feature
cards. Avoid fabricated social proof, unsupported performance metrics and
unverified partner logos. Footer includes product, manual, support and policy
destinations, with seller details drawn only from approved configuration.

On narrow screens, stack hero content and workflow panels; provide a labelled
mobile menu, reachable primary action and collapsible documentation navigation.
Long article tables may scroll inside a labelled region without widening the page.

## 6. Documentation publishing and search

The user-guide chapters remain canonical. The unified platform guide is a
reading edition, not a second editable content source. Public articles use
stable descriptive slugs and preserve old chapter-file links through a known
mapping. Each article has a page title, task context, heading anchors, related
tasks and a print-friendly layout.

Create a publication manifest covering all 15 chapters. Default operational
articles to review status until their release walkthrough is recorded. The
site's local review mode may show all chapters with clear draft/review labels;
production output and search include only explicitly approved articles.
Chapters 13 and 15 remain gated on the account/billing release. Review-only
content is excluded from public route generation, sitemap and search index.

Search runs over the published article title, headings and body text. Rank
title/heading matches ahead of body matches, show contextual snippets and
provide a helpful zero-result state. Queries remain on the device. Search
results must not expose internal plans, unpublished chapters or filesystem paths.

## 7. Forms and service boundaries

Demo fields: name, business contact, business name, country and branch count.
Use persistent labels, clear required fields, bounded lengths and server-side
validation. Explain follow-up and link the actual privacy information. Do not
show a submission-success state unless a real destination acknowledges delivery.

Contact delivery uses a configured server-side endpoint with timeout handling
and an origin check; keep endpoint secrets server-only. If unavailable, show
the configured contact alternative and a truthful unavailable state. Prevent
repeat submissions while processing. Do not send enquiry data to an arbitrary
browser-supplied URL or keep it in browser storage.

Account links use configured HTTPS destinations with validated return paths.
Do not create a separate password database, copy login tokens into URLs or
collect card data. Shared identity, memberships, authoritative invoices,
provisioning, renewal and cancellation stay owned by the existing backend.
Safepay and 1Bill require their contracted server integrations before paid launch.

## 8. Configuration and unavailable states

Centralize site URL, support/sales contacts, identity destination and approved
download releases. Commit an environment example with variable names and setup
instructions, never credentials. Validate URL schemes and configuration before
using them. Provide a launch-readiness command that reports missing production
inputs and fails when required inputs for the selected launch mode are missing.

No missing service may silently become a mock success. Avoid dead navigation:
unready routes explain availability and provide a working next step. Empty
downloads state explains that an approved installer has not been published.
Unapproved policies remain review content and block live enquiry/payment flows
that require them; do not present unsigned draft policies as final contracts.

## 9. Quality and security acceptance

- Keyboard-accessible navigation, search and forms; skip link, visible focus,
  appropriate landmarks, labels, error associations and live feedback.
- WCAG 2.2 AA contrast targets, at least 44 px touch targets, reduced-motion
  support and usable layouts at mobile, tablet and desktop widths.
- Validate Markdown links and heading IDs; enforce content allowlists and test
  that internal/unpublished documents cannot be reached or searched.
- Cover contact validation, upstream timeout/failure, unconfigured delivery,
  safe URL handling and repeated-submission prevention.
- Verify route status codes, page titles, canonical URLs, robots and sitemap;
  preview/review builds stay out of indexing. Private/account responses cannot
  enter public caches or search.
- Apply appropriate security headers. Keep secrets and source documents out
  of public assets and client bundles. Avoid unnecessary third-party scripts.
- Run type checking, relevant unit tests, production build and browser tests
  for mobile navigation, documentation search and form states. Inspect actual
  rendered desktop/mobile pages before calling visual QA complete.

## 10. Delivery and production handover

Deliver implementation source, dependency lockfile, scripts, environment example,
setup instructions, content publication guide, deployment/rollback runbook and
an evidence-based QA report. Retain source brand files and client guidelines.

Website code can be completed and tested locally before merchant setup. Public
launch additionally needs approved company/contact/policy details, hosting/domain
configuration, released app links and publication-reviewed content. Full paid
launch also needs shared identity, approved prices, both payment routes and
end-to-end backend verification. Report these as distinct readiness states.

This design does not authorize inventing production data, replacing the Flutter
application, silently dropping 1Bill or claiming that unavailable integrations
work. It provides the website foundation and explicit service boundaries.
