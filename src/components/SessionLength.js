import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export default function CfSessionLength (Vue, Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return Vue.extend({
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
         * Validation error that shown to user
         *
         * @property {string}
         */
        validationError: null,

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
    watch: {
      /**
       * Session default watcher that removes validation error
       * when user change session default field's value.
       */
      sessionDefault: {
        deep: true,
        handler () {
          this.validationError = null
        }
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
        if (!this.validate()) return;

        this.sessions.addItem(Object.assign({
          id: this.sessions.getItems().length
        }, this.sessionDefault))

        this.sessionDefault = {
          sessionLength: null,
          price: null
        }
      },

      /**
       * Client side validation. Session default fields must be greater
       * than 0 to pass this validation.
       *
       * @return {boolean}
       */
      validate () {
        if (!this.sessionDefault.sessionLength) {
          this.validationError = this.$refs.sessionLength.dataset.validationError
          return false;
        }
        else if (!this.sessionDefault.price) {
          this.validationError = this.$refs.price.dataset.validationError
          return false;
        }

        return true;
      }
    },

    components: {
      repeater: 'repeater'
    }
  })
}