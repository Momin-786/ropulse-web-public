# Motion and illustrated manuals

This implements the owner's requested continuation of the approved website:
page-change animation, real app screenshots inside user guides, and a light
hero presentation replacing its burgundy surround.

Use a short fade/translate on pathname changes, preserving the persistent
header and footer. Reveal selected marketing cards on scroll once. No motion
may delay navigation, hide content when JavaScript is absent, or persist when
the visitor requests reduced motion. Keyboard focus must reveal an animated
element immediately. Avoid experimental framework APIs and new dependencies.

The hero uses a white application frame, soft shadow, and a restrained lavender
backplate. Preserve the actual app image pixels and supplied logos.

Canonical guide Markdown contains task-specific image references. Render only
assets from the explicit capture manifest; reject remote or arbitrary images.
Each figure includes actual-app/sample-data context and an accessible native
dialog to enlarge it, with Escape, close and focus restoration. Keep source
images downloadable/viewable at full size. Do not substitute invented UI.

Extend the isolated Flutter capture harness to omit its development debug banner
for checkout captures. Record the override and hashes; never modify the sibling
app. Existing guide publication flags remain unchanged unless the owner elects
to expose clearly labelled draft guides. Such exposure must not certify them
as released instructions or advertise planned account/payment flows as active.

Owner decision: in response to the public-draft/manual visibility question,
the owner approved proceeding. All 15 chapters may therefore be shown publicly
with draft labels and noindex. Their release approval records stay unchanged.
The source chapter files are read-only; illustration metadata is maintained in
`src/content/manual-illustrations.json` and composed before Markdown parsing.

Verify pathname changes, image safety, figure/dialog behavior, keyboard focus,
reduced motion, JavaScript-disabled visibility, responsive layouts, type checks,
unit tests and the actual production artifact.
