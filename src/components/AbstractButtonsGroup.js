/**
 * Abstract component for buttons group.
 *
 * It can be used as a base for different cases when
 * few buttons used as a same component (switcher, group).
 *
 * @constructor
 */
export default function CfAbstractButtonsGroup (Vue) {
  return Vue.extend({
    props: {
      /**
       * All buttons that should be rendered. This is
       * an object where keys is button id and value is button's title.
       */
      buttons: {
        type: Object,
        required: true
      }
    },

    methods: {
      /**
       * Button click event handler.
       *
       * Emmit event `button-clicked` with corresponding button identifier.
       * Button's identifier is a key in `states` property.
       *
       * @param buttonId
       */
      buttonClick (buttonId) {
        this.$emit('button-clicked', buttonId)
      }
    }
  })
}