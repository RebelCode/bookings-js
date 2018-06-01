import Api from './Api'

export default class SessionsApi extends Api {
  /**
   * Storing all sessions to work correctly with range caching system.
   *
   * @type {object[]}
   */
  sessions = []

  /**
   * Api constructor
   *
   * @param {object} httpClient Http client like axios
   * @param {object} config
   * @param {RequestCache} cache Requests caching implementation.
   * @param {RangeCache} rangeCache Range cache implementation.
   * @param {Transformer} sessionReadTransformer Session read transformer.
   * @param {Function} moment Moment JS.
   */
  constructor (httpClient, config, cache, rangeCache, sessionReadTransformer, moment) {
    super(httpClient, config, cache)

    this.rangeCache = rangeCache
    this.sessionReadTransformer = sessionReadTransformer
    this.moment = moment
  }

  /**
   * Fetch session list using search query
   *
   * @param params
   * @return {*}
   */
  fetch (params) {
    const uncachedRange = this.rangeCache.uncached(params)
    if (!uncachedRange) {
      return Promise.resolve(this._getSessions(params))
    }

    const fetchConfig = this.config['fetch']
    return this.http[fetchConfig.method](fetchConfig.endpoint, this.prepareParams({ params })).then(response => {
      this.rangeCache.remember(uncachedRange)
      const sessions = response.data.items.map(session => {
        return this.sessionReadTransformer.transform(session)
      })
      this._storeSessions(sessions)
      return sessions
    })
  }

  /**
   * Get sessions by given params.
   *
   * @param {Number} service Service id to get sessions for
   * @param {Number} start Start range in ISO8601 format
   *
   * @return {object[]}
   */
  _getSessions({ service, start }) {
    start = this.moment(start).unix()
    return this.sessions.filter(session => {
      return parseInt(session.service) === service
       && session.startUnix >= start
    })
  }

  /**
   * Store sessions in one place.
   *
   * @param {object[]} sessions
   */
  _storeSessions(sessions) {
    this.sessions = [...this.sessions, ...sessions]
  }
}
