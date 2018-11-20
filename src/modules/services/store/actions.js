export default {
  /**
   * Fetch the list of services.
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
    commit('setLoadingList', true)
    return api.fetch(params).then((response) => {
      commit('set', {
        key: 'services.list',
        value: response.data.items.map(item => {
          const options = Object.assign({}, transformOptions, {
            timezone: item.timezone
          })
          return api.serviceReadTransformer.transform(item, options)
        })
      }, {
        root: true
      })
      commit('setLoadingList', false)
    }).catch(() => {
      commit('setLoadingList', false)
    })
  },

  /**
   * Create the service.
   *
   * @since [*next-version*]
   *
   * @param {Function} commit Local's module commit Vuex method.
   * @param {ServicesApi} api The services API.
   * @param {{id: number,...}} model The model holding new values.
   *
   * @return {Promise<any>} Promise holding the server's response data.
   */
  create ({ commit }, { api, model }) {
    return api.create(model)
  },

  /**
   * Update the service.
   *
   * @since [*next-version*]
   *
   * @param {Function} commit Local's module commit Vuex method.
   * @param {ServicesApi} api The services API.
   * @param {{id: number, timezone: string, ...}} model The model holding new values.
   *
   * @return {Promise<any>} Promise holding the server's response data.
   */
  update ({ commit }, { api, model }) {
    return api.update(model)
  },

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