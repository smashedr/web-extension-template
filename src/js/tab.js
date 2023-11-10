// Content Script JS tab.js

chrome.storage.sync.get(['sites']).then((result) => {
    console.log(result.sites)
    if (result?.sites?.includes(window.location.host)) {
        console.log(`ENABLED: ${window.location.host}`)
        chrome.runtime.sendMessage({ badgeText: 'On' })
        updateLinks()
        const observer = new MutationObserver(function () {
            updateLinks()
        })
        observer.observe(document.body, { subTree: true, attributes: true })
        console.log('done')
    } else {
        console.log(`DISABLED: ${window.location.host}`)
    }
})

/**
 * Update Links
 * @function updateLinks
 */
function updateLinks() {
    console.log('updateLinks')
    const elements = document.getElementsByTagName('a')
    for (const el of elements) {
        if (el.href !== '#') {
            el.target = '_blank'
            el.setAttribute('rel', 'nofollow')
        }
    }
}
