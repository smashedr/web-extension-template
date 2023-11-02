// JS Exports

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

/**
 * Inject JS to Tab and Open links.html
 * @function processLinks
 * @param {String} filter
 * @param {Boolean} domains
 */
export async function injectTab(filter, domains) {
    const url = new URL(chrome.runtime.getURL('../html/links.html'))
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    console.log(`tab.id: ${tab.id}`)
    url.searchParams.set('tab', tab.id.toString())
    if (filter) {
        url.searchParams.set('filter', filter)
    } else if (domains) {
        url.searchParams.set('domains', 'yes')
    }
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['/js/inject.js'],
    })
    console.log(`url: ${url.toString()}`)
    await chrome.tabs.create({ active: true, url: url.toString() })
}
