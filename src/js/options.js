// JS for options.html

document.addEventListener('DOMContentLoaded', initOptions)
document.getElementById('options-form').addEventListener('submit', saveOptions)

/**
 * Options Page Init
 * @function initOptions
 */
async function initOptions() {
    console.log('initOptions')
    const { favoriteColor } = await chrome.storage.sync.get(['favoriteColor'])
    console.log(`favoriteColor: ${favoriteColor}`)
    if (favoriteColor) {
        document.getElementById('favoriteColor').value = favoriteColor
    }
}

/**
 * Save Options Click
 * @function saveOptions
 * @param {MouseEvent} event
 */
async function saveOptions(event) {
    event.preventDefault()
    console.log('saveOptions: event:', event)
    const favoriteColor = document.getElementById('favoriteColor').value
    console.log(`favoriteColor: ${favoriteColor}`)
    await chrome.storage.sync.set({ favoriteColor: favoriteColor })
    showToast('Options Saved')
}

/**
 * Show Bootstrap Toast
 * Requires: jQuery
 * @function showToast
 * @param {String} message
 * @param {String} bsClass
 */
function showToast(message, bsClass = 'success') {
    // TODO: Remove jQuery Dependency
    const toastEl = $(
        '<div class="toast align-items-center border-0 mt-3" role="alert" aria-live="assertive" aria-atomic="true">\n' +
            '    <div class="d-flex">\n' +
            '        <div class="toast-body">Options Saved</div>\n' +
            '        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>\n' +
            '    </div>\n' +
            '</div>'
    )
    toastEl.find('.toast-body').text(message)
    toastEl.addClass('text-bg-' + bsClass)
    $('#toast-container').append(toastEl)
    const toast = new bootstrap.Toast(toastEl)
    toast.show()
}
