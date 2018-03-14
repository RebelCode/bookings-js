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
  }
}

export default mutations