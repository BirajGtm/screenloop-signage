# Release notes

## Unreleased

- Update the artifact upload action to its Node.js 24 version to remove the runner deprecation warning.

- Add a manually triggered and version-tag-triggered GitHub workflow for tested Chrome Web Store ZIPs, plus a local packaging script.

- Add Chrome Web Store listing copy, permission justifications, local-data disclosures, and reviewer testing instructions.

- Link the published project and privacy-policy pages and synchronize website publishing content and policy copies.

- Add five project screenshots, website-ready project information, and a standalone privacy-policy Markdown file. Link screenshots and publishing assets from the documentation.

- Finalize the privacy policy with publisher Biraj Gautam and support@birajgtm.com.np, including local storage, permissions, interaction handling, and data-removal disclosures.

## 2.0.0 — 2026-09-29

- Add System (default), Light, and Dark appearance across extension pages.
- Allow 5–600 seconds per page, retaining the 30-second default. Short timers use alarm recovery and stale-event protection; one inline note explains timing limitations for short playlists.
- Start signage fullscreen with a five-second controls introduction. Preserve control visibility across page switches and hide the idle pointer until mouse or keyboard activity.
- Add a gentle 450ms page transition and a frosted timer track with adaptive contrast, retaining its original 6-pixel width.
- Fix first-activation countdown timing and resynchronize the bar when a page becomes visible. Clean up animations and avoid unnecessary overlay rebuilds.
- Redesign the playlist as compact numbered rows with clearer page details, durations, and actions.
- Reduce help clutter, place help beside relevant labels, dismiss it on outside clicks, and explain reset effects inline.
- Shorten permission notices and request access for the current signage destination after navigation. This adds Chrome’s tabs permission to identify the destination URL.
- Render popup controls before permission checks complete and coalesce overlapping refreshes.
- Update installation and privacy documentation and expand regression coverage.

Validation: all six simulated Chrome/DOM test suites pass. Live Chrome acceptance testing remains necessary, particularly first-load transitions, fullscreen behavior, and short-duration timing. This GitHub version is not a Chrome Web Store publication.

## 1.6.0 — 2026-09-28

- Custom per-page durations from 30 to 600 seconds, defaulting to 30. Duration fields appear starting with the second page and are managed in setup, not the popup.
- Single-page activity animation, disabled Previous/Next for one page, and accent-matched floating controls.
- Idle controls fully hide and reappear on pointer activity; keyboard access is preserved.
- Stop & close signage closes tracked display tabs without closing unrelated tabs.
- Collapsible add-page form, readiness-gated save buttons, cancellation controls, and floating Back to settings navigation.
- Unified Save settings flow for visual preferences and site access, plus confirmed settings reset.
- Contextual help, corrected color-picker hit area, and settings initialization checks.
- Updated installation/privacy documentation and automated regression tests.

Validation: simulated Chrome/DOM tests; live Chrome acceptance testing remains necessary. This GitHub version is not a Chrome Web Store publication.
