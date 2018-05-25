import Api from './Api'

export default class SessionsApi extends Api {
  /**
   * Fetch session list using search query
   *
   * @param params
   * @return {*}
   */
  fetch (params) {
    return this.cache.remember(params, () => {
      const fetchConfig = this.config['fetch']
      return this.http[fetchConfig.method](fetchConfig.endpoint, this.prepareParams({ params })).then(response => {
        return response.data.items
      })
    })
  }
}
