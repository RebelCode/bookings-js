import BookingTransformer from './BookingTransformer'
import AvailabilityTransformer from './AvilabilityTransformer'

export default function (dependencies) {
  return {
    bookingTransformer (container) {
      return new BookingTransformer({
        moment: container.moment
      })
    },
    availabilityTransformer (container) {
      return new AvailabilityTransformer({
        moment: container.moment,
        transformDatetime: container.transformDatetime
      })
    },
    transformDatetime (container) {
      /**
       * Transform datetime to format required by server.
       *
       * @param {any} value
       * @param {string} timezone
       * @param {object} container
       *
       * @returns {string}
       */
      return (value, timezone) => {
        return container.momentHelpers
          .createInTimezone(value, timezone)
          .format(container.config.formats.datetime.store)
      }
    }
  }
}