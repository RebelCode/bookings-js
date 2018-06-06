/**
 * Helper methods for availability, used across different components.
 *
 * @since [*next-version*]
 *
 * @class AvailabilityHelpers
 */
export default class AvailabilityHelpers {
  /**
   * AvailabilityHelpers constructor.
   *
   * @since [*next-version*]
   *
   * @param {Function} moment Moment JS.
   */
  constructor (moment) {
    this.moment = moment
  }

  /**
   * Check if availability is one day availability. So it can
   * be repeated weekly on some days.
   *
   * @since [*next-version*]
   *
   * @param {Availability} availability Availability for check.
   *
   * @return {boolean} Is availability is one day.
   */
  isOneDay (availability) {
    const nextDayStart = this.moment(availability.start).add(1, 'day').set({
      hour: 0,
      minute: 0,
      second: 0
    })
    const end = this.moment(availability.end)
    return end.isSameOrBefore(nextDayStart)
  }
}