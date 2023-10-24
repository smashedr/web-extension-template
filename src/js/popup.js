// JS for popup.html

jQuery('html').hide().fadeIn('slow')

document.querySelectorAll('[data-href]').forEach((el) => {
    el.addEventListener('click', popupLink)
})

document.addEventListener('DOMContentLoaded', initPopup)

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    const { favoriteColor } = await chrome.storage.sync.get(['favoriteColor'])
    console.log(favoriteColor)
    if (favoriteColor) {
        console.log('set favoriteColor')
        document.getElementById('favoriteColor').textContent = favoriteColor
    }
}

/**
 * Popup Links Callback
 * because firefox needs us to call window.close() from the popup
 * @function popupLink
 * @param {MouseEvent} event
 */
async function popupLink(event) {
    const url = chrome.runtime.getURL(event.target.dataset.href)
    console.log(`url: ${url}`)
    await chrome.tabs.create({ active: true, url })
    window.close()
}
