import bookings from './bookings'
import bookingOptions from './booking-options'
import ui from './ui'

const state = {
  app: {
    bookingsEnabled: false,
    availabilities: [],
    sessions: [],
    displayOptions: {
      useCustomerTimezone: false
    },

    bookings: [],

    statusesEndpoint: '',

    statuses: {},
    screenStatuses: []
  },
}

const mutations = {
  setInitialState (state, appState) {
    state.app = Object.assign({}, state.app, appState)
  },

  setNewAvailabilities (state, availabilities) {
    state.app.availabilities = availabilities
  },

  setSessions (state, sessions) {
    state.app.sessions = sessions
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
  mutations
}