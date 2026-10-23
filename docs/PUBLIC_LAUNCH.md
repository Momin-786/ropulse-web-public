# Public launch handoff — RoPulse

## Confirmed by the owner

- Product: Ropulse. Country: Pakistan.
- Credit: Developed by Ebosoft Solutions.
- Contracting seller: Ebosoft Solutions, confirmed by the owner after the initial handoff.
- Support hours: 10 AM–10 PM, displayed in Pakistan time. Working days were not specified.
- Hosting: Vercel.
- Domain: `ropulse.io`, confirmed in `../app/docs/Ropulse_Flutter_Frontend_Spec.md`.
- Intended support address: `support@ropulse.io`, formed from the owner's instruction and documented domain. Actual mailbox delivery has not been verified.
- Safepay will be configured later. Public subscription checkout stays disabled.

The business/postal address, seller registration details where applicable,
support working days, sales contact, offer prices and policy decisions are
still missing. Do not invent these or mark policies approved.

## What can launch first

A public information website can launch before payment integration. It can show
features, real app previews, setup preparation, and a verified support address.
Online enquiries need their own durable receiving service and approved privacy
notice. Installer distribution needs a signed/reviewed release and operational
manual review. Paid subscriptions need the shared account and provider backend.

Run the matching check after configuring the real environment:

```powershell
npm run check:launch -- site
npm run check:launch -- enquiries
npm run check:launch -- distribution
npm run check:launch -- paid
```

Verification flags in `.env.example` are evidence records, not feature switches.
Keep them false until the associated checks have actually been completed.

## Remaining release work

| Item | Required completion |
| --- | --- |
| Dependency security | Install a patched Next.js release; run clean install, audit, build and browser CI. This session's download was denied by network policy. |
| Seller and policies | Seller is Ebosoft Solutions. Supply business address and policy decisions; review and populate `src/content/policies.json`. |
| Support mailbox | Create/verify `support@ropulse.io`; test inbound mail and replies. No mail was sent in this session. |
| Vercel | Connect source/project, configure environment, deploy preview, verify, attach domain and promote. See `VERCEL_DEPLOYMENT.md`. |
| Enquiries | Connect the durable endpoint, verify idempotency/failure recovery and configure edge abuse controls. |
| User manual | Owner-approved public draft guides now show all 15 chapters with labels/noindex and real screenshot figures. Complete release-specific walkthroughs before marking them approved or distributing as certified instructions. |
| POS downloads | Supply approved installers, SHA-256, supported devices, signing information and release notes. Old local development executables are not approved installers. |
| Shared account | Verify and configure the actual shared identity destination. A suggested `app.ropulse.io` is not proof of a live account service. |
| Paid launch | Approved offers, taxes/terms, provider webhooks, provisioning, renewal, cancellation and recovery tests. Safepay remains deferred. |

## Security update required before deployment

The tested local dependency was Next.js 16.3.1 with an outdated sharp image library.
The release guard validates declared, locked and installed versions; changing
only package metadata cannot pass it. The official registry reported
16.4.2 during this session. Official October 14 advisories identify 16.4.1 as a
patch release for image optimization and typed-array cache vulnerabilities:
[image optimization advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw),
[cache advisory](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr).
Do not deploy the current dependency set. On a registry-enabled build machine:

```powershell
npm install --save-exact next@16.4.2
npm ci
npm audit --omit=dev
npm run typecheck
npm test
npm run build
```

Resolve any newly reported advisories, then run the production browser suite.
Commit the resulting manifest and lockfile together. Neither a successful local
build nor these instructions certify the uninstalled updated version.

## Actual app screenshot evidence

Sixteen app screenshots were produced from an isolated source snapshot:
six Register/floor/checkout captures and ten Backoffice captures.
They contain seeded sample data, no tenant credentials or customer records.
The original sibling app was not edited. Provenance and hashes are recorded in
`src/content/product-captures.json`. Capture commands:

```powershell
node tools/capture-app/prepare.mjs
node tools/capture-app/checkout-overlay.mjs
cd tmp/app-capture
flutter test --no-pub --dart-define=SAVE_REGISTER_PREVIEWS=true test/register_redesign_test.dart test/pay_test.dart
cd ../..
node tools/capture-app/publish.mjs
node tools/capture-app/publish-checkout.mjs
node tools/capture-app/prepare-backoffice.mjs
cd tmp/app-capture
flutter test --no-pub test/website_backoffice_capture_test.dart
cd ../..
node tools/capture-app/publish-backoffice.mjs
```

The original 59 rendering/payment widget tests passed; all 43 payment tests
also passed after the isolated checkout capture adjustments. The website uses
Register light, Register dark, mobile Register, floor-view and two checkout
images. Development banners are disabled in the capture harness, without
editing the sibling app. These renders verify interface
presentation; they do not verify a production backend, device or payment provider.

The nine-screen Backoffice capture suite passed, followed by a separate passing
Orders capture. Its capture harness specifies Segoe UI to avoid the Flutter test
font's placeholder boxes, including chart and dropdown labels. The interface
uses the real app widgets and seeded repositories. Thirteen operational chapters
have screenshots with numbered code overlays and matching instructions. The
two planned account/billing chapters use an explicitly labelled concept diagram.
