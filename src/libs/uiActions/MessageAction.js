import UiAction from './UiAction'

/**
 * Prepend message box to some div.
 *
 * @since [*next-version*]
 */
export default class MessageAction extends UiAction {
  /**
   * MessageAction constructor.
   *
   * @since [*next-version*]
   *
   * @param {TemplateRenderFunction} renderMessageBoxTemplate
   * @param {document} document The DOM document.
   * @param {string} selector Selector for the box in which message will be displayed.
   * @param {object} context Context that will be used to render template.
   */
  constructor (renderMessageBoxTemplate, document, { selector, ...context }) {
    super()

    this.renderMessageBoxTemplate = renderMessageBoxTemplate
    this.document = document
    this.selector = selector
    this.context = context

    this.messageBox = null
  }

  /**
   * @inheritDoc
   *
   * @since [*next-version*]
   */
  act () {
    const parentElement = this.document.querySelector(this.selector)

    if (!parentElement) {
      return
    }

    this.messageBox = this.document.createElement('div')
    this.messageBox.innerHTML = this.renderMessageBoxTemplate(this.context)

    parentElement.insertBefore(this.messageBox, parentElement.firstChild)
  }

  /**
   * @inheritDoc
   *
   * @since [*next-version*]
   */
  revert () {
    if (this.messageBox) {
      this.messageBox.remove()
      this.messageBox = null
    }
  }
}
