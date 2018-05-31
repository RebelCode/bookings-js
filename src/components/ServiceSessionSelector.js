/**
 * Component for selecting available booking session for given service.
 *
 * @usage
 * `<service-session-selector :service="service" v-model="session"></service-session-selector>`
 *
 * @since [*next-version*]
 *
 * @param {moment} moment MomentJS.
 * @param {object} sessionsApi Session API wrapper, used for querying sessions.
 *
 * @return {object}
 */
export default function CfServiceSessionSelector (moment, sessionsApi) {
  return {
    template: '#service-session-selector-template',

    inject: [
      /**
       * Datepicker component, used for selecting month and day.
       *
       * @since [*next-version*]
       */
      'datepicker',

      /**
       * Session length picker component, allows to select session.
       *
       * @since [*next-version*]
       */
      'session-picker'
    ],
    data () {
      return {
        /**
         * @since [*next-version*]
         *
         * @property {String|null} selectedMonth Month that is selected in datepicker.
         */
        selectedMonth: null,

        /**
         * @since [*next-version*]
         *
         * @property {String|null} selectedDay Selected day to show sessions from.
         */
        selectedDay: null,

        /**
         * @since [*next-version*]
         *
         * @property {object[]} sessions List of sessions for current month.
         */
        sessions: [],

        /**
         * @since [*next-version*]
         *
         * @property {Boolean} isSessionsLoading Is sessions are loading right now.
         */
        isSessionsLoading: false
      }
    },
    watch: {
      /**
       * Watch by `service` property change and, if it's changed, refresh all selected values.
       * `immediate` option fire this watcher on component mount.
       *
       * @since [*next-version*]
       */
      service: {
        immediate: true,
        handler () {
          this._setCleanStateValues()
        }
      }
    },
    props: {
      /**
       * Waiting for this structure:
       * {
       *  `id`: Number, // service ID
       *  `sessionLengths`: Array of {
       *    `sessionLength`: Number // session duration in seconds
       *  }
       * }
       * @since [*next-version*]
       *
       * @property {object|null} service Selected service to choose sessions for.
       */
      service: {
        default: null
      },

      /**
       * @since [*next-version*]
       *
       * @property {object|null} value Selected session, `v-model` in parent
       */
      value: {}
    },
    computed: {
      /**
       * Computed proxy for model. This is used to allow child components
       * change value of parent's model.
       *
       * @since [*next-version*]
       *
       * @property {object}
       */
      session: {
        /**
         * Model getter.
         *
         * @since [*next-version*]
         *
         * @return {object}
         */
        get () {
          return this.value
        },

        /**
         * Setter for model.
         *
         * @since [*next-version*]
         *
         * @param {object} newValue
         */
        set (newValue) {
          this.$emit('input', newValue)
        }
      },

      /**
       * Transformed sessions to work with. During transformation we'll
       * add `duration` field, so sessions can be properly filtered.
       *
       * @since [*next-version*]
       *
       * @property {object[]}
       */
      transformedSessions () {
        return this.sessions.map(session => {
          session['duration'] = moment(session.end).unix() - moment(session.start).unix()
          return session
        })
      },

      /**
       * Computed property that maps days (string) to sessions (array of sessions).
       *
       * @since [*next-version*]
       *
       * @property {object} Map of dates and corresponding sessions for each of them.
       */
      daysWithSessions () {
        let daysWithSessions = {}
        for (let session of this.transformedSessions) {
          const dayKey = this._getDayKey(session.start)
          if (!daysWithSessions[dayKey]) {
            daysWithSessions[dayKey] = []
          }
          daysWithSessions[dayKey].push(session)
        }
        return daysWithSessions
      },

      /**
       * Session list for selected day
       *
       * @since [*next-version*]
       *
       * @return {object[]}
       */
      selectedDaySessions () {
        if (!this.selectedDay) {
          return []
        }
        const selectedDaySessions = this.daysWithSessions[this._getDayKey(this.selectedDay)]
        if (!selectedDaySessions) {
          return []
        }
        return selectedDaySessions
      },

      /**
       * The next closest available day with sessions.
       *
       * @since [*next-version*]
       *
       * @property {string|null}
       */
      nextAvailableDay () {
        const selectedDayIndex = this.availableDays.indexOf(this._getDayKey(this.selectedDay))
        const availableDaysCount = this.availableDays.length
        if (availableDaysCount - 1 === selectedDayIndex) {
          return null
        }
        return moment(this.availableDays[selectedDayIndex + 1]).format()
      },

      /**
       * The previous closest available day with sessions.
       *
       * @since [*next-version*]
       *
       * @property {string|null}
       */
      prevAvailableDay () {
        const selectedDayIndex = this.availableDays.indexOf(this._getDayKey(this.selectedDay))
        if (selectedDayIndex === 0) {
          return null
        }
        return moment(this.availableDays[selectedDayIndex - 1]).format()
      },

      /**
       * List of available days with sessions.
       *
       * @since [*next-version*]
       *
       * @property {string[]}
       */
      availableDays () {
        return Object.keys(this.daysWithSessions)
      },
    },
    methods: {
      /**
       * Event listener, fired on month change.
       *
       * @since [*next-version*]
       *
       * @param {Date} newMonth Newly selected month.
       */
      onMonthChange (newMonth) {
        this.selectedMonth = newMonth
        this.loadSessions()
      },

      /**
       * Check that given date is disabled in datepicker.
       *
       * @since [*next-version*]
       *
       * @param {Date} date Date in datepicker to check.
       *
       * @return {boolean} Is given date is disabled.
       */
      isDateDisabled (date) {
        if (this.isSessionsLoading) {
          return true
        }
        const dateKey = this._getDayKey(date)
        return Object.keys(this.daysWithSessions).indexOf(dateKey) === -1
      },

      /**
       * Clean old values and set new, clean ones to select session.
       *
       * @since [*next-version*]
       */
      _setCleanStateValues () {
        this.selectedDay = null

        this.selectedMonth = moment().toDate()
        this.sessions = []

        this.loadSessions()
      },

      /**
       * Load sessions from API.
       *
       * @since [*next-version*]
       */
      loadSessions () {
        this.isSessionsLoading = true
        sessionsApi.fetch(this._prepareSessionRequestParams()).then(sessions => {
          this.sessions = sessions
          this.isSessionsLoading = false
        }, error => {
          console.error(error)
          this.isSessionsLoading = false
        })
      },

      /**
       * Get params for request sessions.
       *
       * @since [*next-version*]
       *
       * @return {{service: Number, start: (string), end: (string)}}
       */
      _prepareSessionRequestParams () {
        const currentDay = moment()
        const firstDayOfMonth = moment(this.selectedMonth).startOf('month')
        const lastDayOfMonth = moment(this.selectedMonth).endOf('month')

        const start = (currentDay.isAfter(firstDayOfMonth) ? currentDay : firstDayOfMonth).startOf('day').format()
        const end = lastDayOfMonth.endOf('day').format()

        return {
          service: this.service.id,
          start,
          end
        }
      },

      /**
       * Get day key for given datetime. It will be used as as key for sessions.
       *
       * @since [*next-version*]
       *
       * @param {string|Date} value Value to get day key from.
       *
       * @return {string} Day key.
       */
      _getDayKey (value) {
        return moment(value).format('YYYY-MM-DD')
      }
    },
    components: {
      'datepicker': 'datepicker',
      'session-picker': 'session-picker'
    }
  }
}