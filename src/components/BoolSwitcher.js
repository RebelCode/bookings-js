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
      trueValue: {
        default: 'yes'
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

    computed: {
      activeButton () {
        let buttons = Object.keys(this.buttons)
        if(buttons[1] !== this.trueValue) {
          buttons.reverse()
        }
        return buttons[Number(this.value)]
      }
    },

    methods: {
      /**
       * Switch state on click.
       *
       * @param buttonId
       */
      buttonClicked (buttonId) {
        this.$emit('input', buttonId === this.trueValue)
      }
    }
  })
}