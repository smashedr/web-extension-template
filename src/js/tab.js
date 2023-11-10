// Content Script JS tab.js

chrome.storage.sync.get(['sites']).then((result) => {
    console.log(result.sites)
    if (result.sites.includes(window.location.host)) {
        console.log(`ACTIVE: ${window.location.host}`)
        updateLinks()
        const observer = new MutationObserver(function () {
            updateLinks()
        })
        observer.observe(document.body, { subTree: true, attributes: true })
        console.log('done')
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
