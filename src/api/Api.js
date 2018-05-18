export default class Api {
  /**
   * Api constructor
   *
   * @param httpClient {Object} Http client like axios
   * @param config
   */
  constructor (httpClient, config) {
    this.http = httpClient
    this.config = config
  }

  /**
   * Prepare params before submit
   *
   * @param params
   * @return {FormData}
   */
  prepareParams (params) {
    return params
  }
}