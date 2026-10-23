# RoPulse website and documentation workspace

This folder is separate from the Flutter `app` repository. It holds the launch
website/payment plan and the customer documentation content. Visual design,
theme and logo will be decided in a later discussion; no website implementation
or hosting deployment has been created here yet.

## Read these files

1. [Website and payments plan](docs/WEBSITE_AND_PAYMENTS_PLAN.md): public routes,
   buying/onboarding journey, verified accounts, Safepay recurring and 1Bill,
   automated fulfilment/cancellation and launch requirements.
2. [Unified RoPulse platform guide](docs/ROPULSE_PLATFORM_GUIDE.md): the feature
   catalog and all detailed user-guide chapters in one reading document.
3. [User-guide home](docs/user-guide/README.md): the same operational content as
   individual chapters with a role-based reading path.
4. [Feature catalog](docs/FEATURE_CATALOG.md): capability descriptions and the
   detailed guide map for content and sales review.
5. [Internal content review](docs/CONTENT_REVIEW_AND_PUBLICATION.md): source
   evidence, release-dependent claims, screenshot list and publication checks.
   Keep this internal when the website is built.

## Directory structure

```text
web/
  README.md
  docs/
    WEBSITE_AND_PAYMENTS_PLAN.md
    ROPULSE_PLATFORM_GUIDE.md
    FEATURE_CATALOG.md
    CONTENT_REVIEW_AND_PUBLICATION.md
    user-guide/
      README.md
      01-getting-started.md
      02-business-branches-and-staff.md
      03-products-modifiers-and-layouts.md
      04-prices-taxes-and-payment-setup.md
      05-register-and-checkout.md
      06-restaurant-service-and-kitchen.md
      07-payments-receipts-and-corrections.md
      08-customers-loyalty-and-engagement.md
      09-stock-ingredients-and-recipes.md
      10-shifts-reports-and-audit.md
      11-hardware-and-printing.md
      12-connectivity-and-troubleshooting.md
      13-subscription-and-support.md
      14-orders-approvals-and-administration.md
      15-website-account-and-billing.md
```

The chapters and feature catalog are the editable content source. Regenerate
the unified reading edition after editing them. Business/entity details,
merchant approval, actual prices, supported release scope and policy approval
remain explicit decisions in the plan; visual branding has been deferred by
the owner.

The owner selected automated subscription collection: Safepay recurring until cancellation or another valid stop, plus 1Bill invoices with automated confirmation and renewal. Website signup/billing uses the shared RoPulse identity. These are implementation requirements; provider accounts and live integration are not certified by the written plan.

