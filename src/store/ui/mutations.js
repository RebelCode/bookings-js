/**
 * Mutations for UI-related stuff
 */
const mutations = {
  setAvailabilityModalVisibility (state, newVisibility) {
    state.availabilityModalVisible = newVisibility
  },
  setBookingModalVisibility (state, newVisibility) {
    state.bookingModalVisible = newVisibility
  },
  setBookingsViewFilter (state, viewFilter) {
    state.bookings.viewFilter = viewFilter
  },
  setBookingsIsLoading (state, isLoading) {
    state.bookings.isLoading = isLoading
  },
}

export default mutations