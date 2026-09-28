# ScreenLoop Signage

Current version: **1.6.0**. See [release notes](CHANGELOG.md).

A Chrome Manifest V3 extension that turns webpages into a rotating signage display using normal browser tabs and existing browser login sessions.

## Features

- Guided playlist setup with named pages, manual login confirmation, and locally saved drafts.
- Collapsible Add a page form, a Back to settings shortcut, and a site-access checkbox in All settings.
- All settings form edits, including the site-access checkbox, apply through Save settings below the controls and visuals section.
- Contextual ? help explains settings and playback actions with mouse, keyboard, or touch.
- Timed rotation, optional page reloads, pause/resume, and fullscreen controls.
- Custom per-page durations from 30 to 600 seconds (30 by default) and a confirmed reset of timing/display preferences without deleting saved pages.
- Duration fields appear in Manage pages starting with the second page, never in the popup. Single-page playback shows a bouncing activity bar instead of a countdown, with Previous/Next disabled; optional reload still works.
- Stop & close signage ends playback and closes display tabs launched during the current browser session, preserving unrelated tabs.
- Optional countdown bar, accent color, transitions, and playback controls that hide when idle and reappear on pointer movement.
- Three bundled fictional demo pages.
- Settings stored locally; no analytics or backend service.

## Install locally

1. Download or clone this repository.
2. Open `chrome://extensions`, enable Developer mode, and choose Load unpacked.
3. Select the `chrome-extension` directory.
4. Open ScreenLoop Signage and choose Set up my pages or Try demo.
5. Open each page in setup, sign in if needed, then return and click Page is ready. Approve optional site access for the timer and floating controls.
6. Choose Save & start. Manage pages lets you edit the playlist or retry site permissions; All settings contains reload and visual preferences.

After changing source files, reload the extension at `chrome://extensions`.

No localhost server or dashboard API is needed. Use the Chrome profile where you sign in to your websites. Declining site access allows rotation without overlays on that site.

## Checks

Run with Node.js:

```sh
node test-controls.cjs
node test-setup.cjs
node test-playlist.cjs
node test-overlay.cjs
node test-options.cjs
```

These test playback and setup logic using simulated Chrome APIs. They do not replace live browser acceptance testing.

See [installation details](chrome-extension/INSTALL.md) and the [draft privacy policy](chrome-extension/PRIVACY.md). Chrome Web Store publication has not been completed. Screenshots, publisher contact details, and final review are still needed.

The older local iframe player is excluded from this repository.
