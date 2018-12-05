export default {
  /**
   * Fetch the list of staff members.
   *
   * @since [*next-version*]
   *
   * @param commit
   * @param api
   * @param params
   * @param transformOptions
   *
   * @return {PromiseLike<T> | Promise<T>}
   */
  fetch ({ commit }, { api, params, transformOptions }) {
    return api.fetch(params).then((response) => {
      commit('set', {
        key: 'staffMembers.list',
        value: response.data.items
      }, {
        root: true
      })
    })
  },

  /**
   * Create the staff member.
   *
   * @since [*next-version*]
   *
   * @param {Function} commit Local's module commit Vuex method.
   * @param {ServicesApi} api The staff members API.
   * @param {{id: number,...}} model The model holding new values.
   *
   * @return {Promise<any>} Promise holding the server's response data.
   */
  create ({ commit }, { api, model }) {
    return api.create(model)
  },

  /**
   * Update the staff member.
   *
   * @since [*next-version*]
   *
   * @param {Function} commit Local's module commit Vuex method.
   * @param {ServicesApi} api The staff members API.
   * @param {{id: number, timezone: string, ...}} model The model holding new values.
   *
   * @return {Promise<any>} Promise holding the server's response data.
   */
  update ({ commit }, { api, model }) {
    return api.update(model)
  },

  /**
   * Seed staff member editor by passed model.
   *
   * @since [*next-version*]
   *
   * @param {ServicesApi} api The API for managing staff members.
   * @param {{id: number}} model
   */
  delete ({}, { api, model }) {
    return api.delete(model)
  },
}
