# RoPulse launch website, automated billing and customer documentation plan

Date: 2026-10-20

Status: Updated requirements and implementation plan. The owner selected
automated Safepay subscriptions and 1Bill collections, with website customer
accounts. This document does not assert that merchant accounts, payment APIs,
website UI or production billing are already implemented.

## 1. Accepted direction and scope

RoPulse's website will explain the product, sell approved subscription offers,
provide a subscriber account/billing portal, distribute released apps and host
detailed user documentation. The owner and Codex own the website/content work;
Backend and Flutter teams implement their shared platform responsibilities.
Appearance, theme and logo remain for the later design discussion.

The owner has replaced the earlier assisted/manual collection proposal:

- Safepay is the selected recurring subscription route. After explicit customer
  consent, supported recurring charges continue on the agreed schedule until
  cancellation, payment failure/mandate loss or another legitimate stop.
- 1Bill is an additional subscription invoice collection route. Bill creation,
  payment verification, receipts and subscription activation/renewal are
  automated. Customer payment initiation through a bank/channel is distinct
  from the system's automated processing; do not promise automatic bank debits
  without an enabled, contracted mandate capability.
- There is no bank-transfer screenshot, operator payment-approval step or manual
  subscription activation as the normal paid purchase/renewal flow.
- Visitors can browse product pages, prices and public docs without signing up.
  Purchasing, private invoices, subscription control and cancellation require a
  verified subscriber account with the appropriate business billing authority.
- Marketing, website billing and Backoffice use one shared RoPulse identity
  contract. Do not build a separate website password database or reuse the
  restaurant's customer-directory records as SaaS subscriber accounts.

Pakistan/PKR remains the working market/currency. Selecting Safepay and 1Bill
approves the product direction, not an unconfirmed merchant account, live key,
biller prefix, negotiated fee or public RoPulse price. The old PKR price
hypotheses in historical documents must not become live checkout totals.

## 2. Reference research and documentation approach

Official public pages were inspected on 20 October 2026. Borrow organization
and teaching patterns, write original instructions and use actual RoPulse UI.

| Reference | Observed pattern | Application to RoPulse |
| --- | --- | --- |
| [SambaPOS knowledgebase](https://kb.sambapos.com/en/) | Searchable groups for installation, hardware, usage, customization and reports. | Searchable tasks with a clear first-branch setup sequence. |
| [SambaPOS setup sequence](https://kb.sambapos.com/en/2-2-0-step-by-step-sambapos-setup-and-installation-process/) | A guided setup journey links individual configuration tasks. | Explain prerequisites and expected results; use RoPulse's own installation architecture. |
| [Invo POS FAQ](https://www.invopos.com/faqs-page/) | Buyer-oriented questions about branches, permissions, offline operation and reporting. | Buyer FAQ alongside detailed operational documentation; the inspected FAQ is not a complete task manual. |
| [Odoo POS documentation](https://www.odoo.com/documentation/19.0/applications/sales/point_of_sale.html) | Workflow, products, hardware, retail/restaurant, payments and reporting groups. | Separate reading paths by business task and role without importing Odoo feature claims. |
| [Square setup guide](https://squareup.com/help/us/en/article/5123-square-get-started-guide) | Identifies reader, prerequisites and an ordered account/setup journey. | Detailed steps, outcomes, examples and troubleshooting, written for the actual person doing the task. |

## 3. Website structure and account pages

Routes below are the intended information architecture, not deployed URLs.

| Route | Required behavior/content |
| --- | --- |
| `/`, `/restaurant`, `/retail`, `/features` | Explain supported product capabilities and fit, with truthful release/platform/hardware limits. |
| `/pricing` | Approved Starter/Growth/Scale offers, billing cycle, branch/terminal quantities, add-ons, taxes and one-time services. **Subscribe** starts the authenticated purchase flow. |
| `/signup`, `/verify-email`, `/login`, `/forgot-password` | Shared identity flows, verification, safe recovery and session handling. Existing owners sign in; they do not create another business to renew. |
| `/checkout` | Authenticated offer selection/review, authoritative invoice, billing identity, terms, payment route and recurring consent where applicable. |
| `/checkout/status` | Display server-confirmed progress: awaiting payment, verifying, payment received, provisioning, ready or action required. A redirect alone cannot mark paid. |
| `/account` | Business/workspace selector, onboarding progress and direct entry to Backoffice when authorized. |
| `/account/subscription` | Package/quantities, status, paid-through date, upcoming renewal amount/date, billing mode, cancellation state and supported plan-change actions. |
| `/account/invoices` | Owned subscription invoices, payment receipts, outstanding balances, credit/refund state and authorized download. |
| `/account/payment-method` | Safepay-hosted supported payment-method update or the explicit switch-to-1Bill flow; no raw card/CVV storage in RoPulse. |
| `/account/1bill` | Current invoice's provider-issued payment number, exact amount/currency, due date, status and how to pay; create/recover the bill idempotently. |
| `/account/cancel` | Clear self-service renewal cancellation, effective service-end date, provider-confirmation status and confirmation receipt. No support-call requirement for ordinary cancellation. |
| `/get-started`, `/demo`, `/contact`, `/support` | Product help, optional assisted onboarding and enterprise/pilot enquiries. Sales assistance does not replace automated payment verification. |
| `/downloads`, `/release-notes` | Released signed installers/store links, versions, requirements, hashes and safe update instructions. |
| `/docs` | Searchable, role-based detailed customer manual; public output excludes internal ledgers and unverified drafts. |
| `/legal/terms`, `/legal/privacy`, `/legal/billing-refunds` | Approved seller identity, recurring authorization, cancellation/refund/data terms and actual support information before checkout is enabled. |

The application host remains the shared Flutter Backoffice host, proposed
`app.ropulse.io`. The public domain/account paths can link into it through the
shared identity service. Actual domain ownership/hosting and secure session
handoff are implementation inputs, not assumptions of an existing SSO system.

## 4. Customer identity and account creation

### 4.1 Why an account is required

A subscription owner needs a persistent, protected place to see purchases,
identify a business, pay a renewal, recover an interrupted checkout, change
billing route and cancel future charges. The plan therefore requires an
account before payment. Reading public documentation or sending an enquiry
does not require an account.

Use one stable identity principal, with verified email and business memberships.
Commercial subscriber identity is separate from a POS shopper/customer and
from the privileges of a Platform administrator. A subscriber never receives
operator-console permissions merely by paying for RoPulse.

### 4.2 Signup before tenant provisioning

1. A visitor chooses a plan/cycle and is asked to sign in or create an account.
   Preserve their non-sensitive offer selection through that flow.
2. The identity service creates a lightweight pending subscriber profile and
   sends a single-use, expiring email-verification link. Validate the contact,
   rate-limit signup/resends and protect recovery against account enumeration.
3. After verification, collect the intended business/profile/workspace details
   and billing identity. Workspace/email-domain rules remain authoritative:
   a Gmail domain is not a tenant identifier.
4. Check existing business memberships and pending purchases. An existing owner
   renewing or adding a terminal chooses that business; the server must not
   provision another tenant because the owner repeated checkout.
5. Do not create a Neon tenant database, paid entitlement or terminal slot on
   every anonymous signup. Successful payment or approved pilot authorization
   starts the existing idempotent provisioning/activation pipeline.
6. Bind the verified subscriber principal to the owner membership during secure
   activation. Retain one password/recovery authority and an explicit supported
   SSO/session exchange for website and Backoffice. Existing owner accounts need
   verified migration/linking; matching an email string alone is insufficient
   proof for taking over another business.

If the current tenant-local authentication cannot represent a pending global
subscriber, Backend must add the identity/membership contract before the portal
ships. The website must not work around it with a competing users table or by
copying passwords/tokens between hosts. Cashier PIN and terminal pairing remain
their distinct operational/device flows.

### 4.3 Account security and authorization

Billing pages require the signed-in principal and server-checked membership/
billing permission for every invoice, subscription and payment request. A
reference in a URL is a locator, not authorization. Keep account responses out
of public/static caches and search; validate return URLs and CSRF where sessions
use cookies. Prefer the approved secure same-site/session exchange rather than
passing reusable login tokens through query strings.

Use step-up verification for sensitive billing-owner/contact changes and other
high-risk actions. A business can delegate billing access only through a
permissioned membership action. Staff with ordinary customer-directory access
must not see the owner's SaaS payment instruments or cancel the subscription.

## 5. Purchase, fulfilment and renewal journey

1. Signed-in verified owner selects an approved plan version, branch/terminal
   quantities, add-ons and cycle. The server validates availability/limits and
   returns immutable line items, discounts, applicable tax, currency and total.
2. The owner reviews the seller, terms, first charge, next due date and exact
   billing mode. Safepay automatic renewal needs explicit recorded consent;
   selecting 1Bill describes invoice generation and the need to authorize each
   bill payment unless an actual approved mandate service is introduced.
3. Backend creates one pending purchase/invoice and a provider attempt. It
   generates the hosted Safepay session or the provider-issued 1Bill number from
   server-owned amount/currency. Client-submitted totals cannot set the price.
4. Customer completes the chosen provider flow. The website shows pending/
   verifying until Backend receives authenticated provider evidence or performs
   an authenticated status lookup. No receipt-upload/payment-approval step exists.
5. Backend records one confirmed financial payment and its allocation to the
   invoice, then runs a durable activation/provisioning job. A lost event or
   failed job retries automatically against the original identity; it cannot
   create another tenant or extend service twice.
6. During provisioning, the account shows “Payment received; setting up your
   business”. On success, it links the owner into business setup/Backoffice.
   Technical failures retain the paid invoice and show a recoverable status;
   support investigates exceptions without becoming a normal payment approver.
7. Owner completes branch/readiness setup and pairs the released native Register
   devices. Subscription purchase does not configure printers, staff or offline
   authorization automatically.
8. Renewal applies one paid invoice to one service period. Backend uses the
   billing anchor and paid-through ledger, not “add another month every time a
   callback arrives”. Existing tenants and device history remain intact.

Optional sales help and approved design-partner pilots remain available. Pilot
eligibility is approved in the control plane, not granted by a browser flag.
The pilot still has normal identity, entitlements and terminal pairing. Do not
collect a recurring mandate for a no-charge/no-surprise-charge pilot without
separate clear customer consent.

## 6. Automated payment routes

### 6.1 Safepay automatic recurring subscription

Safepay is the selected provider direction for supported recurring instruments.
Its public [subscription terms](https://getsafepay.com.pk/legal/content/services-agreement)
describe recurring plans and cancellation; its [pricing/capability page](https://getsafepay.pk/pricing)
distinguishes subscription availability from the routing offering. Confirm the
merchant's enabled product, contract and production API before implementation.

Backend maintains mappings between immutable RoPulse offers and Safepay's
approved plan/price/customer/subscription objects. It must determine with Safepay
which objects require dashboard creation versus API creation, and record a
verified mapping for every sellable configuration. Do not assume that an
arbitrary amount/quantity can be patched onto an existing provider plan.

Hosted checkout captures the provider-approved recurring authorization. Record
the consent version/time, displayed amount/frequency, first/next charge and
provider IDs. Safepay owns execution of the configured recurring schedule; a
separate RoPulse cron must not independently charge the same period again.
Backend ingests renewals/failures/cancellations and reconciles missing events.

Automatic renewal continues until cancelled or stopped by failed collection,
lost authorization or another provider/commercial restriction. The account
always displays the actual state. Never describe a failed or cancelled mandate
as still guaranteed to renew. Provider-cancelled subscriptions may require a
new hosted subscription/consent flow; do not silently reactivate one.

Payment-instrument update uses a supported hosted/tokenized provider flow and
preserves the intended renewal identity. RoPulse never stores raw card/CVV data.
New charges caused by quantity/price changes require the approved provider
change/replacement flow, customer disclosure and versioned commercial change.

### 6.2 1Bill subscription invoice collection

1Bill is an additional required collection route. [1LINK's official description](https://1link.net.pk/products-services/bill-payment-service/)
lists fixed/invoice payments and provider-issued identification/prefixes.
Use fixed-amount subscription invoices for launch. The payment number, biller
identity, expiry and network transaction evidence must come from the contracted
1Bill integration; never invent a prefix or generate a number that has not
been registered with the collection provider.

The 1Bill adapter may use an approved direct arrangement or a contracted
aggregator. [PayFast's billing material](https://gopayfast.com/billing/) describes
1LINK-connected billing and is a candidate to evaluate. That does not establish
that Safepay itself provides RoPulse's 1Bill contract or that PayFast's generic
recurring-card endpoints are available. Obtain the actual merchant-specific
bill creation/inquiry/payment notification/reversal/expiry specifications.

Required invoice lifecycle:

1. Create/recover one registered fixed-amount bill for the invoice and return
   its reference, legal biller label, exact amount/currency and due date.
2. Display the number and supported banking-channel instructions in the owner's
   account. Ask the payer to verify the displayed biller/amount before approving
   the bank's transaction. Public pages cannot expose another business's bill.
3. Receive and authenticate the network/aggregator payment result, or query
   authoritative status automatically. Match the complete reference, merchant,
   invoice, transaction, amount and currency. A typed reference or “I paid” click
   does not activate service.
4. Atomically apply that confirmed payment once and enqueue activation/renewal.
   The portal refreshes its status; no staff member verifies a screenshot.
5. For subsequent cycles, issue the next invoice/reference, send the approved
   reminders and reconcile until paid or past due. If the provider uses a stable
   consumer identifier, bind each inquiry/payment to the current bill/version
   so an old reference cannot settle an unrelated new amount.

Automated invoicing and automatic access renewal after payment do not constitute
an automatic bank debit. Until a separate mandate capability is contracted,
the customer approves each 1Bill payment in their supported channel. Explain
this next to the option and on invoices rather than implying Safepay-style
off-session collection.

### 6.3 Prevent duplicate collection and handle route changes

One subscription service period has one authoritative collectible invoice, with
tracked attempts and payment allocations. Enforce uniqueness on provider event
and financial transaction IDs within their proper provider/merchant scope.
An inquiry/registration event is not a successful payment event.

Do not leave a Safepay renewal charge scheduled while presenting the same
renewal as a freely payable 1Bill bill. A route-switch operation coordinates
provider cancellation/pause as supported, confirms in-flight charge state,
voids superseded unpaid bills where possible and sets an explicit effective
period. A pending switch remains visible until confirmed.

If a delayed/competing payment arrives, record the money once but do not extend
the same period twice or duplicate a tenant. Apply the approved credit/refund
policy automatically where possible and expose an exception state otherwise.
Restrict expired/cancelled bill acceptance where the provider supports it; a
late network payment needs reconciliation rather than being silently discarded
or blindly reactivating a cancelled subscription.

### 6.4 Payment verification and reconciliation contracts

| Capability | Required server behavior |
| --- | --- |
| Offer/invoice read | Authorize membership, return versioned totals and expiry, and keep sensitive data private. |
| Safepay checkout/renewal | Create the correct hosted subscription/attempt and map authorized provider objects to the business and service period. |
| 1Bill issue/inquiry | Register/recover the correct fixed bill and current amount; support the contracted inquiry and bill lifecycle. |
| Provider callback | Use that provider's current authentication/signature rules and raw payload requirements; validate and durably queue before safe acknowledgement. |
| Status reconciliation | Automatically query authenticated provider APIs/reports for pending or missing results; use bounded retries and incident alerts. |
| Payment allocation | Match account/invoice/amount/currency and apply one successful financial event once, even after replay/restart. |
| Fulfilment | Durable idempotent provisioning/renewal job with visible payment-received/setup-pending states. |
| Refund/reversal/dispute | Preserve original invoice/payment history, track provider outcome and apply the correct commercial credit/access change. |

Handle out-of-order delivery, invalid signatures, duplicate events, lost
redirects, mismatched amounts, already-paid/expired bills, provider outages,
chargebacks and refunds. Never trust browser parameters as payment evidence.
Provider settlement fees/net payouts are reconciled separately from the gross
subscription invoice paid by the customer.

### 6.5 Cancellation and failed renewal

The ordinary website action cancels future renewal and preserves access through
the already-paid service end date. Display the next scheduled charge and that
paid-through date before confirmation. Refunds are a separate request governed
by the approved policy; cancellation does not silently refund or delete data.

For Safepay, immediately request the provider-supported stop to future charging
and show **Cancellation pending** until confirmed. Once confirmed, show renewal
off and the service-end date. Use reconciliation/alerts if the provider request
times out; a local flag alone cannot stop a provider charge. Confirm whether
any charge was already in flight and handle that outcome without creating a
second period. Safepay's public terms require re-subscription after provider
cancellation, so restarting renewal uses the supported new consent/checkout
flow when necessary.

For 1Bill, stop generating future renewal bills, void unpaid future bills where
supported and handle in-flight/late payments according to the recorded cutoff
and credit/refund policy. Cancellation must not be blocked merely because
payment was originally through 1Bill.

Failed collection enters the existing payment-due/grace policy and notifies
the billing owner. The seven-day commercial payment grace remains distinct from
the fourteen-day device lease and seventy-two-hour offline emergency grace.
Coordinate provider retries with RoPulse's period/invoice state; do not create
an additional charge scheduler or assume a provider retries indefinitely.
Billing login, payment remediation and eligible recovery uploads remain available
when new sales/renewals are restricted under the licensing policy.

## 7. Shared backend implementation and handover

The Backend team owns commercial identities/memberships, immutable pricing,
invoices, provider integration, verification, cancellation, reconciliation and
tenant provisioning. Website/Codex owns public pages, account/checkout UX,
provider handoff, owned invoice/status views, docs/search and download entry.
Flutter owns app account handoff, entitlement/session refresh and terminal setup.

Extend the existing control plane rather than adding a website-only billing
database. Required conceptual records include subscriber/business memberships,
purchase intent, immutable invoice/line items, service periods, provider account/
subscription/mandate mappings, payment attempts/transactions/allocations,
registered 1Bill references, durable provider-event inbox, cancellation/switch
requests, consent evidence and fulfilment jobs. Store provider secrets only
server-side in protected custody and keep sandbox/production strictly separate.

Freeze authenticated API examples for signup/verification/session handoff,
owned plans/invoices/subscriptions, Safepay checkout, 1Bill issue/status,
payment-method/route changes, cancellation, provisioning progress and provider
event intake. Specify authorization, request idempotency, event uniqueness,
retry/receipt behavior, timezones and minor-unit money representation. Proposed
routes are not live contracts until published by Backend.

## 8. Documentation and technical website direction

The detailed content source is `web/docs/user-guide/`; the unified reading
edition is `web/docs/ROPULSE_PLATFORM_GUIDE.md`. Account and automated billing
instructions are release-gated drafts until the new portal/provider flows work.
The internal publication ledger keeps code/design evidence separate from
production claims. Screenshots use seeded non-sensitive data from the chosen
release, not invented UI.

Keep the marketing/help content in Markdown and use a searchable content
renderer. Astro/Starlight remains a content-site candidate based on its
[authoring/setup](https://starlight.astro.build/getting-started/) and
[search documentation](https://starlight.astro.build/guides/site-search/).
The accepted account/checkout scope additionally requires secure backend-backed
session routes and protected portal pages; a static marketing template alone
cannot fulfil it. Select the final SSR/account architecture against the shared
auth contract before implementation. A conventional React/Next portal with
Markdown documentation is also a valid implementation direction to review.

Required docs behaviors include task/role navigation, full-text search, deep
heading links, related tasks, mobile/keyboard access, version/review metadata
and exclusion of internal drafts from public search/build. English comes first;
later Urdu content should have complete articles before a language option ships.

## 9. Delivery and launch acceptance

| Stage | Deliverable | Exit evidence |
| --- | --- | --- |
| 1: freeze accounts/offers/contracts | Shared identity design, approved sellable price versions, Safepay subscription mapping, contracted 1Bill adapter and cancellation rules. | Named owners, actual sandbox/production access and published API examples. |
| 2: implement the complete journey | Website signup/verification/account, hosted subscription checkout, 1Bill bills, automated events/reconciliation and idempotent fulfilment. | Fresh customer can buy through each route and see correct state without an operator approving payment. |
| 3: renewal/control/recovery | Safepay recurring cycle, 1Bill next invoice, route switching, failed payment/grace, cancellation, refund and duplicate-event recovery. | Correct paid-through dates and no double charge/extension under delayed/replayed events. |
| 4: production promotion | Verified provider accounts/keys, release walkthroughs, current docs/screenshots, support/monitoring, deploy and rollback. | Both teams sign the actual end-to-end release record. |

Automated collection and the customer account are paid-launch requirements,
including for the four-day deadline. If a required provider or identity contract
is unready, do not replace it with a manual-payment launch. Public information,
demo/pilot applications and release-gated documentation can still be prepared;
the affected **Subscribe/pay** flow stays unavailable until its gate passes.
If the owner chooses a phased provider launch later, record that scope change
explicitly rather than silently dropping the requested 1Bill option.

Minimum verification includes signup/verification/recovery, an existing-owner
purchase, membership isolation, each first payment, provisioning retry, one
Safepay recurring renewal, one 1Bill renewal, event replay, in-flight cancellation,
late/duplicate 1Bill payment, route switching without double collection, failed
collection/grace, provider cancellation requiring new consent, and access/data
retention after the paid service period ends. Check actually cancelled provider
state, not merely a website success message.

## 10. Business inputs still required

Confirm seller/entity/receiving details and actual merchant onboarding, approved
prices/cycles/tax presentation, the 1Bill contract/adapter and biller identity,
provider settlement/refund terms, support contacts, actual domains and initial
platform scope. The owner has selected automated Safepay plus 1Bill; these
remaining inputs are for implementing that decision, not permission to revert
to manual collection. Appearance, theme and logo remain deferred.

This update changes specifications and customer documentation only. It does not
open a merchant account, create a live bill, authorize a payment, message a
customer or deploy the website.

