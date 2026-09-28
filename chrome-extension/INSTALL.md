# Install and use ScreenLoop Signage

## Install

1. Use Chrome 120 or later, in the profile where you log in to your dashboards.
2. Download or clone the repository. Open `chrome://extensions`, turn on Developer mode, and choose Load unpacked.
3. Select the repository's `chrome-extension` folder.
4. Open ScreenLoop Signage from Chrome's Extensions menu. Pin it for easy access.
5. Choose Set up my pages or Try demo.

ScreenLoop opens normal browser tabs in a dedicated window using that Chrome profile's login sessions. No localhost server, iframe embedding, or dashboard API is needed.

## Set up your playlist

1. Enter a website URL and optional page name, then click Open & check page.
2. Sign in on the website if necessary. Return to setup and click Page is ready. This is your confirmation; ScreenLoop does not detect login status or read credentials.
3. Approve Chrome's optional site-access request for the timer and floating controls. Declining still adds the page and permits rotation without overlays.
4. Add more pages, reorder or remove entries, and choose Time per page.
5. Choose Save setup or Save & start.

Setup drafts save automatically on this device, including unfinished URL entry. Playlists support up to 50 HTTP or HTTPS URLs without embedded usernames/passwords. Saving stops current playback; existing display windows stay open. Start playback again after saving. A changed playlist opens a new display window when needed, leaving the old one open.

Manage pages reopens setup. Existing pages without permission show Enable timer & controls; you do not need to remove and re-add them. Already-granted access does not require another approval.

## Playback and settings

After setup, the dropdown shows the current page name and position, Previous, Play/Pause, Next, Toggle fullscreen, and Time per page. Manage pages edits your playlist; All settings opens the complete preferences.

- Rotation intervals: 30 seconds, 1 minute, 2 minutes, or 5 minutes.
- Automatic reload: off by default, or every 1, 5, 10, 15, 30, or 60 minutes. It reloads every managed page, including the active page, only while playing.
- Timer accent color: defaults to logo blue `#005bdb`.
- Show countdown bar and Fade on page switches control the visual effects.
- Save settings stops playback. Restart from the dropdown afterward.

The right-edge bar drains without a numeric countdown. The bottom-center Controls handle reveals Previous, Pause/Play, Next, and Fullscreen; hovering near the bottom center also reveals the strip. Controls hide after three seconds while playing and stay open while paused. Pause freezes the bar and stops automatic reload; Play resumes the remaining countdown. Previous/Next or manually selecting another managed tab resets its countdown, including while paused.

The transition is a brief incoming overlay fade, not a crossfade between screenshots. Reduced-motion preferences disable it. Overlays are added only to active managed playlist tabs, not unrelated browsing tabs.

Closing a managed tab stops rotation. Pausing leaves tabs open. After restarting Chrome, start playback from the extension again. Chrome alarms may run late after sleep or background throttling, especially when resuming with less than 30 seconds remaining.

## Try the demo

Try demo on the welcome screen or Play demo signage in All settings opens three bundled fictional pages, initially rotating every 30 seconds. They require no login, internet connection, or optional website access. Your saved playlist is not replaced. To return to your pages, open Manage pages and choose Save & start.

## Site access and missing controls

Website access is optional for rotation, but required for the countdown, floating controls, and fade on normal websites. All settings also offers Enable on-screen controls & visuals for the saved playlist. Chrome grants access at the host level, including other ports; it is not limited to a single dashboard path. You can revoke access in Chrome's extension settings.

If a page has no timer or controls:

1. Open the dropdown and check for missing site access or an injection error for the active page.
2. Open Manage pages and use Enable timer & controls for affected entries, approve Chrome's prompt, and restart playback.
3. If the website redirects to another host, save its final URL and grant access there. Google/YouTube base and www aliases, and HTTP-to-HTTPS upgrades, are included in permission requests; arbitrary redirect hosts are not.
4. Check that Show countdown bar is enabled if only the bar is missing. Chrome-restricted pages cannot accept injected overlays.

Permission is independent of login: being signed in does not authorize ScreenLoop to draw controls. Login must also be in the Chrome profile running ScreenLoop, not another browser or profile.

## Update an unpacked installation

Reload ScreenLoop Signage at `chrome://extensions`, then restart playback. Refresh existing dashboard tabs to remove old injected overlays after updating or disabling the extension. Saved settings remain local across browser restarts.

## Publication status

This is not a published Chrome Web Store release. Icons are bundled. Store screenshots, publisher/support details, a publicly hosted privacy policy, disclosures, and live Chrome acceptance testing are still needed before submission. See [PRIVACY.md](PRIVACY.md) for the draft policy and the repository README for automated test commands.
