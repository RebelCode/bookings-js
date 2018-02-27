import {FunctionalArrayCollection} from '@rebelcode/std-lib';

export default function CfModalNewBooking (Vue, Repeater, Datepicker) {
    return {
        inject: ['store', 'modalStateToggleable', 'modal'],
        data () {
            return {
                repeats: 'weekly',

                exclusionsPickerVisible: false,
                excludedPlaceholder: null,
                excludes: {
                    dates: [
                        new Date(2018, 1, 22),
                        new Date(2018, 1, 23),
                        new Date(2018, 1, 24),
                    ]
                },

                excludesDatesCollection: new FunctionalArrayCollection(() => {
                    return this.excludes.dates;
                }, (newDates) => {
                    this.excludes.dates = newDates;
                }, (date) => {
                    return date.toDateString();
                })
            }
        },
        computed: {
            fromDate: {
                get () {
                    return this.store.state.serviceAvailabilityModel.fromDate;
                },

                set (newDate) {
                    this.store.commit('SET_AVAILABILITY_FROM_DATE', newDate);
                }
            },

            modalState ()
            {
                return this.modalStateToggleable;
            }
        },
        methods: {
            _getExclusionItemTitle (date) {
                return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            },

            excludeDateSelected (date) {
                if(this.excludesDatesCollection.hasItem(date)) {
                    this.excludesDatesCollection.removeItem(date);
                }
                else {
                    this.excludesDatesCollection.addItem(date);
                }
                this.$refs.exclusions.selectedDate = null;
            },

            saveNewBooking () {
                // this.store.dispatch('sdf', this.)
                // booking saving logic
            }
        },
        components: {
            Repeater,
            modal: 'modal',
            Datepicker
        }
    }
}