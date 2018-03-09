/**
 * @param Switcher
 * @constructor
 */
export default function CfBoolSwitcher (Switcher) {
  return Switcher.extend({
    template: '#bool-switcher-template',

    props: {
      danger: {
        default: false
      },
      buttons: {
        type: Object,
        default () {
          return {
            yes: 'Yes',
            no: 'No'
          }
        }
      }
    },

    methods: {
      /**
       * Switch state on click.
       *
       * @param buttonId
       */
      buttonClicked (buttonId) {
        this.$emit('input', !this.value)
      }
    }
  })
}