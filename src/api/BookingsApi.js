import Api from './Api'

export default class BookingsApi extends Api {
  /**
   * Api constructor
   *
   * @param {object} httpClient Http client like axios
   * @param {object} config
   * @param {RequestCache} cache Requests caching implementation.
   * @param {Transformer} bookingReadTransformer Transformer for preparing booking for using in UI.
   */
  constructor (httpClient, config, cache, bookingReadTransformer) {
    super(httpClient, config, cache)
    this.bookingReadTransformer = bookingReadTransformer
  }

  /**
   * Fetch bookings list using params. Expect GET
   *
   * @param params
   * @return {*}
   */
  fetch (params) {
    const fetchConfig = this.config['fetch']
    return this.http[fetchConfig.method](fetchConfig.endpoint, this.prepareParams({ params }))
  }

  /**
   * Create booking.
   *
   * @param model
   * @return {*}
   */
  create (model) {
    const createConfig = this.config['create']
    return this.http[createConfig.method](createConfig.endpoint, this.prepareParams(model))
  }

  /**
   * Update booking.
   *
   * @param model
   * @return {*}
   */
  update (model) {
    const updateConfig = this.config['update']
    return this.http[updateConfig.method](`${updateConfig.endpoint}${model.id}`, this.prepareParams(model))
  }

  /**
   * Delete given model from server.
   *
   * @param model
   * @return {*}
   */
  delete (model) {
    const deleteConfig = this.config['delete']
    return this.http[deleteConfig.method](`${deleteConfig.endpoint}${model.id}`, this.prepareParams(model))
  }
}