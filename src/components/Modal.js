export default function CfModal (Vue) {
    return Vue.extend({
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

        methods: {
            _renderCloseButton (h) {
                let vm = this;

                return h('div', {
                    class: 'modal__close',
                    on: {
                        click () {
                            vm.$emit('cancel');
                        }
                    },
                    domProps: {
                        innerHTML: '&times;'
                    },
                })
            },

            _renderFooterButton (h, id, title, primary = false) {
                let vm = this;

                return h('input', {
                    class: {
                        'button': true,
                        'button-primary': primary
                    },
                    attrs: {
                        value: title,
                        type: 'button'
                    },
                    on: {
                        click () {
                            vm.$emit(id);
                        }
                    }
                })
            },

            _renderFooterActions (h) {
                return Object.keys(this.actions).map((actionKey, i) => {
                    return this._renderFooterButton(h, actionKey, this.actions[actionKey], i === 0);
                }).reverse();
            }
        },

        render (h) {
            let modal = [];

            if(this.active) {
                modal = [h('div', {class: 'modal'}, [
                    h('div', {class: 'modal__body'}, [
                        h('div', {class: 'modal__header'}, [
                            this.title,
                            this._renderCloseButton(h)
                        ]),
                        h('div', {class: 'modal__content'}, this.$slots.default),
                        h('div', {class: 'modal__footer'}, this._renderFooterActions(h))
                    ])
                ])]
            }

            return h('transition', {
                props: {
                    name: 'modal-transition'
                }
            }, modal)
        }
    })
}