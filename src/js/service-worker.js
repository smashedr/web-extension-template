// Background Service Worker JS

console.log('service-worker')

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

chrome.notifications.onClicked.addListener((notificationId) => {
    console.log(`notifications.onClicked: ${notificationId}`)
})

chrome.contextMenus.onClicked.addListener(genericOnClick)

function genericOnClick(ctx) {
    console.log(ctx)
    console.log('ctx.menuItemId: ' + ctx.menuItemId)
}
