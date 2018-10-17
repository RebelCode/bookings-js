import BookingStoreTransformer from './BookingStoreTransformer'
import AvailabilityStoreTransformer from './AvilabilityStoreTransformer'
import AvailabilityReadTransformer from './AvilabilityReadTransformer'
import ServiceReadTransformer from './ServiceReadTransformer'
import SessionLengthReadTransformer from './SessionLengthReadTransformer'
import BookingReadTransformer from './BookingReadTransformer'
import ServiceStoreTransformer from './ServiceStoreTransformer'

export default function (dependencies) {
  return {
    bookingStoreTransformer () {
      return new BookingStoreTransformer()
    },
    bookingReadTransformer () {
      return new BookingReadTransformer()
    },
    availabilityStoreTransformer (container) {
      return new AvailabilityStoreTransformer(container.moment, container.transformDatetimeForStore)
    },
    availabilityReadTransformer (container) {
      return new AvailabilityReadTransformer(container.moment, container.transformDatetimeForUi)
    },
    sessionLengthReadTransformer () {
      return new SessionLengthReadTransformer()
    },
    sessionReadTransformer (container) {
      return new dependencies.bookingWizardComponents.SessionReadTransformer(container.moment)
    },
    serviceReadTransformer (container) {
      return new ServiceReadTransformer(container.availabilityReadTransformer, container.sessionLengthReadTransformer)
    },
    serviceStoreTransformer (container) {
      return new ServiceStoreTransformer(container.availabilityStoreTransformer)
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