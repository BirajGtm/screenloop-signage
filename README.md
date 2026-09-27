# ScreenLoop Signage

A Chrome Manifest V3 extension that turns webpages into a rotating signage display using normal browser tabs and existing browser login sessions.

## Features

- Guided playlist setup with named pages, login checks, and locally saved drafts.
- Timed rotation, optional page reloads, pause/resume, and fullscreen controls.
- Optional countdown bar, accent color, transitions, and on-screen playback controls.
- Three bundled fictional demo pages.
- Settings stored locally; no analytics or backend service.

## Install locally

1. Download or clone this repository.
2. Open `chrome://extensions`, enable Developer mode, and choose Load unpacked.
3. Select the `chrome-extension` directory.
4. Open ScreenLoop Signage and choose Set up my pages or Try demo.
5. Enable site access when prompted if you want on-screen controls and the timer.

After changing source files, reload the extension at `chrome://extensions`.

## Checks

Run with Node.js:

```sh
node test-controls.cjs
node test-setup.cjs
```

These test playback and setup logic using simulated Chrome APIs. They do not replace live browser acceptance testing.

See [installation details](chrome-extension/INSTALL.md) and the [draft privacy policy](chrome-extension/PRIVACY.md). Chrome Web Store publication has not been completed. Screenshots, publisher contact details, and final review are still needed.

The older local iframe player is excluded from this repository.
