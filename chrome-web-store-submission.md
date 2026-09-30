# ScreenLoop Signage — Chrome Web Store submission

Prepared for version 2.0.0. Copy the text blocks into the matching dashboard fields. Instructions outside the blocks are for the publisher, not listing copy. Images are being prepared separately. This file does not submit or publish the extension.

## 1. Listing details

| Field | Value |
| --- | --- |
| Name | ScreenLoop Signage |
| Publisher | Biraj Gautam |
| Version | 2.0.0 |
| Language | English |
| Suggested category | Productivity; choose Tools if offered as its relevant subcategory |
| Homepage | https://birajgtm.com.np/project/screenloop-signage |
| Support URL | https://birajgtm.com.np/project/screenloop-signage |
| Support email | support@birajgtm.com.np |
| Privacy policy URL | https://birajgtm.com.np/project/screenloop-signage/privacy-policy |
| Mature content | No; the extension and its bundled demo contain no mature content |

The support URL points to the project page containing the support contact. If an Official URL field is available, select birajgtm.com.np after verifying ownership through the dashboard. Do not claim verified-publisher status before verification.

### Short description

This matches the packaged manifest description:

```text
Turn browser tabs into a signage playlist with timed rotation, refresh, and a customizable countdown bar.
```

### Detailed description

```text
Turn websites and dashboards into a rotating fullscreen display with ScreenLoop Signage.

Build a playlist for an office screen, reception display, monitoring dashboard, or shared announcement board. ScreenLoop opens normal Chrome tabs using the browser profile where you already sign in. No separate signage server, iframe setup, or dashboard API is required.

YOUR PAGES, YOUR TIMING
• Add up to 50 website pages with optional names.
• Reorder your playlist and choose 5–600 seconds per page.
• Pause, resume, skip backward or forward, and toggle fullscreen.
• Optionally refresh managed pages automatically during playback.
• Keep a single page open with an activity indicator instead of a countdown.

A CLEAN DISPLAY
• Start signage fullscreen, with controls briefly visible to help you get oriented.
• Reveal floating playback controls with pointer activity; they hide when idle.
• Hide the idle mouse pointer in fullscreen.
• Choose your timer accent and use a slim, contrasting frosted-glass track.
• Soften page switches with an optional fade that respects reduced-motion preferences.
• Choose System, Light, or Dark appearance for extension pages.

SIMPLE SETUP
Add a website, open it, sign in directly if needed, and confirm that the page is ready. Setup drafts save on your device. Try the three bundled fictional demo pages without signing in or configuring a website.

OPTIONAL WEBSITE ACCESS
Website access enables the countdown, transitions, pointer behavior, and floating controls on managed signage pages. You can decline access and still rotate tabs. When a managed tab navigates to another website, ScreenLoop reads its current URL so you can grant access to that destination. It does not collect a general browsing history.

LOCAL DATA HANDLING
Playlist URLs, page names, preferences, and setup drafts stay in Chrome’s local extension storage. Playback state and tab identifiers are held in session storage. Pointer and keyboard events are handled locally to operate controls and manage visibility; typed text is not recorded. ScreenLoop does not transmit this information to its publisher and contains no analytics or advertising. Websites you open handle their own normal browser requests under their own policies.

PLEASE NOTE
Short page times can be delayed if your computer sleeps or Chrome suspends the extension. Some browser-restricted pages cannot display overlays. Login sessions must be in the Chrome profile running ScreenLoop. Stop & close signage closes tracked display tabs from the current browser session, so save any work in those tabs first.

Developed by Biraj Gautam.
Support: support@birajgtm.com.np
Website: https://birajgtm.com.np/project/screenloop-signage
Privacy: https://birajgtm.com.np/project/screenloop-signage/privacy-policy
```

## 2. Single purpose

```text
ScreenLoop Signage turns a user-selected playlist of websites into a timed fullscreen signage display. Its page rotation, refresh, timer, playback controls, and visual settings support presenting that playlist in Chrome using existing website login sessions.
```

## 3. Permission justifications

### alarms

```text
Schedules automatic switching between managed playlist tabs and optional page refresh while signage is playing. Alarms also provide recovery for short-duration timers if the service worker is interrupted. Rotation and refresh are canceled when playback is paused or stopped. This supports the extension’s timed signage purpose.
```

### storage

```text
Stores playlist URLs, page names, durations, visual preferences, appearance, and setup drafts in chrome.storage.local. Uses chrome.storage.session for playback state, timing, managed tab/window identifiers, and overlay error notices. Settings remain available between browser sessions, while session state supports safe playback and closing only tracked display tabs. No chrome.storage.sync or developer backend is used.
```

### scripting

```text
Injects packaged code into managed signage tabs, with approved host access, to draw the countdown bar, floating playback controls, page-transition effect, and idle-pointer behavior. It also prepares cursor styling before a managed tab switch. The extension does not use this permission to scrape website content, read passwords, or execute remotely hosted code.
```

### tabs

```text
Reads the current managed signage tab’s URL after a user follows a link or the page redirects, so the popup can request optional access to the actual destination website. Existing host permission may cover only the original playlist site, and the signage tab may be in a different window from the popup. The tabs permission permits reading URLs and titles; ScreenLoop uses it for this destination-aware recovery, not to collect a general browsing history or transmit browsing information.
```

### Host permissions: http://*/* and https://*/*

Use this in the host-permission field; if the dashboard lists the two patterns separately, use it for each:

```text
These are optional host permissions because users choose their own public websites, authenticated dashboards, and local-network pages. ScreenLoop requests access only to the hosts needed for the selected pages or the current signage destination, after a user action. It uses approved access for packaged timer, transition, playback-control, and idle-pointer code. Access is host-scoped, not limited to one URL path. Users can decline or revoke access and still rotate tabs without overlays. The extension does not require blanket access to all websites at installation.
```

## 4. Remote code

Select **No** for remotely hosted executable code.

Explanation, if a text field is available:

```text
All executable extension code is included in the uploaded package. ScreenLoop does not download scripts, use remote JavaScript libraries, or evaluate code received from a server. It opens user-selected websites in ordinary Chrome tabs; those websites are not loaded as extension code.
```

## 5. Data-use disclosures

Recommended selections below are based on the current implementation. Local-only processing still needs disclosure under Google’s user-data guidance. These selections describe data handling, not transmission to the publisher. Check the dashboard’s current wording when entering them.

| Data category | Suggested selection | Reason |
| --- | --- | --- |
| Web history | Select | User-entered playlist URLs are stored locally, and the current managed tab URL is read for destination permission recovery. This is not a general history log. |
| User activity | Select | Pointer events, keyboard events, and control interactions are processed locally for playback controls and visibility. Only temporary timing state is retained; typed text is not recorded. |
| Personally identifiable information | Do not select | No extension account, identity, email-address collection, or identifying profile is required. Optional support email is separate from extension telemetry. |
| Health information | Do not select | No health-data feature or extraction. |
| Financial and payment information | Do not select | No payment processing or financial-data extraction. |
| Authentication information | Do not select | Login occurs directly on websites; the extension does not read passwords, authentication cookies, or login tokens. |
| Personal communications | Do not select | The extension does not read messages or email. |
| Location | Do not select | No geolocation or location collection. |
| Website content | Do not select | Overlays add extension UI; the extension does not extract page text, images, forms, or dashboard content. |

Users can enter arbitrary names and URLs. Do not describe these as anonymized or guaranteed free of sensitive information. Their local handling is covered by the privacy policy.

### Data handling explanation

Use in any explanatory field or reviewer correspondence:

```text
ScreenLoop handles selected website URLs and page names locally to operate the user’s signage playlist. It reads the current managed tab URL to recover optional site permissions after navigation. Pointer and keyboard events are processed locally for control visibility and playback interaction, without recording typed text. Settings and drafts use local extension storage; playback state uses session storage, with temporary visibility deadlines in memory. None of this information is sent to the publisher or an analytics service. Websites opened by the user receive ordinary browser requests and apply their own privacy policies.
```

### Data-use certifications

The current implementation supports affirming the dashboard statements concerning:

- No sale or transfer of user data outside the permitted uses.
- No use or transfer for purposes unrelated to the extension’s single signage purpose.
- No use or transfer to assess creditworthiness or support lending decisions.

These are publisher attestations, not text to paste into the listing. Read and affirm the actual dashboard statements yourself. Do not select an overall “no user data handled” answer merely because data stays on the device.

### Privacy policy field

```text
https://birajgtm.com.np/project/screenloop-signage/privacy-policy
```

## 6. Reviewer testing instructions

```text
No ScreenLoop account, credentials, subscription, or payment is required. The bundled demo uses fictional local content.

DEMO TEST
1. Install the extension in Chrome 120 or later and open its toolbar popup.
2. Choose Try demo. Three bundled pages open in a fullscreen signage window and rotate every 30 seconds.
3. Controls appear for five seconds at startup. Move the pointer to reveal them again. Test Pause/Play, Next, Previous, and Fullscreen.
4. In fullscreen, leave the pointer idle to test hiding; move it or press a key to restore it.
5. Use Stop & close signage to close the tracked demo display tabs.

CUSTOM PLAYLIST TEST
1. Choose Set up my pages or Manage pages, then Add a page.
2. Enter https://example.com with a name and choose Open & check page. Return to setup and choose Page is ready. Approve optional site access to test overlays.
3. Add https://example.org as a second page in the same way. These public pages do not require credentials.
4. Set one page to 5 seconds and the other to 30 seconds. The playlist shows one short-timing note. Choose Save & start.
5. Confirm timed switching, the countdown bar, and manual navigation. Pause and resume to check remaining-time behavior. A single-page playlist instead shows an activity bar with Previous/Next disabled.
6. Test declining optional site access with a fresh site: rotation remains available without overlays. If navigating a managed tab to a new host, open the popup and choose Enable controls to grant access to that destination.

SETTINGS AND CLEANUP
1. Open All settings. Test Appearance, timer accent, countdown visibility, Fade on page switches, and optional reload.
2. Click Save settings; this stops playback. Restart it from the popup afterward.
3. Reset settings to defaults requires confirmation and retains saved pages and permissions.
4. Stop & close signage closes tracked display tabs from the current browser session, leaving unrelated tabs open.

Short timers may be delayed after sleep or worker interruption; a Chrome alarm provides recovery. Browser-restricted pages cannot display overlays. Website login, if needed for a user’s own dashboard, happens directly on that website.

Support: support@birajgtm.com.np
```

## 7. Optional release highlights

Use only if a release-notes field is presented:

```text
Version 2.0.0 adds System/Light/Dark appearance, 5–600 second page durations, fullscreen startup, idle-pointer hiding, smoother transitions, and a slim frosted timer track. It also improves playlist layout, contextual help, permission recovery after navigation, and countdown behavior on first activation.
```

## 8. Submission choices

- Suggested visibility: Public for a general launch; use Unlisted if you want link-only installation initially. Choose in the dashboard; this file does not change distribution.
- Price: no paid features or subscriptions are implemented.
- Credentials: none for the demo or public-page test above.
- Images: supplied separately by the publisher.
- Validation: six automated simulated Chrome/DOM suites have passed. Do not claim complete live-browser acceptance testing; test the exact ZIP before submission, especially packaged short timers, first-load transitions, permission prompts, and fullscreen behavior.
- This text is submission material, not a guarantee of approval. The package and actual behavior control review outcomes.

## Reference guidance

- [Chrome Web Store listing fields](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
- [Privacy fields and permission justifications](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [User-data FAQ, including local processing](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)
- [Preparing the extension package](https://developer.chrome.com/docs/webstore/prepare)
