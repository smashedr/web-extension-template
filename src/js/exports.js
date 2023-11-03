// JS Exports

/**
 * Create Context Menus
 * @function createContextMenus
 */
export function createContextMenus() {
    const contexts = [
        // [['link'], 'link', 'Link Menu'],
        [['page'], 'page', 'Copy Page URL to Clipboard'],
        [['selection'], 'color', 'Set Selection as Favorite Color'],
        [['selection'], 'copy', 'Copy Selection to Clipboard'],
        [['page', 'selection'], 'separator', 'separator-1'],
        [['page', 'selection'], 'options', 'Open Options'],
        // [['audio'], 'audio', 'Audio Menu'],
        // [['image'], 'image', 'Image Menu'],
        // [['video'], 'video', 'Video Menu'],
    ]
    for (const context of contexts) {
        if (context[1] === 'separator') {
            chrome.contextMenus.create({
                type: context[1],
                contexts: context[0],
                id: context[2],
            })
        } else {
            chrome.contextMenus.create({
                title: context[2],
                contexts: context[0],
                id: context[1],
            })
        }
    }
}
