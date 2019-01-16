export default class Widget {
  constructor() {
    // Start on document ready
    document.addEventListener('DOMContentLoaded', () => this._init())
  }

  // Check for widgetry buttons and create iframes and add event handlers
  _init() {
    let buttons = document.querySelectorAll('.widgetry-button')
    if (!buttons.length) return

    this._addStyles()
    for (let button of buttons) {
      let url       = button.getAttribute('href')
      // Check options specified in `data-` attributes
      let embedded  = button.getAttribute('data-embedded') === 'true'
      let addButton = button.getAttribute('data-button') === 'true'
      let iframe    = this._createIframe(button, embedded, url)

      button.addEventListener('click', (e) => this._handleButtonClick(iframe, e))
      if (!embedded) {
        // Prefetch content on hover
        if (addButton) url = `${url}?button=true`
        button.addEventListener('mouseover', (e) => this._fetch(iframe, url), { once: true })
      }
    }
  }

  // Show iframe popup
  _handleButtonClick(iframe, e) {
    e.preventDefault()
    iframe.classList.add('widgetry-visible')
  }

  // Prefetch content
  _fetch(iframe, url) {
    fetch(url).then((response) => this._handleRemote(iframe, response))
  }

  // Fill the iframe with the fetched response
  _handleRemote(iframe, response) {
    response.text().then((html) => {
      let iframeDoc = this._fillIframe(iframe, html)
      let htmlElement = iframeDoc.getElementsByTagName('html')[0]
      htmlElement.addEventListener('click', (e) => this._handleIframeClick(iframe, e))
    })
  }

  // If clicking outside the iframe contents, close popup
  _handleIframeClick(iframe, e) {
    if (e.target.tagName === 'BODY' || e.target.tagName === 'HTML') {
      iframe.classList.remove('widgetry-visible')
    }
  }

  // Create an embedded/overlay iframe
  _createIframe(button, embedded, url) {
    let iframe = document.createElement('iframe')
    iframe.setAttribute('allowfullscreen', 'allowfullscreen')
    iframe.classList.add('widgetry-frame')
    if (embedded) {
      iframe.classList.add('widgetry-embedded')
      button.parentNode.replaceChild(iframe, button)
    } else {
      iframe.classList.add('widgetry-overlay')
      document.body.appendChild(iframe)
    }
    // Add a loader before content is fetched remotely
    this._fillIframe(iframe, '<html><body><div style="text-align:center; margin:calc(35%) auto 0; width:100px; background:#fff; border-radius:16px; padding:8px 14px; font-family:sans-serif">Loading ...</div></body></html>')
    if (embedded) this._fetch(iframe, `${url}?embedded=true`)
    return iframe
  }

  // Add content to iframe
  _fillIframe(iframe, html) {
    let iframeDoc = iframe.contentWindow.document
    iframeDoc.open()
    iframeDoc.write(html)
    iframeDoc.close()
    return iframeDoc
  }

  // Add some styles for overlay and embedded iframes
  _addStyles() {
    let sheet = this._createSheet()
    sheet.addRule('.widgetry-overlay', 'position: fixed !important')
    sheet.addRule('.widgetry-overlay', 'top: 0 !important')
    sheet.addRule('.widgetry-overlay', 'left: 0 !important')
    sheet.addRule('.widgetry-overlay', 'width: 100% !important')
    sheet.addRule('.widgetry-overlay', 'height: 100% !important')
    sheet.addRule('.widgetry-overlay', 'background: rgba(127, 144, 197, 0.28)')
    sheet.addRule('.widgetry-overlay', 'z-index: 100000 !important')
    sheet.addRule('.widgetry-overlay', 'display: none !important')
    sheet.addRule('.widgetry-frame', 'border: 0 none transparent !important')
    sheet.addRule('.widgetry-embedded', 'width: 100% !important')
    sheet.addRule('.widgetry-embedded', 'max-width: 670px !important')
    sheet.addRule('.widgetry-embedded', 'height: 470px !important')
    sheet.addRule('.widgetry-overlay.widgetry-visible', 'display: block !important')
  }

  // Create a stylesheet inside the document body
  _createSheet() {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(''))
    document.body.appendChild(style)
    return style.sheet
  }
}
