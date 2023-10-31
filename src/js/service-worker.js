// Background Service Worker JS

chrome.runtime.onInstalled.addListener(async function () {
    const contexts = [
        // ['link', 'link', 'Link Menu'],
        ['page', 'page', 'Copy Page URL to Clipboard'],
        ['selection', 'color', 'Set Selection as Favorite Color'],
        ['selection', 'copy', 'Copy Selection to Clipboard'],
        // ['audio', 'audio', 'Audio Menu'],
        // ['image', 'image', 'Image Menu'],
        // ['video', 'video', 'Video Menu'],
    ]
    for (const context of contexts) {
        chrome.contextMenus.create({
            title: context[2],
            contexts: [context[0]],
            id: context[1],
        })
    }
    // Set Default Options
    // let { favoriteColor } = await chrome.storage.sync.get(['favoriteColor'])
    // if (!favoriteColor) {
    //     await chrome.storage.sync.set({ favoriteColor: '' })
    // }
})

chrome.contextMenus.onClicked.addListener(async function (ctx) {
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
    } else {
        console.error(`UNKNOWN ctx.menuItemId: ${ctx.menuItemId}`)
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
