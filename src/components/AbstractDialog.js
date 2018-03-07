/**
 * Abstract dialog component, solid foundation for
 * any modals and dialogs that opened over the rest page content.
 *
 * @param Vue
 * @constructor
 */
export default function CfAbstractDialog (Vue) {
  return Vue.extend({
    inject: ['dom'],

    props: {
      /**
       * Determines dialog visibility. This property is passed
       * from outside and cannot be changed inside dialog.
       * Dialog's consumer is responsible for manipulating dialog's visibility.
       *
       * @property {bool}
       */
      active: {
        type: Boolean
      },

      /**
       * Class that applies to the body and used
       * to prevent body's scroll catch, so long dialog can be scrolled
       * without interfering with body scroll.
       *
       * @property {string}
       */
      dialogOpenedClass: {
        type: String,
        default: 'dialog-opened'
      }
    },

    mounted () {
      /*
       * Add body "frozen" class to the body when dialog is opened.
       */
      this.$on('open', () => {
        this.dom.getElement('body')
          .classList
          .add(this.dialogOpenedClass);
      });

      /*
       * Remove body "frozen" class from the body when dialog is closed.
       */
      this.$on('close', () => {
        this.dom.getElement('body')
          .classList
          .remove(this.dialogOpenedClass);
      });
    },

    watch: {
      /**
       * Watch for "active" property change and emit corresponding
       * event when it changed.
       *
       * @param isDialogActive {bool}
       */
      active (isDialogActive) {
        this.$emit(isDialogActive ? 'open' : 'close')
      }
    }
  })
}