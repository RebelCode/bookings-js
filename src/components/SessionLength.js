export default function CfSessionLength (Vue, Vuex, FunctionalArrayCollection) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return Vue.extend({
    inject: {
      '_': {
        from: 'translate'
      },

      /**
       * Website configuration.
       *
       * @since [*next-version*]
       */
      'config': 'config',

      'repeater': 'repeater',
      'humanizeDuration': 'humanizeDuration'
    },
    data () {
      return {
        timeUnits: [{
          title: this._('mins'),
          seconds: 60,
        },{
          title: this._('hours'),
          seconds: 60 * 60,
        }, {
          title: this._('days'),
          seconds: 60 * 60 * 24
        }, {
          title: this._('weeks'),
          seconds: 60 * 60 * 24 * 7
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
          this.setSessionLengths(sessions)
        }, (item) => {
          return item.id
        })
      }
    },
    props: {
      /**
       * @since [*next-version*]
       *
       * @property {number} sessionLengthLimit Session length limit in seconds.
       */
      sessionLengthLimit: {
        type: Number
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
          this.limitSessionLength()
        }
      },
      /**
       * Watch for `maxSessionLength` change and apply session length limit if needed.
       *
       * @since [*next-version*]
       */
      maxSessionLength () {
        this.limitSessionLength()
      }
    },
    computed: {
      ...mapState({
        storeSessions: state => state.app.sessionLengths.sort((a, b) => {
          return a.sessionLength - b.sessionLength
        })
      }),
      /**
       * Max possible value of session length (less then day).
       *
       * @since [*next-version*]
       *
       * @var {number}
       */
      maxSessionLength () {
        return Math.floor(this.sessionLengthLimit / this.sessionTimeUnit)
      }
    },
    methods: {
      ...mapMutations([
        'setSessionLengths'
      ]),

      humanize (seconds) {
        return this.humanizeDuration(seconds * 1000, {
          units: ['w', 'd', 'h', 'm'],
          round: true
        })
      },

      /**
       * Apply session length limit if needed.
       *
       * @since [*next-version*]
       */
      limitSessionLength () {
        if (!this.sessionLengthLimit) {
          return
        }
        if (this.sessionDefault.sessionLength > this.maxSessionLength) {
          this.sessionDefault.sessionLength = this.maxSessionLength
        }
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
          id: Math.random().toString(36).substring(7),
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