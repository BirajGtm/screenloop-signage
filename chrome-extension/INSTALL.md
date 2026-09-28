# Install and use ScreenLoop Signage

## Install

1. Use Chrome 120 or later, in the profile where you log in to your dashboards.
2. Download or clone the repository. Open `chrome://extensions`, turn on Developer mode, and choose Load unpacked.
3. Select the repository's `chrome-extension` folder.
4. Open ScreenLoop Signage from Chrome's Extensions menu. Pin it for easy access.
5. Choose Set up my pages or Try demo.

ScreenLoop opens normal browser tabs in a dedicated window using that Chrome profile's login sessions. No localhost server, iframe embedding, or dashboard API is needed.

## Set up your playlist

1. Click Add a page to expand the form. Enter a website URL and optional page name, then click Open & check page. Cancel beside that button collapses the form without discarding your draft; confirming a page collapses it automatically.
2. Sign in on the website if necessary. Return to setup and click Page is ready. This is your confirmation; ScreenLoop does not detect login status or read credentials.
3. Approve Chrome's optional site-access request for the timer and floating controls. Declining still adds the page and permits rotation without overlays.
4. Time on this page appears starting with the second page you add (30 seconds by default). Once two pages are confirmed, both cards show editable durations. With just one confirmed page, its duration field is hidden.
5. Choose Save setup or Save & start.

Both save buttons are disabled while the add form is open or a page awaits Page is ready, even if other pages are already in the playlist. Confirm readiness, or use Cancel / Cancel adding page to exit the addition without adding that page. Saving also requires at least one confirmed page. A pending readiness check stays blocked when setup is reopened.

Setup drafts save automatically on this device, including unfinished URL entry. Playlists support up to 50 HTTP or HTTPS URLs without embedded usernames/passwords. Saving stops current playback; existing display windows stay open. Start playback again after saving. A changed playlist opens a new display window when needed, leaving the old one open.

Manage pages reopens setup. Existing pages without permission show Enable timer & controls; you do not need to remove and re-add them. Already-granted access does not require another approval.

Back to settings floats at the far left of the viewport, level with the Manage pages logo/title on wide screens and outside the centered content column. It remains visible while scrolling. On narrower screens it sits above the content to avoid overlap. Draft edits remain saved locally; use Save setup to apply playlist changes.

## Playback and settings

Small ? help controls beside settings and playback actions explain their behavior. Hover, focus with the keyboard, or click/tap to read them. Click again to collapse or press Escape to close. Help controls do not change settings or trigger playback actions.

After setup, the dropdown shows the current page name and position, Previous, Play/Pause, Next, and Toggle fullscreen. Duration editing is only in Manage pages, not the popup; All settings opens the complete preferences.

- Per-page rotation intervals: any whole number from 30 to 600 seconds (10 minutes), defaulting to 30 seconds. Enter values such as 31 or 95 in the add form or an existing page card. The 30-second minimum matches Chrome's alarm scheduling floor; actual timing can still be delayed by Chrome. Existing playlists inherit their previous global duration until edited. Automatic rotation and manual tab selection use the selected page's duration.
- Automatic reload: off by default, or every 1, 5, 10, 15, 30, or 60 minutes. It reloads every managed page, including the active page, only while playing.
- Timer accent color: defaults to logo blue `#005bdb`.
  Click the color swatch itself to open the picker; the surrounding text and blank space do not activate it. Keyboard users can Tab to the swatch.
- Show countdown bar and Fade on page switches control the visual effects.
- Save settings stops playback. Restart from the dropdown afterward.

Reset settings to defaults in All settings asks for confirmation, stops playback, and resets every saved page to 30 seconds, reload to Off, accent to `#005bdb`, and countdown/fade to enabled. It keeps saved URLs, names, site permissions, and open tabs, but clears unfinished setup drafts. Reload any already-open Manage pages tabs after resetting so they do not re-save an old draft. It does not change Chrome's fullscreen state.

With two or more pages, the right-edge bar drains without a numeric countdown. A single-page playlist stays on its page with no rotation alarm. Its side bar bounces up and down as an activity indicator, not a countdown; it becomes stationary while paused or with reduced motion enabled. Show countdown bar still controls its visibility. Previous/Next are disabled in both the popup and floating controls. Optional automatic reload and other playback controls still work. Floating control buttons and their border use the same selected accent color as the bar, with contrasting text. Moving the pointer anywhere on the page or tapping reveals the bottom-center Controls label and Previous, Pause/Play, Next, and Fullscreen. The entire control area disappears after three seconds without pointer activity, even while paused or with the pointer resting over it. Controls start hidden on page switches so unattended playback stays unobstructed. Pressing Tab also reveals controls; they remain visible while keyboard focus is inside them. The countdown bar is unaffected by this auto-hide behavior; turn it off separately in All settings.

Pause freezes the bar and stops automatic reload; Play resumes the remaining countdown. Previous/Next or manually selecting another managed tab resets its countdown, including while paused.

The transition is a brief incoming overlay fade, not a crossfade between screenshots. Reduced-motion preferences disable it. Overlays are added only to active managed playlist tabs, not unrelated browsing tabs.

Closing a managed tab stops rotation. Pausing leaves tabs open. After restarting Chrome, start playback from the extension again. Chrome alarms may run late after sleep or background throttling, especially when resuming with less than 30 seconds remaining.

Stop & close signage is available in the dropdown and floating controls. It cancels rotation/reload and closes tracked display tabs launched during this browser session, including previous playlists and demos. Chrome closes a window when its last tab closes; unrelated tabs you added remain open. Setup/login-check tabs are not display tabs and are left open. Saved playlists and settings are retained. Tracking resets when Chrome restarts, so restored tabs from an earlier browser session are not closed. Display windows abandoned before this update may not be tracked; close those manually. Closing tabs can discard unsaved work on those pages; use Pause to keep them open.

## Try the demo

Try demo on the welcome screen or Play demo signage in All settings opens three bundled fictional pages, initially rotating every 30 seconds. They require no login, internet connection, or optional website access. Your saved playlist is not replaced. To return to your pages, open Manage pages and choose Save & start.

## Site access and missing controls

Website access is optional for rotation, but required for the countdown, floating controls, and fade on normal websites. All settings also offers Enable on-screen controls & visuals for the saved playlist. Chrome grants access at the host level, including other ports; it is not limited to a single dashboard path. You can revoke access in Chrome's extension settings.

Enable on-screen controls & visuals is a checkbox that initially reflects site permissions: checked means all playlist sites are approved, and a mixed mark means only some are approved. Changing it only stages an edit. Save settings, below this section, applies the form together: enabling requests Chrome site access, while disabling stops playback and clears active overlays before removing access. A denied permission prompt leaves the form unsaved so you can retry or uncheck the option. Leaving without saving does not apply checkbox edits. This does not disable bundled demo controls. With an empty playlist, the checkbox is disabled.

The popup's Stop & close signage button is disabled when playback is neither running nor paused; it remains available while paused.

If a page has no timer or controls:

1. Open the dropdown and check for missing site access or an injection error for the active page.
2. Open Manage pages and use Enable timer & controls for affected entries, approve Chrome's prompt, and restart playback.
3. If the website redirects to another host, save its final URL and grant access there. Google/YouTube base and www aliases, and HTTP-to-HTTPS upgrades, are included in permission requests; arbitrary redirect hosts are not.
4. Check that Show countdown bar is enabled if only the bar is missing. Chrome-restricted pages cannot accept injected overlays.

Permission is independent of login: being signed in does not authorize ScreenLoop to draw controls. Login must also be in the Chrome profile running ScreenLoop, not another browser or profile.

## Update an unpacked installation

Reload ScreenLoop Signage at `chrome://extensions`, then restart playback. Refresh existing dashboard tabs to remove old injected overlays after updating or disabling the extension. Saved settings remain local across browser restarts.

Close old Settings and Manage pages tabs after an update and reopen them from the extension so HTML and scripts come from the same version. If Settings reports an out-of-date or incomplete page, reload the extension and reopen All settings. If the message persists, confirm Load unpacked points to the updated `chrome-extension` folder.

## Publication status

This is not a published Chrome Web Store release. Icons are bundled. Store screenshots, publisher/support details, a publicly hosted privacy policy, disclosures, and live Chrome acceptance testing are still needed before submission. See [PRIVACY.md](PRIVACY.md) for the draft policy and the repository README for automated test commands.
