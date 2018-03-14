/**
 * Modal component. Modal's consumer responsible for
 * providing any content to this modal, working with
 * date inside provided content, catching button clicks, etc.
 *
 * This is only UI box that can be opened and closed.
 *
 * @param AbstractDialog
 * @constructor
 */
export default function CfModal (AbstractDialog) {
  return AbstractDialog.extend({
    template: '#modal-template',

    props: {
      /**
       * Modal title
       *
       * @property {string}
       */
      title: {
        type: String
      },

      /**
       * Additional class modifier for modal customization.
       *
       * @property {string}
       */
      modalBodyClass: {
        type: String,
        default: ''
      },

      /**
       * @inherit
       */
      dialogOpenedClass: {
        type: String,
        default: 'modal-opened'
      }
    }
  })
}