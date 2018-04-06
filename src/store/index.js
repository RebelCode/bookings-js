import bookings from './bookings'
import bookingOptions from './booking-options'
import ui from './ui'

const state = {
  app: {
    availabilities: [],
    sessions: [],
    displayOptions: {
      useCustomerTimezone: false
    },

    bookings: [],

    screenStatuses: []
  },
}

const mutations = {
  setInitialState (state, appState) {
    state.app = appState
  },

  setNewAvailabilities (state, availabilities) {
    state.app.availabilities = availabilities
  },

  setSessions (state, sessions) {
    state.app.sessions = sessions
  },

  setDisplayOptions (state, payload) {
    state.app.displayOptions[payload.key] = payload.value
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