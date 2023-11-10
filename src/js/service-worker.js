// Background Service Worker JS

import { createContextMenus, getTabUrl, toggleSite } from './exports.js'

chrome.runtime.onInstalled.addListener(onInstalled)

chrome.contextMenus.onClicked.addListener(contextMenuClick)

chrome.notifications.onClicked.addListener((notificationId) => {
    console.log(`notifications.onClicked: ${notificationId}`)
    chrome.notifications.clear(notificationId)
})

chrome.commands.onCommand.addListener(onCommand)

// chrome.storage.onChanged.addListener((changes, namespace) => {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//         console.log(
//             `Storage key "${key}" in namespace "${namespace}" changed. Old/New:`,
//             oldValue,
//             newValue
//         )
//     }
// })

async function onCommand(command) {
    console.log(`onCommand: command: ${command}`)
    if (command === 'toggle-site') {
        const { tab, url } = await getTabUrl()
        console.log('toggle-site', tab, url)
        await toggleSite(url)
    } else if (command === 'inject-alert') {
        console.log('toggle-site')
        await injectFunction(alertFunction, ['Hello World'])
    } else {
        console.warn(`Unknown command: ${command}`)
    }
}

/**
 * Init Context Menus and Options
 * @function onInstalled
 */
export async function onInstalled() {
    console.log('onInstalled')
    let { options, sites } = await chrome.storage.sync.get(['options', 'sites'])
    options = options || { favoriteColor: '', contextMenu: true }
    sites = sites || []
    console.log('options:', options, 'sites:', sites)
    await chrome.storage.sync.set({ options, sites })
    if (options.contextMenu) {
        createContextMenus()
    }
}

/**
 * Context Menu Click Callback
 * @function contextMenuClick
 * @param {OnClickData} ctx
 */
async function contextMenuClick(ctx) {
    console.log('contextMenuClick:', ctx)
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
        // } else if (ctx.menuItemId === 'link') {
        //     console.log('navigator:', navigator)
        //     console.log('link:', ctx)
        //     console.log(`ctx.linkUrl: ${ctx.linkUrl}`)
        //     await injectFunction(findLink, [ctx.linkUrl])
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
 * Function to send alert with message for testing
 * @function findLink
 * @param {String} message
 */
function alertFunction(message) {
    alert(`Alert: ${message}`)
}

// /**
//  * Find Link and Copy to Clipboard
//  * @function findLink
//  * @param {String} href
//  */
// function findLink(href) {
//     // let elements = document.querySelectorAll(`a[href=${name}]`)
//     let elements = document.getElementsByTagName('a')
//     let results = new Set()
//     Array.from(elements).forEach(function (e) {
//         if (e.href === href) {
//             const text = e.textContent.trim()
//             if (text) {
//                 results.add(text)
//             }
//         }
//     })
//     results = Array.from(results)
//     console.log(results)
//     if (results.length >= 1) {
//         navigator.clipboard.writeText(results[0])
//         if (results.length > 1) {
//             console.warn('Found Multiple Results:', results)
//         }
//     } else {
//         console.warn('No Results')
//     }
// }

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
