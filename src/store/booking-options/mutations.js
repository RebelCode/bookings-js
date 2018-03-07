/**
 * Mutations for booking-options feature
 */
const mutations = {
  setAvailabilityFromDate (state, newDate) {
    state.serviceAvailabilityModel.fromDate = newDate
  },

  setSessions (state, sessions) {
    state.sessions = sessions
  }
}

export default mutations