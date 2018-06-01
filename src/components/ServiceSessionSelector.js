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
 * @param {{
 *  dayKey: (string), // How to format day as a key,
 *  sessionTime: (string), // How to format session time,
 *  dayFull: (string), // How to format day for day heading,
 * }} dateFormats Map of date formats for formatting dates in UI.
 *
 * @return {object}
 */
export default function CfServiceSessionSelector (moment, sessionsApi, dateFormats) {
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
      'session-picker',

      /**
       * Session transformer for transforming sessions for interacting with them in the UI.
       *
       * @since [*next-version*]
       */
      'sessionReadTransformer'
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
        isSessionsLoading: false,

        /**
         * @since [*next-version*]
         *
         * @property {Boolean} isEditing Is selector in edit mode now.
         */
        isEditing: false,

        /**
         * @since [*next-version*]
         *
         * @property {object} preloadedSession Session that was chosen when component was created.
         */
        preloadedSession: null
      }
    },
    /**
     * Hook that would be triggered when component is created. Here
     * we are checking if value is already set, and if so we are in the
     * edit mode.
     *
     * @since [*next-version*]
     */
    created () {
      if (this.value) {
        this.isEditing = true
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
       * Computed property that maps days (string) to sessions (array of sessions).
       *
       * @since [*next-version*]
       *
       * @property {object} Map of dates and corresponding sessions for each of them.
       */
      daysWithSessions () {
        let daysWithSessions = {}
        const sessions = this._addPreloadedSession(this.sessions, this.preloadedSession)
        for (let session of sessions) {
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

      /**
       * The current day to disable datepicker to it.
       *
       * @since [*next-version*]
       *
       * @property {Date}
       */
      currentDay () {
        return moment().startOf('day').toDate()
      },

      /**
       * @since [*next-version*]
       *
       * @property {String} Label for describing selected session in human readable format.
       */
      selectedSessionLabel () {
        if (!this.value) {
          return null
        }
        const sessionStart = moment(this.value.start)
        return sessionStart.format(dateFormats.sessionTime) + ', ' + sessionStart.format(dateFormats.dayFull)
      }
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
       * When the picker in the edit mode (so session is preloaded), this allows
       * to edit that session time.
       *
       * @since [*next-version*]
       */
      editSession () {
        this.preloadedSession = this.sessionReadTransformer.transform(this.value)

        const sessionStart = moment(this.preloadedSession.start)

        this.selectedDay = moment(sessionStart).startOf('day').format()
        this.selectedMonth = moment(sessionStart).startOf('month').format()

        this.loadSessions().then(() => {
          this.isEditing = false
        })
      },

      /**
       * Add preloaded session to all sessions to work with them.
       *
       * @since [*next-version*]
       *
       * @param {object} sessions All sessions.
       * @param {object} preloadedSession Session that was selected when picker was opened.
       *
       * @return {*}
       */
      _addPreloadedSession (sessions, preloadedSession = null) {
        if (!preloadedSession) {
          return sessions
        }

        const preselectedInFetched = sessions.find(session => {
          return this._sessionsIsSame(session, preloadedSession)
        })

        if (preselectedInFetched) {
          return sessions
        }

        sessions.push(preloadedSession)
        return sessions
      },

      /**
       * Check that sessions are the same.
       *
       * @since [*next-version*]
       *
       * @param {object} a First session to check
       * @param {object} b Second session to check
       *
       * @return {boolean}
       */
      _sessionsIsSame (a, b) {
        return a.service === b.service
          && a.resource === b.resource
          && a.startUnix === b.startUnix
          && a.endUnix === b.endUnix
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

        this.$nextTick(() => {
          if (this.service && !this.isEditing) {
            this.loadSessions()
          }
        })
      },

      /**
       * Load sessions from API.
       *
       * @since [*next-version*]
       *
       * @return {Promise<any>}
       */
      loadSessions () {
        this.isSessionsLoading = true
        return sessionsApi.fetch(this._prepareSessionRequestParams()).then(sessions => {
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
        return moment(value).format(dateFormats.dayKey)
      }
    },
    components: {
      'datepicker': 'datepicker',
      'session-picker': 'session-picker'
    }
  }
}