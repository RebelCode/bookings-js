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
   * Create FormData from params
   *
   * @param params
   * @return {FormData}
   */
  makeFormDataParams (params) {
    let formData = new FormData()
    for (let key in params) {
      formData.append(key, JSON.stringify(params[key]))
    }
    return formData
  }
}