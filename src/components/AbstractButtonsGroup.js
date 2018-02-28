export default function CfAbstractButtonsGroup (Vue) {
    return Vue.extend({
        props: {
            /**
             * Possible states of switcher. This is
             * an object with keys is a value of v-model
             * and values are switcher titles.
             */
            states: {
                type: Object,
                required: true
            }
        },

        methods: {
            /**
             * Set new state for this component.
             *
             * @param newState
             */
            setState (newState) {
                this.$emit('button-clicked', newState);
            }
        }
    })
}