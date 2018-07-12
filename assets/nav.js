// This file is required by the indetitle.html file and will
// be etitleecuted in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const mainContent = document.querySelector('.main-content');
const sidePanel = document.getElementById('side-panel');
const links = document.querySelectorAll('link[rel="import"]');

sidePanel.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) {
        while (mainContent.firstChild) {
            mainContent.removeChild(mainContent.firstChild);
        }
        classes = e.target.className.split(/\s+/);
        classes.map(x => {
            // Import and add each page to the DOM
            Array.prototype.forEach.call(links, (link) => {
                let template = link.import.querySelector('.template')
                let clone = document.importNode(template.content, true)
                if (link.href.match(`${x}.html`)) {
                    mainContent.appendChild(clone)
                }
            })
        })
    }
    e.stopPropagation();
}, false)




// Import and add each page to the DOM
/*
Array.prototype.forEach.call(links, (link) => {
    let template = link.import.querySelector('.template')
    let clone = document.importNode(template.content, true)
    if (link.href.match('twitch.html')) {
        document.querySelector('.main-content').appendChild(clone)
    }
})
*/
