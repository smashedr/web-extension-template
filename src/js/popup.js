// JS for popup.html

document.addEventListener('DOMContentLoaded', initPopup)

document.querySelectorAll('[data-href]').forEach((el) => {
    el.addEventListener('click', popupLink)
})

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    const { options } = await chrome.storage.sync.get(['options'])
    console.log('options', options)
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
    if (event.target.dataset.href.startsWith('http')) {
        url = event.target.dataset.href
    } else {
        url = chrome.runtime.getURL(event.target.dataset.href)
    }
    console.log(`url: ${url}`)
    await chrome.tabs.create({ active: true, url })
    window.close()
}
