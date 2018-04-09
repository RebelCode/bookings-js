import Api from './Api'

export default class BookingsApi extends Api {
  /**
   * Fetch bookings list using params
   *
   * @param params
   * @return {*}
   */
  fetch (params) {
    const fetchConfig = this.config['fetch']
    return this.http[fetchConfig.method](fetchConfig.endpoint, this.makeFormDataParams(params))
  }
}