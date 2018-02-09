export default function CfModalNewBooking (Vue) {
    return Vue.extend({
        inject: ['store', 'modalStateToggleable'],
        computed: {
            modalState ()
            {
                return this.modalStateToggleable;
            }
        },
        methods: {
            saveNewBooking ()
            {
                // booking saving logic
            }
        }
    })
}