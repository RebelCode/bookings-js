import BookingTransformer from './BookingTransformer'
import AvailabilityStoreTransformer from './AvilabilityStoreTransformer'
import AvailabilityReadTransformer from './AvilabilityReadTransformer'
import StateTransformer from './StateTransformer'
import SessionLengthReadTransformer from './SessionLengthReadTransformer'

export default function (dependencies) {
  return {
    bookingTransformer (container) {
      return new BookingTransformer({
        moment: container.moment
      })
    },
    availabilityStoreTransformer (container) {
      return new AvailabilityStoreTransformer({
        moment: container.moment,
        transformDatetimeForStore: container.transformDatetimeForStore
      })
    },
    availabilityReadTransformer (container) {
      return new AvailabilityReadTransformer({
        moment: container.moment,
        transformDatetimeForUi: container.transformDatetimeForUi
      })
    },
    sessionLengthReadTransformer () {
      return new SessionLengthReadTransformer()
    },
    stateTransformer (container) {
      return new StateTransformer({
        availabilityReadTransformer: container.availabilityReadTransformer,
        sessionLengthReadTransformer: container.sessionLengthReadTransformer
      })
    },
    transformDatetimeForUi (container) {
      /**
       * Transform datetime to work with it in UI
       *
       * @param {any} value
       * @param {string} timezone
       *
       * @returns {string}
       */
      return (value, timezone) => {
        return container.momentHelpers
          .switchToTimezone(value, timezone)
          .format(container.config.formats.datetime.tzFree)
      }
    },
    transformDatetimeForStore (container) {
      /**
       * Transform datetime to format required by server.
       *
       * @param {any} value
       * @param {string} timezone
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