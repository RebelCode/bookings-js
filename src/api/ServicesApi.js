import { Api } from '@rebelcode/std-lib'

/**
 * API for interaction with the services backend.
 *
 * @since [*next-version*]
 *
 * @class BookingsApi
 */
export default class ServicesApi extends Api {
  /**
   * Api constructor
   *
   * @since [*next-version*]
   *
   * @param {HttpClient} httpClient Http promise-based client
   * @param {Object<string, {method: String, endpoint: String}>} config
   * @param {RequestCache} cache Requests caching implementation.
   */
  constructor (httpClient, config, cache) {
    super(httpClient, config, cache)
  }

  /**
   * Fetch the services list using request params.
   *
   * @since [*next-version*]
   *
   * @param {Object} params Parameters that will be used for searching services.
   *
   * @return {Promise<any>}
   */
  fetch (params) {
    const fetchConfig = this.config['fetch']
    return this.http.request({
      method: fetchConfig.method,
      url: fetchConfig.endpoint,
      params
    })
  }

  /**
   * Delete a service from a server.
   *
   * @since [*next-version*]
   *
   * @param {{id: Number}} model Service object that will be deleted.
   *
   * @return {Promise<any>}
   */
  delete (model) {
    const deleteConfig = this.config['delete']
    return this.http.request({
      method: deleteConfig.method,
      url: `${deleteConfig.endpoint}${model.id}`
    })
  }
}
