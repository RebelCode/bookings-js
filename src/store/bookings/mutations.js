/**
 * Mutations for booking-options feature
 */
const mutations = {
  /**
   * Seed booking editor by passed model.
   *
   * @param state
   * @param model
   */
  setBookingEditorState (state, model) {
    state.bookingModel = model
  },

  /**
   * Set services to chose from and for filtering
   *
   * @param state
   * @param data
   */
  setServices (state, data) {
    state.services = data
  },

  /**
   * Set bookings
   *
   * @param state
   * @param data
   */
  setBookings (state, data) {
    state.bookings = data
  },

  /**
   * Set bookings count
   *
   * @param state
   * @param count
   */
  setBookingsCount (state, count) {
    state.bookingsCount = count
  }
}

export default mutations