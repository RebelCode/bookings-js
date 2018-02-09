import {FunctionalArrayCollection} from './../../node_modules/std-lib/src/FunctionalArrayCollection';

export default function (state) {
    return function (container) {
        return {
            inject: ['calendar', 'repeater', 'store', 'tabs', 'tab', 'session-length'],
            data () {
                return {
                    activeTab: 1,

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
            components: {
                calendar: 'calendar',
                repeater: 'repeater',
                tabs: 'tabs',
                tab: 'tab',
                'session-length': 'session-length',
            }
        }
    }
};