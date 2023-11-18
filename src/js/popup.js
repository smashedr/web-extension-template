// JS for popup.html

// import { getTabUrl, toggleSite } from './exports.js'

document.addEventListener('DOMContentLoaded', initPopup)

document.querySelectorAll('[data-href]').forEach((el) => {
    el.addEventListener('click', popupLink)
})

document.getElementById('grant-perms').addEventListener('click', grantPerms)

// document.getElementById('toggle-site').addEventListener('click', toggleSiteBtn)

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    // const { options, sites } = await chrome.storage.sync.get([
    //     'options',
    //     'sites',
    // ])
    // const { tab, url } = await getTabUrl()
    // console.log(tab, url)
    // if (url.toString().startsWith('http')) {
    //     document.getElementById('site-hostname').textContent =
    //         url.hostname.substring(0, 36)
    //     let hasPerms = await chrome.permissions.contains({
    //         origins: ['http://*/*', 'https://*/*'],
    //     })
    //     if (!hasPerms) {
    //         document.getElementById('grant-perms').style.display = 'block'
    //         document.getElementById('host-content').style.display = 'none'
    //     } else if (sites.includes(url.hostname)) {
    //         document.getElementById('toggle-site').checked = true
    //     }
    // } else {
    //     document.getElementById('host-content').style.display = 'none'
    // }

    let hasPerms = await chrome.permissions.contains({
        origins: ['http://*/*', 'https://*/*'],
    })
    if (!hasPerms) {
        document.getElementById('grant-perms').style.display = 'block'
    }
    const { options } = await chrome.storage.sync.get(['options'])
    if (options.favoriteColor) {
        console.log(`options.favoriteColor: ${options.favoriteColor}`)
        document.getElementById('favoriteColor').textContent =
            options.favoriteColor
    }
}

/**
 * Popup Links Callback
 * because firefox needs us to call window.close() from the popup
 * @function popupLink
 * @param {MouseEvent} event
 */
async function popupLink(event) {
    console.log('popupLink: event:', event)
    let url
    if (event.target.dataset.href.startsWith('http')) {
        url = event.target.dataset.href
    } else {
        url = chrome.runtime.getURL(event.target.dataset.href)
    }
    console.log(`url: ${url}`)
    await chrome.tabs.create({ active: true, url })
    window.close()
}

/**
 * Grant Permissions Button Click Callback
 * @function grantPerms
 * @param {MouseEvent} event
 */
async function grantPerms(event) {
    console.log('grantPerms:', event)
    chrome.permissions.request({
        origins: ['https://*/*', 'http://*/*'],
    })
    window.close()
}

// /**
//  * Enable/Disable Site Button Click Callback
//  * @function toggleSiteBtn
//  * @param {MouseEvent} event
//  */
// async function toggleSiteBtn(event) {
//     console.log('toggleSite:', event.target.checked)
//     let { sites } = await chrome.storage.sync.get(['sites'])
//     sites = sites || []
//     console.log('sites:', sites)
//     // const url = await getTabUrl()
//     const { tab, url } = await getTabUrl()
//     console.log(tab, url)
//     await toggleSite(url)
//     // if (event.target.checked) {
//     //     await enableSite(url)
//     //     if (!sites.includes(url.hostname)) {
//     //         console.log(`Enabling Site: ${url.hostname}`)
//     //         sites.push(url.hostname)
//     //         console.log('sites:', sites)
//     //         await chrome.storage.sync.set({ sites })
//     //     }
//     // } else {
//     //     const index = sites.indexOf(url.hostname)
//     //     if (index > -1) {
//     //         console.log(`Disabling Site: ${url.hostname}`)
//     //         sites.splice(index, 1)
//     //         console.log('sites:', sites)
//     //         await chrome.storage.sync.set({ sites })
//     //     }
//     // }
// }
