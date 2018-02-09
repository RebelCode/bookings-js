import applicationFactory from './components/Application.js';
import CfSessionLength from "./components/SessionLength";

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
                    app: {},
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
                    SET_INITIAL_STATE (state, appState) {
                        state.app = appState;
                    },
                    SET_SESSIONS (state, sessions) {
                        state.sessions = sessions;
                    }
                }
            })
        },
        app: applicationFactory(APP_STATE),
        calendar: function (container) {
            return dependencies.calendar.CfFullCalendar(container.vue, container.jquery, container.lodash.defaultsDeep);
        },
        repeater: function (container) {
            return new dependencies.repeater.CfRepeater(container.vue);
        },
        'session-length': function (container) {
            return new CfSessionLength(container.vue, container.repeater);
        },
        tabs: function (container) {
            return new dependencies.tabs.CfTabs(container.vue);
        },
        tab: function (container) {
            return new dependencies.tabs.CfTab(container.vue);
        },
        components: function (container) {
            return {
                app: container.app,
                calendar: container.calendar,
                repeater: container.repeater,
                'session-length': container['session-length'],
                tabs: container.tabs,
                tab: container.tab,
            }
        }
    }
}