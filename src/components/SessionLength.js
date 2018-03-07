import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export default function CfSessionLength (Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return {
    inject: [
      'repeater'
    ],
    data () {
      return {
        /**
         * Default session model. Used as form data
         * for the new session form.
         */
        sessionDefault: {
          sessionLength: null,
          price: null
        },

        /**
         * Store's sessions wrapper.
         *
         * @var {FunctionalArrayCollection}
         */
        sessions: new FunctionalArrayCollection(() => {
          return this.storeSessions
        }, (sessions) => {
          this.setSessions(sessions)
        }, (item) => {
          return item.id
        })
      }
    },
    computed: {
      ...mapState('bookingOptions', {
        storeSessions: 'sessions'
      })
    },
    methods: {
      ...mapMutations('bookingOptions', [
        'setSessions'
      ]),

      /**
       * Add new session to the session's list
       * and when session added clear session default, so user
       * can keep adding new sessions.
       */
      addNewSession () {
        this.sessions.addItem(Object.assign({
          id: this.sessions.getItems().length
        }, this.sessionDefault))

        this.sessionDefault = {
          sessionLength: null,
          price: null
        }
      }
    },

    components: {
      repeater: 'repeater'
    }
  }
}