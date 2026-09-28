# ScreenLoop Signage privacy

ScreenLoop Signage stores your playlist URLs and page names, rotation and reload intervals, timer accent color, countdown visibility, and fade preference locally in Chrome's extension storage. Setup drafts, including unfinished page entry and confirmation progress, are also saved locally. Playback state (including playlist URLs, tab/window identifiers, and timing) and overlay injection errors are kept in session storage. It does not sync settings or send them to the developer. No analytics, advertising, or remote code is included.

The extension opens the websites you choose; those websites receive normal browser requests and apply their own privacy policies. Browser login sessions remain managed by Chrome and the websites. The extension does not read passwords, cookies, or dashboard content.

Optional website access lets the extension add a countdown bar, fade overlay, and floating playback controls to managed playlist tabs and handle your interactions with those controls. Chrome's permission technically permits page access on the approved hosts, including other ports; the extension uses it only for these overlays and controls. Access is requested when you confirm a page during setup or explicitly enable controls later. Declining still allows tab rotation. You can revoke site access through Chrome's extension settings. Bundled fictional demo pages do not require website access.

Removing the extension removes its stored settings. Closing the display or pausing stops scheduled playback as described in the installation guide.

Display tab identifiers are tracked in session storage so Stop & close signage can close displays launched in that browser session, including previous playlists. Stop preserves saved settings and does not close unrelated or setup/login-check tabs.

Individual page durations are stored with the local playlist and setup drafts. Reset settings to defaults restores timing/display preferences and clears setup drafts, while retaining saved page URLs/names and Chrome site permissions.

Publisher: add your support contact and host this policy at a public URL before store submission.
