import {FunctionalArrayCollection} from '@rebelcode/std-lib';

export default function (state) {
    return function (container) {
        return {
            inject: [
                'calendar', 
                'repeater',
                'store', 
                'tabs', 'tab', 'modal', 
                'session-length', 'modal-new-booking', 
                'modalStateToggleable'
            ],
            data () {
                return {
                    activeTab: 0,

                    tabsConfig: {
                        switcherClass: 'horizontal-tabs',
                        switcherItemClass: 'horizontal-tabs__item',
                        switcherActiveItemClass: '_active',
                        tabsClass: 'tabs-content'
                    },
                }
            },
            computed: {
                events () {
                    return this.store.state.app.events;
                }
            },
            mounted () {
                if(!state) {
                    throw new Error('App state not initialized');
                }

                this.store.commit('SET_INITIAL_STATE', state);
            },
            methods: {
                dayClick (date, jsEvent, view) {
                    if(view.name !== 'month' && view.name !== 'agendaWeek') return;

                    console.info(date, jsEvent, view);

                    this.store.commit('SET_AVAILABILITY_FROM_DATE', date.format('DD/MM/YYYY'));
                    this.modalStateToggleable.setState(true);
                }
            },
            components: {
                calendar: 'calendar',
                repeater: 'repeater',
                tabs: 'tabs',
                tab: 'tab',
                modal: 'modal',
                'session-length': 'session-length',
                'modal-new-booking': 'modal-new-booking',
            }
        }
    }
};