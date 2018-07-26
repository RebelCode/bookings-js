import bookings from './bookings'
import bookingOptions from './booking-options'
import ui from './ui'
import settings from './settings'

const state = {
  app: {
    bookingsEnabled: false,
    timezone: 'UTC+0',
    availabilities: {
      rules: []
    },
    sessionLengths: [],
    displayOptions: {
      allowCustomerChangeTimezone: false
    },

    bookings: [],
    screenOptionsEndpoint: '',
    statuses: {},
    screenStatuses: []
  },
}

const getters = {
  availabilities (state) {
    return state.app.availabilities.rules
  },
  sessionLengths (state) {
    return state.app.sessionLengths
  }
}

const mutations = {
  setInitialState (state, appState) {
    state.app = Object.assign({}, state.app, appState)

    /*
     * Set initial timezone value for bookings page.
     */
    state.bookings.timezone = appState.bookingsTimezone || appState.config.timezone
  },

  setNewAvailabilities (state, rules) {
    state.app.availabilities.rules = rules
  },

  setSessionLengths (state, sessionLengths) {
    state.app.sessionLengths = sessionLengths
  },

  setTimezone (state, value) {
    state.app.timezone = value
  },

  setDisplayOptions (state, payload) {
    let updatedOption = {}
    updatedOption[payload.key] = payload.value
    state.app.displayOptions = Object.assign({}, state.app.displayOptions, updatedOption)
  },

  setBookingsEnabled (state, newValue) {
    state.app.bookingsEnabled = newValue
  },

  setNewBookings (state, bookings) {
    state.app.bookings = bookings
  },

  setScreenStatuses (state, statuses) {
    state.app.screenStatuses = statuses.slice()
  }
}

export default function ({deepHas, deepSet}) {
  return {
    modules: {
      bookings,
      bookingOptions,
      ui,
      settings
    },
    state,
    getters,
    mutations: Object.assign({}, mutations, {
      /**
       * Deep set value of state.
       *
       * @since [*next-version*]
       *
       * @param {object} state Root store's state.
       * @param {string} key Key to set.
       * @param {*} value Value to set.
       */
      set (state, {key, value}) {
        if (!deepHas(state, key)) {
          throw new Error(`Can't set value. Key "${key}" doesn't exist.`)
        }
        deepSet(state, key, value)
      }
    })
  }
}