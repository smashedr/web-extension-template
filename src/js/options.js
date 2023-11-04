// JS for options.html

import { createContextMenus } from './exports.js'

document.addEventListener('DOMContentLoaded', initOptions)
document.getElementById('options-form').addEventListener('submit', saveOptions)

/**
 * Options Page Init
 * @function initOptions
 */
async function initOptions() {
    console.log('initOptions')
    const { options } = await chrome.storage.sync.get(['options'])
    console.log('options:', options)
    document.getElementById('contextMenu').checked = options.contextMenu
    document.getElementById('favoriteColor').value = options.favoriteColor
    const commands = await chrome.commands.getAll()
    document.getElementById('mainKey').textContent =
        commands.find((x) => x.name === '_execute_action').shortcut || 'Not Set'
    document.getElementById('injectAlert').textContent =
        commands.find((x) => x.name === 'inject-alert').shortcut || 'Not Set'
}

/**
 * Save Options Click
 * @function saveOptions
 * @param {MouseEvent} event
 */
async function saveOptions(event) {
    event.preventDefault()
    console.log('saveOptions: event:', event)
    let options = {}
    options.contextMenu = document.getElementById('contextMenu').checked
    options.favoriteColor = document.getElementById('favoriteColor').value
    console.log('options:', options)
    if (options.contextMenu) {
        createContextMenus()
    } else {
        chrome.contextMenus.removeAll()
    }
    await chrome.storage.sync.set({ options })
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
