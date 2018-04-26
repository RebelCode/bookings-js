import Api from './Api'

export default class BookingsApi extends Api {
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
    return this.http[updateConfig.method](updateConfig.endpoint, this.prepareParams(model))
  }

  /**
   * Delete given model from server.
   *
   * @param model
   * @return {*}
   */
  delete (model) {
    const deleteConfig = this.config['delete']
    return this.http[deleteConfig.method](deleteConfig.endpoint, this.prepareParams(model))
  }
}