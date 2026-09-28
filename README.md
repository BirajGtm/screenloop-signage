# ScreenLoop Signage

A Chrome Manifest V3 extension that turns webpages into a rotating signage display using normal browser tabs and existing browser login sessions.

## Features

- Guided playlist setup with named pages, manual login confirmation, and locally saved drafts.
- Timed rotation, optional page reloads, pause/resume, and fullscreen controls.
- Optional countdown bar, accent color, transitions, and on-screen playback controls.
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
```

These test playback and setup logic using simulated Chrome APIs. They do not replace live browser acceptance testing.

See [installation details](chrome-extension/INSTALL.md) and the [draft privacy policy](chrome-extension/PRIVACY.md). Chrome Web Store publication has not been completed. Screenshots, publisher contact details, and final review are still needed.

The older local iframe player is excluded from this repository.
