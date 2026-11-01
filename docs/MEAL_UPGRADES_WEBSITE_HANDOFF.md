# Meal upgrades manual handoff — 1 November 2026

Update: the article is now registered in the local manual manifest, the seven image entries are in the product-capture registry, and related guide links have been added. The remaining publication/release review is separate from this code integration. The website uses local versioned content; no CMS setup is required.

The detailed owner/cashier article is `docs/user-guide/16-meals-deals-and-recommendations.md`. It covers the exact desktop Back Office entry, category roles, product overrides, priority/hide/popup rules, preview/save, the visible Register offer, choices and reviewed totals, separate drinks, configured deals, saved-meal actions, hold/reopen, recovery, receipts and kitchen routing. It explicitly describes the current offline calculation limits.

Seven PNGs are in `public/images/product/meals/`. They are captures of the actual Flutter widgets using demonstration data; they are not generated mockups or evidence of a production login. `docs/meal-upgrades-captures.json` records dimensions, SHA-256 hashes, source revision, capture method and verification. No pixels were retouched. The capture uses Windows Segoe UI in the test renderer so text remains legible.

The website currently has uncommitted work from its other implementation task. This handoff only adds the new article, images and metadata; it does not replace or commit that work.

## Integrate through the existing manual system

### Website integration — 1 November 2026

The article is registered at `/docs/meals-and-deals` in the manual review edition. All seven screenshots are registered in `src/content/product-captures.json` with their individual capture provenance, dimensions and hashes. The help-center index and the products, Register and restaurant-service chapters link to the new guide. Its publication status remains **review**; no reviewer, approval date or release has been assigned.

The content and manual-image checks pass (16 tests), including chapter links, heading anchors and capture SHA-256 verification. Desktop/mobile visual review and the release/branch activation checks below remain required before publication.

1. Add the article to `src/lib/manual-manifest.mjs`, using file `16-meals-deals-and-recommendations.md`, slug `meals-and-deals`, title `Meals, deals & recommendations`, group `Day to day`, and description `Set up branch offers and guide cashiers through meal choices, review and recovery.`
2. Append the seven `captures` entries from the supplied capture JSON to `src/content/product-captures.json`. Preserve the existing captures and their provenance. The Markdown image renderer uses this registry; adding PNG files alone will not make them render.
3. Add any desired cross-links from the products, Register and restaurant-service articles. The new article already includes accessible descriptive image text and captions.
4. Keep the article in review until the coordinated API/App/Edge feature is deployed and the branch activation checks pass. Do not invent a reviewer, approval date or release in `manual-publication.json`. Registering an article in the allowlist does not itself grant publication approval.
5. Verify the article and its image captions on desktop and mobile in the existing manual review flow, then publish through the current release/content process.

The matching feature PRs are app #2 (base `momin-dev`), API #19 (base `main`) and Edge #5 (base `main`). API tenant migrations are additive V190–V192; app local schema is 42; Edge migration is 0022. The user-facing article intentionally keeps these implementation details out of cashier instructions. The app release handover records test evidence and the remaining live/hardware gates.
