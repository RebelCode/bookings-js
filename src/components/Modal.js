export default function CfModal (Vue) {
    return Vue.extend({
        template: require('./../templates/modal.html'),

        props: {
            active: {
                type: Boolean
            },
            actions: {
                type: Object
            },
            title: {
                type: String
            }
        },

        computed: {
            buttons () {
                return Object.keys(this.actions).map((actionKey, i) => {
                    return {
                        id: actionKey,
                        title: this.actions[actionKey],
                        primary: i === 0
                    };
                }).reverse()
            }
        }
    })
}