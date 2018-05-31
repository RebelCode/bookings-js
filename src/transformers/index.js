import BookingStoreTransformer from './BookingStoreTransformer'
import AvailabilityStoreTransformer from './AvilabilityStoreTransformer'
import AvailabilityReadTransformer from './AvilabilityReadTransformer'
import StateTransformer from './StateTransformer'
import SessionLengthReadTransformer from './SessionLengthReadTransformer'
import SessionReadTransformer from './SessionReadTransformer'
import BookingReadTransformer from './BookingReadTransformer'

export default function (dependencies) {
  return {
    bookingStoreTransformer () {
      return new BookingStoreTransformer()
    },
    bookingReadTransformer () {
      return new BookingReadTransformer()
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
    sessionReadTransformer (container) {
      return new SessionReadTransformer({
        moment: container.moment,
        dateFormats: container.config.formats.datetime
      })
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