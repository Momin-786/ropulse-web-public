# ROPULSE — Launch Brand & Icon Kit

**Approved tagline:** A modern restaurant ordering pulse.

This kit recreates the visual identity from the supplied finalized reference, including the custom **ROPULSE** wordmark and the two-letter **RP** app monogram. The final SVG files contain traced vector paths and gradients (not embedded photographs). The source image was a JPEG rather than an editable original vector, so these are **vector redraws** and should be visually checked against the approval image before production. The heading “05 — Unified Flow” in the design presentation is intentionally excluded from all brand assets.

## Brand palette (approximate matches to the JPEG)
| Name | Hex | Usage |
|:--|:--|:--|
| Deep Plum | `#340A30` | app icon, text/logo, dark backgrounds |
| Dark Plum | `#300829` | high-contrast purple |
| Pulse Pink | `#F20E71` | pulse accent |
| Rose Magenta | `#B81979` | accent gradient |
| White | `#FFFFFF` | white wordmark/icon on dark UI |

## Folder guide
- `01_Logos/SVG`: original-proportion vector wordmarks with and without tagline; the exact tagline by itself; RP transparent monogram variants; square icon; stacked lockup.
- `01_Logos/PNG`: transparent raster exports in multiple widths, suitable for presentations, sales collateral, product UI and retina screens. **Light-logo PNGs are white lettering on transparent pixels**: preview on a dark background.
- `02_Mobile_Android_iOS/iOS/AppIcon.appiconset`: complete iOS PNG icon set and `Contents.json`. No alpha channel, no manually baked rounded corners (iOS masks the square icon).
- `02_Mobile_Android_iOS/Android/res`: regular launcher mipmaps plus adaptive icon resources. Use your package/app names and existing Gradle/AndroidManifest configurations.
- `03_Website`: SVG navbar/footer logos, favicon.ico/svg/PNG, Apple touch icon, PWA manifest and maskable PWA icons, 1200×630 social OG images (light + dark), integration HTML example.
- `04_Desktop`: Windows `.ico`, macOS `.icns` and `.iconset` and Linux PNG/SVG application icons.
- `05_Flutter_Integration`: `assets/branding` ready to copy to your project; example Dart widget and pubspec/launcher-icons YAML.
- `06_Reference`: original supplied approved reference image.
- `07_Splash_and_Onboarding`: optional SVG + PNG 1080×1920 phone and 1600×900 desktop/web splash screens, light and dark.

## Website setup
1. Copy `03_Website/favicon.ico`, `favicon.svg`, and `manifest.webmanifest` to your website's **public root**.
2. Copy `03_Website/icons/` to `public/brand/icons/`.
3. Copy `03_Website/logos/` to `public/brand/logos/` and `03_Website/social/` to `public/brand/social/`.
4. Paste appropriate lines from `03_Website/website-head-example.html` into the document's `<head>`, and **replace YOURDOMAIN.COM** with your production domain.
5. For light website navbar use `ropulse-wordmark-dark.svg`; for dark navbar/footer use `ropulse-wordmark-light.svg`. Use the with-tagline variant in website hero/landing sections. Keep the logo aspect ratio and adequate clear space; don't stretch or tint the entire gradient.
6. PWA icons include normal and maskable options, linked from `manifest.webmanifest`; change any `/brand/...` paths if your site deploys under a subdirectory.

## Flutter setup
1. Copy `05_Flutter_Integration/assets/branding/` to `{your_flutter_project}/assets/branding/`.
2. Merge the `pubspec-snippet.yaml` assets lines into your existing `pubspec.yaml` (do not overwrite it). Add the `flutter_svg` dependency to display SVGs, and `flutter_launcher_icons` to dev_dependencies to generate app launcher icons.
3. Copy `flutter_launcher_icons.yaml` next to `pubspec.yaml`; run `flutter pub get` and `dart run flutter_launcher_icons -f flutter_launcher_icons.yaml`.
4. Use `example_widget.dart` as a starting point. Use the wordmark without tagline when limited width; with-tagline for large panels/onboarding.
5. The dedicated native Android adaptive foreground/background and iOS icon catalog are also included if you prefer manually installing the files in native projects.
6. To replace a Windows Flutter runner icon manually use the `.ico` file in your runner resources. macOS runner app icon uses `Assets.xcassets/AppIcon.appiconset` or a configured `.icns`. Linux desktop launchers reference a PNG or SVG icon. Check platform builder requirements and regenerate launcher icons for your Flutter/tool versions.

## App icon sizing/behavior
- The solid square deep-plum icon with RP in white/pink is intentionally used as the master for Apple/Android/desktop: app stores and device launchers apply native masks/rounded corners.
- The rounded square SVG/PNG is for *brand artwork* and marketing when you need a visible rounded border. Avoid nesting the rounded-square inside another app launcher shape.
- Don't use the tagline within a tiny launcher icon or favicon: the two-letter RP mark is intended to remain legible.
- The vector logos are best for website/CSS and Flutter SVG; the PNG exports are appropriate for services that need raster images.

## QA / handoff notes
- The design source was raster JPEG; vector contours and gradient positions were reconstructed from the image. Check every logo visually against your approved reference before trademark filings or mass production. If the original editable vector source becomes available, that should supersede the traced artwork.
- Colors represent the approved raster appearance and are approximate digital sRGB values.
- Brand ownership/trademark clearance, app-store listing review, and project-specific launcher/manifest edits are outside this asset pack.
