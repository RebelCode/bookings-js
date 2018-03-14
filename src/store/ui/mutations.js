/**
 * Mutations for UI-related stuff
 */
const mutations = {
  setAvailabilityModalVisibility (state, newVisibility) {
    state.availabilityModalVisible = newVisibility
  },
  setBookingModalVisibility (state, newVisibility) {
    state.bookingModalVisible = newVisibility
  }
}

export default mutations