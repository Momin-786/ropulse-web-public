# Internal content evidence and publication checklist

Date: 2026-10-20. Audience: owner, website writer and release reviewers.
Exclude this file from the public help-center output, navigation and search.

## 1. Content package and source of truth

`docs/user-guide/` contains the editable, detailed customer chapters.
`docs/ROPULSE_PLATFORM_GUIDE.md` is their unified reading edition with the
feature catalog included. Make substantive edits in the chapters/catalog first,
then regenerate the unified edition; do not maintain contradictory copies.
`docs/WEBSITE_AND_PAYMENTS_PLAN.md` records the proposed website/commercial
journey. It is an internal plan, not customer contract text.

Review used the current Flutter `momin-dev` working tree, its navigation and
selected screens/controllers, the current context in `CLAUDE.md`, recent
September/October integration/design notes and the fetched offline branch refs
recorded in the SaaS design. Existing August user guides were used as historical
inputs and checked for stale claims. No application build, real browser journey,
live tenant mutation, provider payment, physical printer test or production
availability test was performed for this writing task.

The app's authoritative commercial handover is
`../../app/docs/superpowers/specs/2026-09-18-saas-licensing-packaging-tenant-lifecycle-design.md`
when resolved from this `web/docs` folder. It is maintained in the application
repository; do not fork commercial limits/policies in website code.

## 2. Evidence ledger

Paths below are relative to the sibling `app/` repository. “Present” means the
client area is represented in inspected source/inventory, not that an installed
production workflow was exercised. A source note marked design/pending must not
be promoted to shipped status just because it has detailed instructions.

| Area | Evidence to recheck at release | Publication treatment |
| --- | --- | --- |
| Login/invite/access | `src/auth/login_screen.dart`, `login_controller.dart`, router and providers under `packages/ropulse_backoffice/lib/` | Current workflow draft; recheck UI labels, enabled login methods and actual recovery/invitation delivery. |
| Branch/profile/staff/schedules | Backoffice `src/branch`, `src/staff`, auth roles and navigation | Current workflow draft; verify role/branch scope. Hybrid is designed but must be confirmed on the selected wire/runtime. |
| Catalog/modifiers/layout | `src/menu/master_menu_screen.dart`, product/modifier forms, `layout_designer_screen.dart` | Present; validate a fresh product-to-price-to-layout-to-sale walkthrough. Do not infer import capabilities from an export button. |
| Prices/tax/currency | `src/pricing`, `src/tax`, payment FX form; October 19 currency integration verification | Present client workflows; verify selected backend deployment and currency/policy details. No tax/legal certification claim. |
| Custom manual methods | October 20 custom-manual-payments integration note; `src/payments/payments_screen.dart` | Client integrated; note records new API implementation on backend development branch and remaining policy/migration fixes. Enable publication claim only for a backend release containing them. |
| Customer search/repeat | `src/crm/customer_detail_screen.dart`, register new-order flow; October 19 verification note | Current-price preview/recovery documented; verify deployed endpoints and an uncertain-response recovery. |
| Daily sales/corrections | `src/pos_shell` and order/refund controllers | Present; match actual permissions and supported order-type/charge behavior. No blanket claim that every sensitive action is offline-safe. |
| Restaurant/KOT | `src/tables`, floor plan, course controls, hardware/KOT clients; September 17 integration design | Document supported service setup; validate printer/station installation and actual physical routing before promises. |
| Receipt center/email | `src/receipts/receipt_center_screen.dart`, receipt/printer controllers | Print/PDF/history and enabled email are the described channels. Do not advertise SMS/WhatsApp delivery merely from old guide channel lists. |
| Gift cards/store credit | `src/gift_cards/gift_cards_screen.dart`/controller, checkout redemption | Administrative issuance and redemption documented conditionally. September 19 paid-register design is marked implementation pending; inspect final code/release before adding paid-sale instructions. |
| Loyalty/campaigns/feedback | `src/loyalty`, `src/marketing`, `src/feedback` | Present management areas; verify permissions, provider/channel readiness and actual message delivery independently. |
| Stock/ingredients/recipes | `src/retail/stock_screen.dart`, `src/menu/recipes_screen.dart`, ingredient/builder forms | Document adjust versus set and recipe costing. Do not claim procurement, warehouse transfer, supplier accounting or automatic consumption solely from these screens. |
| Shifts/reports/exports | Shift sheet/detail and reporting workspace; October currency note | Current report/export workflows replace August fixture-only descriptions. Verify totals, report scope, currency and real deployed data before capture. |
| Orders/approvals/audit | `src/orders`, `src/approval`, `src/audit`, void/anomaly screens and router | Present; verify links and the difference between approval and execution. |
| Staff meals/search/notifications | `src/staff/staff_meals_screen.dart`, global search, router notification slots | Document existing tools; do not invent the deliberately unbuilt Notifications Setup card. |
| Hardware/readers/display | `src/hardware`, receipt printer, native plugins | Platform-dependent; test released device/driver/printer combinations. A scanner interface is not a finished custom scanner plugin. |
| Offline/LAN/native startup | `origin/kashifkhn-dev` `6342b7c`; fuller `origin/feat/complete-offline-deployment` `6f87ca4` | Release-gated. Source contains substantial offline work but integration, trust, Windows channels and recovery require verification. |
| Browser Backoffice | Missing `web/` target and native startup imports in reviewed app; SaaS sections 28–31 | Release-gated website-to-app claim. Hosting marketing/docs does not make the Flutter app browser-ready. |
| SaaS pairing/leases/automatic billing | SaaS handover sections 28–32; current identity/branch evidence remains the review baseline | Runtime pairing and lease work are not certified deployed. Owner now requires shared subscriber accounts, Safepay recurring and 1Bill automation for paid launch; no manual collection fallback. |
| Website accounts and billing portal | Updated website plan, user-guide chapters 13 and 15, licensing section 32, official Safepay/1LINK research | New requirements/draft instructions, not a live portal claim. Verify signup/membership, both first/renewal payments, actual provider cancellation, route switching, event replay and idempotent fulfilment before public release. |
| Kitchen display/drive-thru/provider fiscal integrations | Actual selected release/capability contracts required; older docs/designs conflict or defer these | Do not publish general availability from a route name, screenshot mockup or old roadmap. |

## 3. Public article structure and editorial rules

Each released task article should have the intended reader, platform/profile
scope, permissions/prerequisites, explanation, numbered steps, expected outcome,
worked example where useful, troubleshooting and related tasks. Long chapters
can be split by task when building the renderer, retaining stable redirects and
one source for shared text. Search should find both ordinary terms and the
actual UI labels, for example “park order” and “Held orders”.

Keep API paths, branch names, signing flags and backend migration notes out of
customer pages. Describe an unavailable behavior plainly in its own scope;
avoid scattering implementation commentary through every procedure. Do not
publish invented platform minimum versions, support SLAs, processor methods,
prices or service availability. Use actual release/contract facts.

Capture screenshots from seeded non-sensitive data on the selected release.
Use useful alt text/captions, a consistent viewport and readable annotations.
Capture the state produced by the action, not only an empty form. Never use
customer personal information, actual credentials or financial secrets.

## 4. Screenshot and walkthrough capture list

| Capture | What it must establish |
| --- | --- |
| Staff/admin login and invitation | Supported access modes, actual labels and successful acceptance. |
| Branch and staff/roles | Branch context and intended role setup. |
| Product/modifier setup | A saved product with valid options and a usable selling price. |
| POS layout and actual Register | Published configuration matches the selected branch/device. |
| Payment setup/reference policy | Effective custom/built-in rule appears correctly at checkout. |
| Retail sale and customer repeat | Correct variant/quantity and a current preview rather than historical prices. |
| Table/course/KOT | Intended round, actual job state and real preparation destination. |
| Split tender and completed receipt | Amount/currency/evidence and immutable sale reference agree. |
| Receipt setup/history/reprint | Scope, preview versus real document and copy status. |
| Refund/void approval | Request, decision and final execution are distinct and traceable. |
| Customer/loyalty/gift balance | Correct identity and before/after transaction state. |
| Stock adjust/set and recipe | Relative versus absolute quantity and actual recipe units. |
| Shift close/reconciliation | Count, expected amount and explained variance. |
| Reports/exports | Real branch/date/currency selection and complete versus failed data. |
| Printer/peripheral diagnostics | Real supported device and physical output where applicable. |
| Offline/reconnect readiness | Only after integration; show prerequisite failure and eventual cloud convergence. |
| Purchase-to-onboarding | Verified owner account, authoritative offer, automated Safepay and 1Bill confirmation, fulfilment status and actual account activation; no normal operator payment approval. |

## 5. Publication gate

Before a page or marketing claim is public, record its reviewer/date, source
release, supported platform/profile and any feature gate. Have someone other
than the original writer follow the task with the intended role. Check links,
search results, headings, accessibility and mobile reading. Verify that
internal plans/ledgers and gated drafts are excluded from public build/search.

The unified guide and chapter files are written text drafts. They are useful
for content review and staff preparation, but screenshot capture and installed
release walkthroughs remain required before calling them a verified production
manual. Record changes per product release and review affected articles whenever
labels, permissions, financial behavior or supported platforms change.

## Automated billing revision

The owner selected Safepay recurring subscriptions until cancellation or a valid payment/authorization stop, plus 1Bill collection with automatic verification and service-period fulfilment. A verified website account is required for checkout and billing control, using the shared identity service. The initial manual collection recommendation has been superseded. Chapters 13 and 15 are release-gated customer instructions. Ordinary 1Bill payment still needs customer authorization in a supported channel unless the contracted service explicitly provides an additional debit mandate. Merchant enablement, API details and real release evidence remain required.

