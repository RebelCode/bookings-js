export default class Api {
  /**
   * Endpoint route
   */
  route

  /**
   * Api constructor
   *
   * @param httpClient {Object} Http client like axios
   */
  constructor (httpClient) {
    this.http = httpClient
  }

  /**
   * Search for term
   *
   * @param term
   */
  search (term) {
    return this.http.get(this._buildUri('search'), { term })
  }

  /**
   * Build URI for path
   *
   * @param path
   * @return {string}
   * @private
   */
  _buildUri (path) {
    return '/' + this.route + '/' + path
  }
}