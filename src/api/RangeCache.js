/**
 * Class for caching ranges.
 *
 * @since [*next-version*]
 */
export default class RangeCache {
  /**
   * Range cache underlying store.
   *
   * @since [*next-version*]
   *
   * @type {Array}
   */
  rangeCache = []

  /**
   * Range cache constructor.
   *
   * @since [*next-version*]
   *
   * @param {moment} moment
   * @param {_} lodash
   * @param {String} period
   */
  constructor (moment, lodash, period = 'month') {
    this.moment = moment
    this.lodash = lodash
    this.period = period
  }

  /**
   * Return the range which is difference between requested and cached
   * (the range that should be fetched in order to fill the gap)
   *
   * @since [*next-version*]
   *
   * @param service
   * @param start
   * @param end
   *
   * @return {*}
   */
  uncached ({ service, start, end }) {
    // transform given range to the list of full months ranges
    const ranges = this._getFullPeriodRanges({ service, start, end })
    // look which months from this list are not cached
    const uncached = this.lodash.differenceWith(ranges, this.rangeCache, this.lodash.isEqual)
    // to optimise the number of requests, we are merging uncached ranges by taking only first and last timestamps of the list
    if (uncached.length) {
      const first = uncached[0]
      const [last] = uncached.slice(-1)
      return {
        service,
        start: first.start,
        end: last.end
      }
    }
    return null
  }

  /**
   * Cache the query by remembering the list of full months of given range
   *
   * @since [*next-version*]
   *
   * @param serviceId
   * @param start
   * @param end
   *
   * @return {*[]|*}
   */
  remember ({ service, start, end }) {
    const ranges = this._getFullPeriodRanges({ service, start, end })
    const uncached = this.lodash.differenceWith(ranges, this.rangeCache, this.lodash.isEqual)
    if (!uncached) {
      return
    }
    this.rangeCache = [...this.rangeCache, ...uncached]
    return this.rangeCache
  }

  /**
   * Get list of full period ranges.
   *
   * @since [*next-version*]
   *
   * @param service
   * @param start
   * @param end
   *
   * @return {{service: *, start: (*|string), end: (*|string)}[]}
   */
  _getFullPeriodRanges ({ service, start, end }) {
    const range = this.moment.range(this.moment(start).startOf(this.period), this.moment(end).endOf(this.period))
    const periods = Array.from(range.by(this.period)) // create an array from months iterator
    return periods.map(m => {
      return {
        service,
        start: m.startOf(this.period).format(),
        end: m.endOf(this.period).format()
      }
    })
  }
}
