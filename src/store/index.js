import bookings from './bookings'
import bookingOptions from './booking-options'
import ui from './ui'

const state = {
  app: {
    bookingsEnabled: false,
    timezone: 'UTC+0',
    availabilities: {
      rules: []
    },
    sessionLengths: [],
    displayOptions: {
      useCustomerTimezone: false
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

export default {
  modules: {
    bookings,
    bookingOptions,
    ui
  },
  state,
  getters,
  mutations
}