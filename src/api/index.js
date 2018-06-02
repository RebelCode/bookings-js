import BookingsApi from './BookingsApi'
import ClientsApi from './ClientsApi'

/*
 * Exports instances to main container config.
 */
export default function (dependencies) {
  return {
    requestCache (container) {
      return new dependencies.bookingWizardComponents.RequestCache(container.hashCode)
    },
    rangeCache (container) {
      return new dependencies.bookingWizardComponents.RangeCache(container.moment, container.lodash)
    },
    bookingsApi (container) {
      return new BookingsApi(container.httpClient, container.state.endpointsConfig['bookings'], container.requestCache, container.bookingReadTransformer)
    },
    clientsApi (container) {
      return new ClientsApi(container.httpClient, container.state.endpointsConfig['clients'], container.requestCache)
    },
    sessionsApi (container) {
      return new SessionsApi(
        container.httpClient,
        container.state.endpointsConfig['sessions'],
        container.requestCache,
        container.rangeCache,
        container.sessionReadTransformer,
        container.moment
      )
    }
  }
}