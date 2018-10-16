export default {
  /**
   * Seed service editor by passed model.
   *
   * @since [*next-version*]
   *
   * @param {ServicesApi} api The API for managing services.
   * @param {{id: number}} model
   */
  delete ({}, { api, model }) {
    return api.delete(model)
  },
}