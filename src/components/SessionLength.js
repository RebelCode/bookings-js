import {FunctionalArrayCollection} from "std-lib/src/FunctionalArrayCollection";

export default function CfSessionLength(Vue, Repeater) {
    return Vue.extend({
        inject: ['store'],
        data () {
            return {
                newSession: {
                    sessionLength: null,
                    price: null
                },

                sessions: new FunctionalArrayCollection(() => {
                    return this.store.state.sessions;
                }, (sessions) => {
                    this.store.commit('SET_SESSIONS', sessions);
                }, (item) => {
                    return item.id;
                })
            }
        },
        methods: {
            addNewSession ()
            {
                this.sessions.addItem({
                    id: this.sessions.getItems().length,
                    sessionLength: this.newSession.sessionLength,
                    price: this.newSession.price
                });

                this.newSession = {
                    sessionLength: null,
                    price: null
                };
            }
        },
        components: {
            Repeater
        }
    });
}