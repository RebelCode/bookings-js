import bookingOptions from './booking-options'
import ui from './ui'

const state = {
  app: {
    events: {}
  },
}

const mutations = {
  setInitialState (state, appState) {
    state.app = appState
  },

  setNewEvents (state, events) {
    state.app.events = events
  }
}

export default {
  modules: {
    bookingOptions,
    ui
  },
  state,
  mutations
}