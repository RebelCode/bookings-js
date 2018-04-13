import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export default function CfSessionLength (Vue, Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return Vue.extend({
    inject: [
      'repeater',
      'humanizeDuration'
    ],
    data () {
      return {
        timeUnits: [{
          title: 'mins',
          seconds: 60,
        },{
          title: 'hours',
          seconds: 60 * 60,
        }, {
          title: 'days',
          seconds: 60 * 60 * 24,
        }, {
          title: 'weeks',
          seconds: 60 * 60 * 24 * 7,
        }],

        sessionTimeUnit: 60,

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
      ...mapState({
        storeSessions: state => state.app.sessions
      })
    },
    methods: {
      ...mapMutations([
        'setSessions'
      ]),

      humanize (seconds) {
        return this.humanizeDuration(seconds * 1000, {
          units: ['w', 'd', 'h', 'm'],
          round: true
        })
      },

      /**
       * Add new session to the session's list
       * and when session added clear session default, so user
       * can keep adding new sessions.
       */
      addNewSession () {
        if (!this.validate()) return;

        const sessionLength = this.sessionTimeUnit * this.sessionDefault.sessionLength

        this.sessions.addItem({
          id: this.sessions.getItems().length,
          sessionLength,
          price: this.sessionDefault.price
        })

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
        if (Number(this.sessionDefault.sessionLength) <= 0) {
          this.validationError = this.$refs.sessionLength.dataset.validationError
          return false;
        }
        else if (this.sessionDefault.price === null || !this.sessionDefault.price.length) {
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