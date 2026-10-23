# RoPulse platform feature catalog

Reviewed: 2026-10-20. This catalog describes the client capability areas and
their user workflows. It is a content inventory, not a certificate that every
backend branch, platform, hardware device or commercial feature is deployed.
The public site must use the selected release's approved availability. Read the
internal publication review before turning these descriptions into sales claims.

## Account, business and staff

RoPulse separates the Register used for serving customers from Backoffice used
to run the business. The client has PIN and administrator email/password access,
invitation acceptance, password recovery, role-based navigation, branch selection,
staff and role management, schedule/access-request workflows and supported
biometric/card access. Managers can switch working areas when their access and
the device permit it, with guards around open orders and unsaved work.

The branch context matters throughout setup and reporting. Restaurant and
retail operating needs are represented separately. The commercial design also
includes Hybrid, but Hybrid must not be advertised as an enabled wire/runtime
capability until the selected backend and client verify it together.

## Catalog and selling configuration

The product area includes categories/products, applicable variants and barcode/
SKU information, images, modifier groups/options, combination selection,
branch-specific availability/overrides and supported order-type settings.
Ingredient and recipe workspaces help organize composition/costing information.
Pricing and bulk-pricing tools are separate from visual product placement.

The POS layout designer prepares the branch's Register presentation, including
category/tile ordering, supported layout/view modes, orientation, imagery and
order-type visibility. A tile's appearance does not create a price, grant a
permission or override a product's actual availability.

## Daily retail and restaurant sales

The Register supports the applicable order-type/context flow, product search/
selection, supported barcode entry, weighted-item entry where configured,
modifier/combo selection, quantity/note editing, held-order recall, customer
selection and current-price repeat-order previews. Supported actions include
discounts/price overrides, complimentary items, void/write-off approvals and
permitted order changes.

Restaurant workflows include table/floor interaction, applicable move/merge/
split operations, courses/rounds, kitchen ticket requests, supported ready/pickup
signals and delivery context. Retail workflows include counter/scan-oriented
selling, stock display and supported refund/exchange operations. Check actual
permissions and release capability before describing a specialist action as
universally available.

## Payments, currencies and receipts

Checkout records the effective accepted methods, split tender, cash change,
required/optional reference evidence and supported foreign-currency tender.
The payment setup workspace separates configuration, transaction history and
reconciliation. Custom manual method configuration is integrated in client
source, but its new backend endpoints and policy fixes must reach the selected
release before public instructions promise their availability.

Payment method tax assignments, product tax setup and service/delivery charges
have distinct scopes. Currency display and reporting retain the relevant
currency information; receipt output preserves sale-time document evidence.
Manual card/wallet/bank methods do not imply automatic provider capture or
verification.

The receipt workspace includes business/branch configuration, previews,
validation/publishing, supported printer/PDF output, history, authorized reprint
and enabled digital delivery. Refund, reversal and void records preserve their
own references and permission/approval requirements. An accepted print request
is not physical delivery proof.

## Customer and business operations

Customer management includes search/details, notes/tags, addresses, supported
merge and delivery-blacklist controls, recent orders and customer attribution.
The engagement areas include loyalty rules/balance/history and permitted
adjustments, administrative gift-card issuance/catalog/status, supported
redemption/store-credit inspection, feedback resolution and campaign management.
Paid gift-card selling must be checked separately from complimentary issuance.

Retail Stock includes on-hand inspection, relative adjustments and absolute
count setting. Shifts include opening/closing context, cash and payment-method
reconciliation, events and handover. Reports include supported sales/closing/
analysis/attendance views, budget comparison, columns and CSV/Excel export.
Order, refund, void, audit, approval and anomaly views support investigation.
Staff meals, global search, notification inbox and profile/system/support tools
round out the management areas represented in source.

## Hardware, connectivity and commercial lifecycle

Hardware support is platform-specific: receipt output, network ESC/POS where
supported, kitchen printer metadata/assignment/routing, device-local KOT status,
keyboard-wedge scan input and optional readers/displays require the actual
supported release and device setup.

The fuller offline branch contains local database/outbox, cloud/edge sync,
authorization/PIN preparation and recovery work. Offline/LAN operation,
background execution and kitchen display availability require integrated release
and hardware verification. They are not general promises for the management
website or every native platform.

The updated paid-launch design requires verified website subscriber accounts,
shared Backoffice identity, Safepay recurring subscriptions and 1Bill invoice
collection, with automated verification, activation/renewal and self-service
cancellation. Safepay renews under the authorized schedule until cancellation
or another valid stop. Ordinary 1Bill generates a payable bill each cycle;
customer channel authorization is distinct from automatic bank debit.

These are required implementation/release gates, not claims that production
provider accounts or the customer portal already exist. There is no manual
payment-approval path for normal SaaS collection. Packages, per-branch billing,
terminal slots, owner membership, runtime pairing, commercial leases and
retention remain controlled by the shared licensing backend. Restaurant/retail
cashiers' manual payment methods are a separate operational capability.

## Task guide map

| Area | Detailed user instructions |
| --- | --- |
| Login, invitations, first-day checks | [Getting started](user-guide/01-getting-started.md) |
| Branches, staff, roles and schedules | [Business and team](user-guide/02-business-branches-and-staff.md) |
| Products, modifiers and designer | [Catalog and layouts](user-guide/03-products-modifiers-and-layouts.md) |
| Prices, tax, FX and payment setup | [Financial setup](user-guide/04-prices-taxes-and-payment-setup.md) |
| Register, customer repeat and settlement | [Everyday sale](user-guide/05-register-and-checkout.md) |
| Tables, courses, KOT, pickup/delivery | [Restaurant operations](user-guide/06-restaurant-service-and-kitchen.md) |
| Payments, receipts, refunds/reversals | [Payment and document operations](user-guide/07-payments-receipts-and-corrections.md) |
| CRM, loyalty, gift/store credit, campaigns | [Customers and engagement](user-guide/08-customers-loyalty-and-engagement.md) |
| Retail stock, ingredients and recipes | [Inventory and recipes](user-guide/09-stock-ingredients-and-recipes.md) |
| Shifts, reports/exports and audit | [Closing and analysis](user-guide/10-shifts-reports-and-audit.md) |
| Printers, scanners and readers/displays | [Hardware](user-guide/11-hardware-and-printing.md) |
| Connection, uncertain outcomes and support | [Recovery](user-guide/12-connectivity-and-troubleshooting.md) |
| Buying, subscription invoices and renewal | [Software subscription](user-guide/13-subscription-and-support.md) |
| Orders, approvals, staff meals and admin | [Management tools](user-guide/14-orders-approvals-and-administration.md) |
| Website signup, Safepay/1Bill and cancellation | [Website account and billing](user-guide/15-website-account-and-billing.md) |

