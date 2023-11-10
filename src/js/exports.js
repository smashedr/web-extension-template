// JS Exports

/**
 * Create Context Menus
 * @function createContextMenus
 */
export function createContextMenus() {
    const contexts = [
        // [['link'], 'link', 'Copy Link Text'],
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

/**
 * Get URL for Current Tab
 * @function getTabUrl
 * @return {tab, url}
 */
export async function getTabUrl() {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })
    console.log(tab)
    let url = ''
    if (tab.url) {
        url = new URL(tab.url)
    }
    return { tab, url }
}

export async function toggleSite(url) {
    let { sites } = await chrome.storage.sync.get(['sites'])
    if (!sites.includes(url.hostname)) {
        console.log(`Enabling Site: ${url.hostname}`)
        sites.push(url.hostname)
        await chrome.storage.sync.set({ sites })
    } else {
        console.log(`Disabling Site: ${url.hostname}`)
        sites.splice(sites.indexOf(url.hostname), 1)
        console.log('sites:', sites)
        await chrome.storage.sync.set({ sites })
    }
    console.log('sites:', sites)
}
