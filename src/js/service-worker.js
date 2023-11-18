// Background Service Worker JS

import { createContextMenus } from './exports.js'

chrome.runtime.onInstalled.addListener(onInstalled)
chrome.commands.onCommand.addListener(onCommand)
// chrome.runtime.onMessage.addListener(onMessage)
chrome.contextMenus.onClicked.addListener(onClicked)

chrome.notifications.onClicked.addListener((notificationId) => {
    console.log(`notifications.onClicked: ${notificationId}`)
    chrome.notifications.clear(notificationId)
})

// chrome.storage.onChanged.addListener((changes, namespace) => {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//         console.log(
//             `Storage key "${key}" in namespace "${namespace}" changed. Old/New:`,
//             oldValue,
//             newValue
//         )
//     }
// })

/**
 * Init Context Menus and Options
 * * @function onInstalled
 *  * @param {InstalledDetails} details
 *  */
export async function onInstalled(details) {
    console.log('onInstalled:', details)
    const defaultOptions = {
        favoriteColor: '',
        contextMenu: true,
        showUpdate: true,
    }
    let { options, sites } = await chrome.storage.sync.get(['options', 'sites'])
    options = options || defaultOptions
    sites = sites || []
    console.log('options:', options, 'sites:', sites)
    await chrome.storage.sync.set({ options, sites })
    if (options.contextMenu) {
        createContextMenus()
    }
    // Check if Installed or Updated and Show Options or Release Notes
    if (details.reason === 'install') {
        const url = chrome.runtime.getURL('/html/options.html')
        await chrome.tabs.create({ active: true, url })
    } else if (options.showUpdate && details.reason === 'update') {
        const manifest = chrome.runtime.getManifest()
        if (manifest.version !== details.previousVersion) {
            const url = `https://github.com/smashedr/web-extension-template/releases/tag/${manifest.version}`
            console.log(`url: ${url}`)
            await chrome.tabs.create({ active: true, url })
        }
    }
}

/**
 * onCommand Callback
 * @function onCommand
 * @param {String} command
 */
async function onCommand(command) {
    console.log(`onCommand: command: ${command}`)
    if (command === 'inject-alert') {
        console.log('toggle-site')
        await injectFunction(alertFunction, ['Hello World'])
    } else {
        console.warn(`Unknown command: ${command}`)
    }
}

// /**
//  * onMessage Callback
//  * @function onMessage
//  * @param {Object} message
//  * @param {MessageSender} sender
//  */
// async function onMessage(message, sender) {
//     // console.log('onMessage:', message, sender)
//     console.log(`message.badgeText: ${message.badgeText}`)
//     if (message.badgeText) {
//         console.log(`tabId: ${sender.tab.id}, text: ${message.badgeText}`)
//         chrome.action.setBadgeText({
//             tabId: sender.tab.id,
//             text: message.badgeText,
//         })
//         chrome.action.setBadgeBackgroundColor({
//             tabId: sender.tab.id,
//             color: 'green',
//         })
//     }
// }

/**
 * Context Menu Click Callback
 * @function onClicked
 * @param {OnClickData} ctx
 * @param {Tab} tab
 */
async function onClicked(ctx, tab) {
    console.log('onClicked:', ctx, tab)
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
        const favoriteColor = ctx.selectionText.trim()
        console.log(`favoriteColor: ${favoriteColor}`)
        if (favoriteColor.length > 32) {
            await sendNotification(
                'Error',
                'Color is longer than 32 characters long.'
            )
        } else {
            const { options } = await chrome.storage.sync.get(['options'])
            options.favoriteColor = favoriteColor
            await chrome.storage.sync.set({ options })
            await sendNotification(
                'Favorite Color Saved',
                `Color: ${options.favoriteColor}`
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
 * Function to send alert with message for testing
 * @function findLink
 * @param {String} message
 */
function alertFunction(message) {
    alert(`Alert: ${message}`)
}

/**
 * Inject Function into Current Tab with args
 * @function injectFunction
 * @param {Function} func
 * @param {Array} args
 */
async function injectFunction(func, args) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: func,
        args: args,
    })
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
