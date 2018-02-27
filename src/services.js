import applicationFactory from './components/Application.js';
import CfSessionLength from "./components/SessionLength";
import CfModal from "./components/Modal";
import CfModalNewBooking from "./components/ModalNewBooking";
import {FunctionalToggleable} from '@rebelcode/std-lib';

export function services(dependencies, document) {
    return {
        vuex: function (container) {
            let Vue = container.vue,
                Vuex = dependencies.vuex;

            Vue.version = container._vue.version;
            Vue.config = container._vue.config;

            Vue.use(Vuex);

            return Vuex;
        },
        _vue: function () {
            return dependencies.vue;
        },
        vue: function (container) {
            return container._vue.extend();
        },
        jquery: function () {
            return dependencies.jquery;
        },
        lodash: function () {
            return dependencies.lodash;
        },
        moment: function () {
            return dependencies.moment;
        },
        document: function () {
            return document;
        },
        selectorList: function () {
            return [
                '#calendar-app',
                '#metabox-calendar-app',
            ];
        },
        store: function (container) {
            return new container.vuex.Store({
                state: {
                    app: {
                    },
                    
                    serviceAvailabilityModel: {
                        fromDate: null
                    },
                    bookingModalVisible: true,

                    sessions: [{
                        id: 0,
                        sessionLength: 15,
                        price: 20,
                    }, {
                        id: 1,
                        sessionLength: 30,
                        price: 40,
                    },{
                        id: 2,
                        sessionLength: 45,
                        price: 60,
                    }],
                },
                mutations: {
                    SET_AVAILABILITY_FROM_DATE (state, newDate) {
                        state.serviceAvailabilityModel.fromDate = newDate;
                    },
                    SET_INITIAL_STATE (state, appState) {
                        state.app = appState;
                    },
                    SET_SESSIONS (state, sessions) {
                        state.sessions = sessions;
                    },
                    SET_BOOKING_MODAL_VISIBILITY (state, newVisibility) {
                        state.bookingModalVisible = newVisibility;
                    }
                }
            })
        },
        modalStateToggleable: function (container) {
            return new FunctionalToggleable((newVisibility) => {
                container.store.commit('SET_BOOKING_MODAL_VISIBILITY', newVisibility);
            }, () => {
                return container.store.state.bookingModalVisible
            })
        },
        app: applicationFactory(APP_STATE),
        calendar: function (container) {
            return dependencies.calendar.CfFullCalendar(container.vue, container.jquery, container.lodash.defaultsDeep);
        },
        repeater: function (container) {
            return new dependencies.repeater.CfRepeater(container.vue);
        },
        datepicker: function () {
            return dependencies.datepicker;
        },
        tabs: function (container) {
            return new dependencies.tabs.CfTabs(container.vue);
        },
        tab: function (container) {
            return new dependencies.tabs.CfTab(container.vue);
        },
        modal: function (container) {
            return new CfModal(container.vue);
        },
        'session-length': function (container) {
            return new CfSessionLength(container.vue, container.repeater);
        },
        'modal-new-booking': function (container) {
            return new CfModalNewBooking(container.vue, container.repeater, container.datepicker);
        },
        components: function (container) {
            return {
                app: container.app,
                calendar: container.calendar,
                repeater: container.repeater,
                tabs: container.tabs,
                tab: container.tab,
                modal: container.modal,
                datepicker: container.datepicker,

                'session-length': container['session-length'],
                'modal-new-booking': container['modal-new-booking'],
            }
        }
    }
}