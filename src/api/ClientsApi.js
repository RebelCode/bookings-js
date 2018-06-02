import { Api } from '@rebelcode/std-lib'

export default class ClientsApi extends Api {
  /**
   * Fetch clients list using search query
   *
   * @param params
   * @return {*}
   */
  fetch (params) {
    const fetchConfig = this.config['fetch']
    return this.http[fetchConfig.method](fetchConfig.endpoint, this.prepareParams(params))
  }

  /**
   * Create new client
   *
   * @param model
   * @return {*}
   */
  create (model) {
    const createConfig = this.config['create']
    return this.http[createConfig.method](createConfig.endpoint, this.prepareParams(model))
  }
}