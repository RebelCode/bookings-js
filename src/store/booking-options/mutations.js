/**
 * Mutations for booking-options feature
 */
const mutations = {
  setAvailabilityEditorState (state, model) {
    state.serviceAvailabilityModel = model
  },

  setSessionLengths (state, setSessionLengths) {
    state.setSessionLengths = setSessionLengths
  }
}

export default mutations