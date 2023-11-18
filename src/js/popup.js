// JS for popup.html

// import { getTabUrl, toggleSite } from './exports.js'

document.addEventListener('DOMContentLoaded', initPopup)

document.querySelectorAll('[data-href]').forEach((el) => {
    el.addEventListener('click', popupLink)
})

document.getElementById('grant-perms').addEventListener('click', grantPerms)

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    let hasPerms = await chrome.permissions.contains({
        origins: ['http://*/*', 'https://*/*'],
    })
    if (!hasPerms) {
        document.getElementById('grant-perms').style.display = 'block'
    }
    const { options } = await chrome.storage.sync.get(['options'])
    if (options.favoriteColor) {
        console.log(`options.favoriteColor: ${options.favoriteColor}`)
        document.getElementById('favoriteColor').textContent =
            options.favoriteColor
    }
}

/**
 * Popup Links Callback
 * because firefox needs us to call window.close() from the popup
 * @function popupLink
 * @param {MouseEvent} event
 */
async function popupLink(event) {
    console.log('popupLink: event:', event)
    let url
    const anchor = event.target.closest('a')
    if (anchor?.dataset?.href) {
        if (anchor.dataset.href.startsWith('http')) {
            url = anchor.dataset.href
        } else {
            url = chrome.runtime.getURL(anchor.dataset.href)
        }
    }
    console.log(`url: ${url}`)
    await chrome.tabs.create({ active: true, url })
    window.close()
}

/**
 * Grant Permissions Button Click Callback
 * @function grantPerms
 * @param {MouseEvent} event
 */
async function grantPerms(event) {
    console.log('grantPerms:', event)
    chrome.permissions.request({
        origins: ['https://*/*', 'http://*/*'],
    })
    window.close()
}
