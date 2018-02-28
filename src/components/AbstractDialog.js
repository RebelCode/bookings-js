export default function CfAbstractDialog (Vue) {
    return Vue.extend({
        props: {
            active: {
                type: Boolean
            },
            title: {
                type: String
            }
        },

        watch: {
            active (isModalActive) {
                this.$emit(isModalActive ? 'open' : 'close');
            }
        }
    })
}