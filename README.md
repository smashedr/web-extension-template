# Web Extension

Modern Chrome and Firefox Web Extension to remember your favorite color.

*   [Download](#download)
*   [Features](#features)
*   [Configuration](#configuration)
*   [Development](#development)
    -   [Chrome Setup](#chrome-setup)
    -   [Firefox Setup](#firefox-setup)

# Download

*   Firefox: https://addons.mozilla.org/addon/
*   Chrome: https://chrome.google.com/webstore/detail/

# Features

*   Set and Display your Favorite Color

# Configuration

You can pin the Addon by clicking the `Puzzle Piece`, find the Web Extension icon, then;  
**Firefox**, click the `Settings Wheel` and `Pin to Toolbar`.  
**Chrome**, click the `Pin` icon.  

To open the options, click on the icon (from above) then click `Open Options`.

# Development

To build locally or run from source, clone the repository then run `npm install`.
You can then run the addon from the [src](src) directory as normal.

NPM is only used to manage dependency versions and copy files to `src/dist`.
Files are copied automatically after `npm install`. See [gulpfile.js](gulpfile.js) for more information.

The extension is automatically built on new releases then automatically uploaded to that release.
See [build.yaml](.github/workflows/build.yaml) for more information.

## Chrome Setup

1.  Download a [Release](https://github.com/cssnr/link-extractor/releases).
1.  Unzip the archive, place the folder where it must remain and note its location for later.
1.  Open Chrome, click the `3 dots` in the top right, click `Extensions`, click `Manage Extensions`.
1.  In the top right, click `Developer Mode` then on the top left click `Load unpacked`.
1.  Navigate to the folder you extracted in step #3 then click `Select Folder`.

## Firefox Setup

For development, you can and should load unpacked in Firefox as a temporary addon.
This will **not** remain after restarting Firefox. It is also useful to keep data after removing an extension.

1.  Download a [Release](https://github.com/cssnr/link-extractor/releases).
1.  Load temporary from: `about:debugging#/runtime/this-firefox`
1.  Open `about:config` search for `extensions.webextensions.keepStorageOnUninstall` and set to `true`.

> **Note**
>
> This method **does not** work on Release Firefox and is NOT recommended for development.
> You must use [ESR](https://www.mozilla.org/en-CA/firefox/all/#product-desktop-esr), Development, or Nightly.

1.  Open `about:config` search for `xpinstall.signatures.required` and set to `false`.
1.  Open `about:addons` and drag the zip file to the page or choose Install from File from the Settings wheel.
