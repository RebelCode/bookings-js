import bookings from './bookings'
import bookingOptions from './booking-options'
import ui from './ui'

const state = {
  app: {
    events: [],
    bookings: []
  },
}

const mutations = {
  setInitialState (state, appState) {
    state.app = appState
  },

  setNewEvents (state, events) {
    state.app.events = events
  },

  setNewBookings (state, bookings) {
    state.app.bookings = bookings
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