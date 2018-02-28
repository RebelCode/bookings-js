export default function CfModal (AbstractDialog) {
    return AbstractDialog.extend({
        template: '#modal-template',

        inject: ['dom'],

        mounted () {
            this.$on('open', () => {
                this.dom.getElement('body')
                    .classList
                    .add('modal-opened');
            });

            this.$on('close', () => {
                this.dom.getElement('body')
                    .classList
                    .remove('modal-opened');
            });
        }
    })
}