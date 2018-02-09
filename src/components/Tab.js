export default function CfTab(Vue) {
    return Vue.extend({
        props: {
            title: {
                type: String
            }
        },

        render (h) {
            return h('div', this.$slots.default);
        }
    });
}