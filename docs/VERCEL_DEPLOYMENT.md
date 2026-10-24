# Vercel deployment

The owner selected Vercel. No project, DNS record or deployment was created in
this session. `vercel.json` selects Next.js with `npm ci` and a production build
that first enforces the dependency security baseline.
Follow Vercel's [Next.js guide](https://vercel.com/docs/frameworks/full-stack/nextjs)
and [project configuration reference](https://vercel.com/docs/project-configuration).

1. Complete the dependency security update in `PUBLIC_LAUNCH.md` before deploying.
2. Put the website source in its Git repository and connect it to a Vercel project.
   Select the directory containing this website's `package.json` as Root Directory.
   Use Node.js 22.x (at least 22.18). Keep the framework's default output settings;
   do not deploy this server application as a static `out` directory.
3. Set environment variables separately for Preview and Production. Secrets belong
   in Vercel's environment settings, never a tracked file or browser variable.
4. Both environments: `DOCS_REVIEW_MODE=false`. Preview: `SITE_INDEXABLE=false`.
   Keep `DOCS_PUBLIC_DRAFTS=true` for the owner-approved labelled public manual;
   use false if the owner later chooses approved-articles-only publication.
   Production: use `SITE_URL=https://ropulse.io`; enable indexing only after review.
   Preview `SITE_URL` must match its actual HTTPS deployment origin if testing forms.
   Do not reuse the production origin for a preview enquiry request.
5. Set `SUPPORT_EMAIL=support@ropulse.io` after verifying the mailbox. Confirm
   `COMPANY_NAME=Ebosoft Solutions`, the owner-confirmed seller. Set `SALES_EMAIL` only if confirmed.
   Leave `IDENTITY_URL` unset until its service is verified. For owner-selected
   Resend enquiry delivery, follow [RESEND_SETUP.md](RESEND_SETUP.md): set
   `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` server-side,
   with no `NEXT_PUBLIC_` prefix. Leave the alternative `CONTACT_ENDPOINT` and
   `CONTACT_API_TOKEN` unset. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public) and
   `TURNSTILE_SECRET_KEY` (server-only) for the security widget. Complete real
   delivery/security checks before public activation.
6. Deploy a preview. Verify `/`, `/resources`, `/tour`, `/docs`, `/support`, policy
   pages, robots, sitemap, headers and all screenshot assets. Public draft guides
   must show their labels/noindex and remain outside the sitemap. If public
   drafts are disabled, unpublished routes must be inaccessible. Verify the traced `docs/user-guide` files in an
   approved-article build when those articles are published.
7. Use Vercel Firewall to restrict abusive enquiry traffic before enabling the
   form; do not rely on process-local counters in serverless functions. Confirm
   delivery with an approved test enquiry and inspect the receiver's durable ID.
8. Add `ropulse.io` using the exact DNS values Vercel provides. Preserve existing
   mail MX/TXT records. Decide whether `www.ropulse.io` redirects to the apex in
   project domain settings. Check HTTPS and canonical URLs after DNS propagation.
9. Run the production smoke/browser checks against the deployment, record the
   URL and results, and promote the reviewed deployment. Retain the previous
   deployment for rollback through Vercel. Recheck environment values on rollback.

The site uses build-time public configuration on static pages. Changing those
values requires a new deployment. Contact availability is checked per request.
The enquiry function's 20-second budget includes 5 seconds for Turnstile
verification and 8 seconds for email delivery.
Do not introduce cookie-based personalization or authenticated content into
publicly cached static routes.

Do not publish review builds, environment files, source PDFs, archives or the
isolated Flutter capture workspace as public files. The supplied tracing rules
exclude capture/build material. Only selected screenshots live under `public`.
