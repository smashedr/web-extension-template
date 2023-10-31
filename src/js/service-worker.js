// Background Service Worker JS

chrome.runtime.onInstalled.addListener(function () {
    const contexts = [
        // ['link', 'Link Menu'],
        // ['page', 'Page Menu'],
        ['selection', 'Copy Selection to Clipboard'],
        // ['audio', 'Audio Menu'],
        // ['image', 'Image Menu'],
        // ['video', 'Video Menu'],
    ]
    for (const context of contexts) {
        chrome.contextMenus.create({
            title: context[1],
            contexts: [context[0]],
            id: context[0],
        })
    }
})

chrome.contextMenus.onClicked.addListener(async function (ctx) {
    console.log('ctx:', ctx)
    console.log('ctx.menuItemId: ' + ctx.menuItemId)
    if (ctx.menuItemId === 'selection') {
        console.log('clipboardWrite: ctx.selectionText:', ctx.selectionText)
        await clipboardWrite(ctx.selectionText)
        await sendNotification('Copied', ctx.selectionText.substring(0, 50))
    }
})

chrome.notifications.onClicked.addListener((notificationId) => {
    // You need to provide an id to the sendNotification function to make this usable
    console.log(`notifications.onClicked: ${notificationId}`)
    chrome.notifications.clear(notificationId)
})

/**
 * Send Browser Notification
 * @function sendNotification
 * @param {string} title
 * @param {string} text
 * @param {string} id
 * @param {number} timeout
 */
async function sendNotification(title, text, id = '', timeout = 10) {
    console.log(`sendNotification: ${id}: ${title} - ${text}`)
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
 * @param {string} value
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
