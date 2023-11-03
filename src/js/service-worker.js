// Background Service Worker JS

import { createContextMenus } from './exports.js'

chrome.runtime.onInstalled.addListener(onInstalled)

chrome.contextMenus.onClicked.addListener(contextMenuClick)

chrome.notifications.onClicked.addListener((notificationId) => {
    // You need to provide an id to the sendNotification function to make this usable
    console.log(`notifications.onClicked: ${notificationId}`)
    chrome.notifications.clear(notificationId)
})

/**
 * Init Context Menus and Options
 * @function onInstalled
 */
export async function onInstalled() {
    console.log('onInstalled')
    let { options } = await chrome.storage.sync.get(['options'])
    options = options || { favoriteColor: '', contextMenu: true }
    console.log('options:', options)
    await chrome.storage.sync.set({ options })
    if (options.contextMenu) {
        createContextMenus()
    }
}

/**
 * Context Menu Click Callback
 * @function contextMenuClick
 * @param {Object} ctx
 */
async function contextMenuClick(ctx) {
    console.log('ctx:', ctx)
    console.log('ctx.menuItemId: ' + ctx.menuItemId)
    if (ctx.menuItemId === 'page') {
        console.log(`ctx.pageUrl: ${ctx.pageUrl}`)
        await clipboardWrite(ctx.pageUrl)
        await sendNotification('Copied Page URL', ctx.pageUrl)
    } else if (ctx.menuItemId === 'copy') {
        const text = ctx.selectionText.trim()
        console.log(`text: ${text}`)
        await clipboardWrite(text)
        await sendNotification('Copied Selection', text.substring(0, 64))
    } else if (ctx.menuItemId === 'color') {
        const favoriteColor = ctx.selectionText.trim().toLowerCase()
        console.log(`favoriteColor: ${favoriteColor}`)
        if (favoriteColor.length > 32) {
            await sendNotification(
                'Error',
                'Color is longer than 32 characters long.'
            )
        } else {
            await chrome.storage.sync.set({ favoriteColor })
            await sendNotification(
                'Favorite Color Saved',
                `Color: ${favoriteColor}`
            )
        }
    } else if (ctx.menuItemId === 'options') {
        const url = chrome.runtime.getURL('/html/options.html')
        await chrome.tabs.create({ active: true, url })
    } else {
        console.error(`Unknown ctx.menuItemId: ${ctx.menuItemId}`)
    }
}

/**
 * Send Browser Notification
 * @function sendNotification
 * @param {String} title
 * @param {String} text
 * @param {String} id
 * @param {Number} timeout
 */
async function sendNotification(title, text, id = '', timeout = 10) {
    console.log(`sendNotification: ${id || 'randomID'}: ${title} - ${text}`)
    const options = {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('images/logo128.png'),
        title: title,
        message: text,
    }
    chrome.notifications.create(id, options, function (notification) {
        setTimeout(function () {
            chrome.notifications.clear(notification)
        }, timeout * 1000)
    })
}

/**
 * Write value to Clipboard for Firefox and Chrome
 * @function clipboardWrite
 * @param {String} value
 */
async function clipboardWrite(value) {
    if (navigator.clipboard) {
        // Firefox
        await navigator.clipboard.writeText(value)
    } else {
        // Chrome
        await chrome.offscreen.createDocument({
            url: 'html/offscreen.html',
            reasons: [chrome.offscreen.Reason.CLIPBOARD],
            justification: 'Write text to the clipboard.',
        })
        await chrome.runtime.sendMessage({
            type: 'copy-data-to-clipboard',
            target: 'offscreen-doc',
            data: value,
        })
    }
}
