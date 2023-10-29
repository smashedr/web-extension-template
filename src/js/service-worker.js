// Background Service Worker JS

chrome.runtime.onInstalled.addListener(function () {
    const contexts = [
        ['link', 'Link Menu'],
        ['page', 'Page Menu'],
        ['selection', 'Selection Menu'],
        ['audio', 'Audio Menu'],
        ['image', 'Image Menu'],
        ['video', 'Video Menu'],
    ]
    for (const context of contexts) {
        chrome.contextMenus.create({
            title: context[1],
            contexts: [context[0]],
            id: context[0],
        })
    }
})

chrome.contextMenus.onClicked.addListener(function (ctx) {
    console.log('ctx:', ctx)
    console.log('ctx.menuItemId: ' + ctx.menuItemId)
})

// chrome.notifications.onClicked.addListener((notificationId) => {
//     console.log(`notifications.onClicked: ${notificationId}`)
// })
