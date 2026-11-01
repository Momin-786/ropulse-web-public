# Public website consolidation — 1 November 2026

The owner requested all public-web branches and pending website work on main, excluding the Sanity integration. PR #2 is merged into main at `20ef60e`, preserving the subscriber session validation, checkout return context and owner-invitation flow. The production-readiness branch is already an ancestor of this history.

The local website redesign, Manrope assets, manual improvements, seven meal screenshots, Turnstile/enquiry refinements and responsive browser checks are retained. The active subscription pricing, sign-in, checkout, account and owner-invitation routes come from the merged subscriber implementation. Overlaps in the header and marketing route were resolved to preserve those flows.

Sanity is excluded from this release: no SDK/webhook dependency, Studio, export script, remote content loader, webhook endpoint, CMS environment variables or CSP allowance is added. Public content is read from the committed JSON and Markdown files. The full original local work, including Sanity, was preserved in a separate backup archive and Git recovery references before preparing this release in an isolated worktree.

## Verification

- Clean dependency installation completed; production dependency audit reported zero vulnerabilities.
- All 44 unit tests passed, including subscriber-session validation, manual links/images, enquiry handling and Turnstile contracts.
- TypeScript and optimized Next.js production build passed.
- Production browser checks passed across 19 public routes, desktop/mobile navigation, account-page rendering, enquiry validation, docs/search, image controls and security headers. Additional 320/768/1024px checks passed with no horizontal overflow or browser runtime errors.
- Professional-site browser checks passed at 320/390/768/1024/1440px, including local brand font, responsive product images, readable cards, FAQ and the absent CMS endpoint.
- Motion/manual checks passed, including reduced motion, screenshot dialog focus restoration, mobile fit and usable content without JavaScript.

These checks use the production build with services unconfigured locally. They verify graceful unavailable-service behavior and session contracts; they do not claim a live Safepay charge or new production account acceptance. Deployment remains subject to the host's normal main-branch configuration.

Evidence is retained in the sibling QA folder `public-web-release-20261101`; browser screenshots and results are under the isolated worktree's ignored `tmp/qa` directory. No environment secrets, build output or backup archive is committed.
