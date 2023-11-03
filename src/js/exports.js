// JS Exports

/**
 * Create Context Menus
 * @function createContextMenus
 */
export function createContextMenus() {
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
}
