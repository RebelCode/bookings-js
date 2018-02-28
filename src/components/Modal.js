export default function CfModal () {
    return {
        template: '#modal-template',

        inject: ['dom'],

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

        watch: {
            active (isModalActive) {
                this.dom
                    .getElement('body')
                    .classList[isModalActive ? 'add' : 'remove']('modal-opened');
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
    }
}