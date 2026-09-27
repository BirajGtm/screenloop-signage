# Install once in your logged-in Chrome profile

## Guided setup and playback remote (1.5)

Reload the extension. New users see Set up my pages and Try demo. Setup opens in its own tab: enter a URL and optional name, open the page, sign in if needed, return and click Page is ready. Add more pages or choose Save setup / Save & start. Draft progress is stored locally, including unfinished URL entry. Login readiness is confirmed by you; the extension does not inspect authentication.

Existing saved playlists go straight to the remote. The dropdown shows page name, position, play/pause, previous/next, fullscreen, and time per page. Manage pages opens the guided flow again. All settings contains reload interval, accent, countdown visibility, fade preference, demo, and optional site-access controls.

## ScreenLoop Signage: on-screen controls (1.4)

Reload the extension in chrome://extensions. The new name and blue screen/loop icon appear in Chrome's extensions menu; pin it to show the icon on the toolbar. Enable countdown & fade for your playlist sites to also enable on-screen controls. Demo pages need no permission.

Use the bottom-center Controls handle to show Previous, Pause/Play, Next, and Fullscreen. Hovering near the bottom center also reveals the strip. It hides after three seconds when playing, stays open when paused, and preserves the remaining countdown on Play. Previous/Next reset the interval. Pause stops auto-refresh too. Refresh a dashboard after updating/disabling the extension to remove an old injected overlay. Chrome may delay alarm delivery, especially after sleep or when resuming with less than 30 seconds remaining.

## Demo and accent color (1.3)

Reload ScreenLoop Signage at chrome://extensions to apply this update. Click **Play demo signage** to open three fictional demo pages that rotate every 30 seconds. No login, internet connection, or optional website permission is needed for the bundled demo. Your saved playlist is not replaced. Click **Open dashboards / sign in**, then Start, to return to your own pages.

In **Manage pages & reload**, choose **Timer accent color**, save, and restart playback. New installations start with an empty playlist. Previously saved playlists are preserved. Private addresses formerly hardcoded as defaults are no longer bundled; if you never saved a playlist, add your URLs in Manage pages once.

This is a publication-preparation build, not a submitted store release. Before submission, add store icons/screenshots and a publisher support contact, host the privacy policy, complete the store disclosures, and perform real Chrome acceptance testing.

## Countdown bar and transitions (1.2)

Reload the extension in chrome://extensions. In the popup click **Enable countdown & fade** and approve Chrome's site-access prompt for your playlist sites. Start rotation: a slim blue bar on the right drains toward the bottom, and each incoming page briefly fades in. There is no numeric countdown. The bar is click-through, hides when paused, and resynchronizes after reload. Next resets the interval. Reduced-motion preferences disable the transition. Chrome switches tabs directly, so this is an incoming overlay fade, not a crossfade between two page images.

After adding a new website, click Enable countdown & fade again to grant access to that site. Permission is optional; rotation still works if declined. Overlays are injected only into the active managed playlist tab, not other browsing tabs. Chrome's host permission grants page access even though this code only adds its own overlay; it does not collect page content or credentials. Host permissions cover the site's host, including other ports. Redirects to an unapproved host won't show the overlay.

## Updating an existing installation

Open chrome://extensions and click Reload on ScreenLoop Signage. Open its popup and choose **Manage pages & reload**. Add, remove, or move URLs up/down; select a reload interval (off by default) and save. Saving pauses playback. Start again from the popup. If the playlist changed, a new display window opens and the old one is left untouched. Settings survive browser restarts. Auto-reload only runs while playing and reloads every managed page, including the active one.

1. Open chrome://extensions in Chrome.
2. Turn on Developer mode, choose Load unpacked, and select this folder:
   C:\Users\BirajGuatam\Documents\Codex\Project1\signage\chrome-extension
3. Open ScreenLoop Signage from Chrome's Extensions (puzzle) menu; pin it for easy access.
4. Click Open dashboards / sign in. A dedicated normal Chrome window opens both pages using this profile's sessions. Complete any login directly on the service page.
5. Open the extension again and click Start / resume rotation. Use Toggle fullscreen or F11.

This replaces the iframe player. No localhost server is needed. It does not read passwords, cookies, dashboard content, or browsing history. It uses alarms, device-local extension storage, scripting, and optional site access for the overlays. It controls only the playlist tabs it creates. Pausing leaves tabs open. Closing a managed tab stops rotation. After restarting Chrome, start from the extension again.

Rotation uses Chrome alarms and may be delayed if the computer sleeps or Chrome throttles background work.
