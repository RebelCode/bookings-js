/**
 * Mutations for booking-options feature
 */
const mutations = {
  setAvailabilityEditorState (state, model) {
    state.serviceAvailabilityModel = model
  },

  setSessions (state, sessions) {
    state.sessions = sessions
  }
}

export default mutations