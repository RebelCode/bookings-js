import bookingOptions from './booking-options'
import ui from './ui'

const state = {
  app: {},
}

const mutations = {
  setInitialState (state, appState) {
    state.app = appState
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