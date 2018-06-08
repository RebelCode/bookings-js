import BookingsApi from './BookingsApi'
import ClientsApi from './ClientsApi'
import GeneralApiErrorHandler from './GeneralApiErrorHandler'

/*
 * Exports instances to main container config.
 */
export default function (dependencies) {
  return {
    requestCache (container) {
      return new dependencies.stdLib.RequestCache(container.hashCode)
    },
    rangeCache (container) {
      return new dependencies.bookingWizardComponents.RangeCache(container.moment, dependencies.lodash.differenceWith, dependencies.lodash.isEqual)
    },
    bookingsApi (container) {
      return new BookingsApi(container.httpClient, container.state.endpointsConfig['bookings'], container.requestCache, container.bookingReadTransformer)
    },
    clientsApi (container) {
      return new ClientsApi(container.httpClient, container.state.endpointsConfig['clients'], container.requestCache)
    },
    sessionsApi (container) {
      return new dependencies.bookingWizardComponents.SessionApi(
        container.httpClient,
        container.state.endpointsConfig ? container.state.endpointsConfig['sessions'] : {},
        container.requestCache,
        container.rangeCache,
        container.sessionReadTransformer,
        container.moment
      )
    },
    apiErrorHandlerFactory (container) {
      return (handler) => {
        return new GeneralApiErrorHandler(handler)
      }
    }
  }
}