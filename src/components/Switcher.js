export default function CfSwitcher (AbstractButtonGroup) {
    return AbstractButtonGroup.extend({
        template: '#switcher-template',

        props: {
            /**
             * This is component's value, used as
             * v-model property
             */
            value: {},
        },

        mounted () {
            this.$on('button-clicked', (state) => {
                this.$emit('input', state);
            })
        }
    })
}