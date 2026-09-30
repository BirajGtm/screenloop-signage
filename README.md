# ScreenLoop Signage

Current version: **2.0.0**. See [release notes](CHANGELOG.md).

A Chrome Manifest V3 extension that turns webpages into a rotating signage display using normal browser tabs and existing browser login sessions.

## Features

- Compact numbered playlist rows with page details, duration fields, reorder actions, and site-access status.
- System, Light, and Dark appearance for the popup, setup, and settings; System is the default.
- Guided playlist setup with named pages, manual login confirmation, and locally saved drafts.
- Collapsible Add a page form, a Back to settings shortcut, and a site-access checkbox in All settings.
- All settings form edits, including the site-access checkbox, apply through Save settings below the controls and visuals section.
- Selective ? help explains page refresh, single-page bar behavior, and website URL requirements. Click or tap to open, then click elsewhere to dismiss; keyboard activation and Escape are supported. Reset effects appear in a small orange note below the reset button.
- Popup uses confirmed background state and renders controls before site-access checks finish.
- Starting signage or the demo opens fullscreen and briefly shows controls for five seconds. The pointer hides after three idle seconds in fullscreen and returns on mouse or keyboard activity. Automatic page switches keep an idle pointer hidden.
- Countdown timing begins after tab activation and resynchronizes when a page becomes visible.
- Timed rotation, optional page reloads, pause/resume, and fullscreen controls.
- A single inline timing note appears when any playlist page is below 30 seconds.
- Custom per-page durations from 5 to 600 seconds (30 by default) and a confirmed reset of timing/display preferences without deleting saved pages.
- Duration fields appear in Manage pages starting with the second page, never in the popup. Single-page playback shows a bouncing activity bar instead of a countdown, with Previous/Next disabled; optional reload still works.
- Stop & close signage ends playback and closes display tabs launched during the current browser session, preserving unrelated tabs.
- Popup permission recovery targets the current signage website after navigation.
- Concise popup notices explain when website access is needed for controls.
- Frosted-glass timer track adapts its contrast to keep dark and light accents visible.
- Optional countdown bar, accent color, a gentle 450ms fade with subtle blur on page switches, and playback controls that hide when idle, reappear on pointer movement, and retain their remaining visible time across page switches.
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

## Screenshots

### Signage playback

![Demo signage with floating controls and the countdown bar](images/demo-screen-with-controls-and-sidebar.png)

### Playlist setup

![Manage pages and the empty playlist](images/setup-pages.png)

### Settings

![Appearance, refresh, and visual settings](images/all-settings.png)

### Extension popup

[Welcome screen](images/screenloop-extension-popup-no-page.png) · [Playback controls](images/screenloop-extension-popup-demo-running.png)

[Project website](https://birajgtm.com.np/project/screenloop-signage) · [Privacy policy](https://birajgtm.com.np/project/screenloop-signage/privacy-policy)

## Website publishing files

- [chrome-web-store-submission.md](chrome-web-store-submission.md): copy-ready listing text, permission justifications, disclosure guidance, and reviewer instructions.

- [project-info.md](project-info.md): project-page description with website frontmatter and screenshot references.
- [privacy-policy.md](privacy-policy.md): standalone policy for website publishing, matching the [extension copy](chrome-extension/PRIVACY.md).
- [images](images): five screenshots of the welcome popup, playback popup, setup, settings, and demo signage.

The project information and privacy policy match the published website content. Keep both local privacy-policy copies identical and update the website copies manually when making future changes. Screenshot paths differ between GitHub and the website. These website assets are outside the packaged extension folder.

## Logo assets

The untouched full-size logo is [Logo Main.png](Logo%20Main.png) in the repository root. Packaged extension icons are generated from it at 16, 32, 48, and 128 pixels. On Windows, run `powershell -File build-icons.ps1` to regenerate them. The full-size original is not included in the extension folder.

## Checks

Run with Node.js:

```sh
node test-controls.cjs
node test-setup.cjs
node test-playlist.cjs
node test-overlay.cjs
node test-options.cjs
node test-theme.cjs
```

These test playback and setup logic using simulated Chrome APIs. They do not replace live browser acceptance testing.

See [installation details](chrome-extension/INSTALL.md) and the [privacy policy](chrome-extension/PRIVACY.md). Chrome Web Store publication has not been completed. Publisher: Biraj Gautam. Support: [support@birajgtm.com.np](mailto:support@birajgtm.com.np). Screenshots are included in images; final store-ready sizing, submission disclosures, and live Chrome acceptance testing are still needed.

The older local iframe player is excluded from this repository.
