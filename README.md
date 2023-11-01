[![Build](https://github.com/smashedr/web-extension-template/actions/workflows/build.yaml/badge.svg)](https://github.com/smashedr/web-extension-template/actions/workflows/build.yaml)
[![Manifest Version](https://img.shields.io/github/manifest-json/v/smashedr/web-extension-template?filename=manifest.json&logo=json&label=manifest)](https://github.com/smashedr/web-extension-template/blob/master/manifest.json)
[![GitHub Release Version](https://img.shields.io/github/v/release/smashedr/web-extension-template?logo=github)](https://github.com/smashedr/web-extension-template/releases/latest)
# Web Extension

Modern Chrome and Firefox Web Extension to set and remember your favorite color.

*   [Download](#download)
*   [Features](#features)
*   [Configuration](#configuration)
*   [Development](#development)
    -   [Building](#building)
    -   [Chrome Setup](#chrome-setup)
    -   [Firefox Setup](#firefox-setup)

# Download

*   Firefox: https://addons.mozilla.org/addon/
*   Chrome: https://chrome.google.com/webstore/detail/

# Features

*   Set and Display your Favorite Color
*   Set Selected Text to Favorite Color

# Configuration

You can pin the Addon by clicking the `Puzzle Piece`, find the Web Extension icon, then;  
**Firefox**, click the `Settings Wheel` and `Pin to Toolbar`.  
**Chrome**, click the `Pin` icon.  

To open the options, click on the icon (from above) then click `Open Options`.

# Development

**See Below** for which commands do which, but the general workflow is as follows:

1.  Install node modules and copy libraries to the `src/dist` directory.
1.  Generate the `manifest.json` for the desired browser in the `src/manifest.json` directory.

Quick Start, build and run with web-ext.
```shell
npm install
npm run chrome
npm run firefox
```

For more information on web-ext [read this documentation](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/).  
To pass additional arguments to npm run commands use `--`.  
Example: `npm run chrome -- --chromium-binary=...`

## Building

Install the requirements and copy libraries into the `src/dist` directory by running `npm install`.
See [gulpfile.js](gulpfile.js) for more information on postinstall.
```shell
npm install
```

To load unpacked or temporary addon from the [src](src) folder, you must generate the `src/manifest.json` for the desired browser.
```shell
npm run make-chrome
npm run make-firefox
```

If you would like to create a `.zip` archive of the [src](src) directory for the desired browser.
```shell
npm run build-chrome
npm run build-firefox
npm run build-all
```

For more information on building, see the scripts in the [package.json](package.json) file.

## Chrome Setup

1.  Build or Download a [Release](https://github.com/smashedr/web-extension-template/releases).
1.  Unzip the archive, place the folder where it must remain and note its location for later.
1.  Open Chrome, click the `3 dots` in the top right, click `Extensions`, click `Manage Extensions`.
1.  In the top right, click `Developer Mode` then on the top left click `Load unpacked`.
1.  Navigate to the folder you extracted in step #3 then click `Select Folder`.

## Firefox Setup

Note: Firefox Temporary addon's will **not** remain after restarting Firefox, therefore;
it is very useful to keep addon storage after uninstall/restart with `keepStorageOnUninstall`.

1.  Build or Download a [Release](https://github.com/smashedr/web-extension-template/releases).
1.  Unzip the archive, place the folder where it must remain and note its location for later.
1.  Go to `about:debugging#/runtime/this-firefox` and click `Load Temporary Add-on...`
1.  Navigate to the folder you extracted earlier, select `manifest.json` then click `Select File`.
1.  Open `about:config` search for `extensions.webextensions.keepStorageOnUninstall` and set to `true`.

> **Note**
>
> This method **does not** work on Release Firefox and is NOT recommended for development.
> You must use [ESR](https://www.mozilla.org/en-CA/firefox/all/#product-desktop-esr), Development, or Nightly.

1.  Open `about:config` search for `xpinstall.signatures.required` and set to `false`.
1.  Open `about:addons` and drag the zip file to the page or choose Install from File from the Settings wheel.
