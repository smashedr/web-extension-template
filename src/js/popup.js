// JS for popup.html

document.addEventListener('DOMContentLoaded', initPopup)
document.getElementById('permissions').addEventListener('click', grantPerms)

document.querySelectorAll('[data-href]').forEach((el) => {
    el.addEventListener('click', popupLink)
})

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    const { options } = await chrome.storage.sync.get(['options'])
    // console.log('options', options)
    if (options.favoriteColor) {
        console.log(`options.favoriteColor: ${options.favoriteColor}`)
        document.getElementById('favoriteColor').textContent =
            options.favoriteColor
    }
    let hasPerms = await chrome.permissions.contains({
        origins: ['http://*/*', 'https://*/*'],
    })
    if (!hasPerms) {
        document.getElementById('permissions').style.display = 'block'
    }
}

/**
 * Grant Permissions Button Click Callback
 * @function grantPerms
 * @param {MouseEvent} event
 */
async function grantPerms(event) {
    console.log('permissions click:', event)

    chrome.permissions.request({
        origins: ['https://*/*', 'http://*/*'],
    })
    window.close()

    // chrome.permissions.request(
    //     {
    //         origins: ['https://*/*', 'http://*/*'],
    //     },
    //     (granted) => {
    //         console.log('granted:', granted)
    //     }
    // )
    // window.close()
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
    if (event.target.dataset.href.startsWith('http')) {
        url = event.target.dataset.href
    } else {
        url = chrome.runtime.getURL(event.target.dataset.href)
    }
    console.log(`url: ${url}`)
    await chrome.tabs.create({ active: true, url })
    window.close()
}
