import BookingsApi from './BookingsApi'
import ClientsApi from './ClientsApi'
import SessionsApi from './SessionsApi'
import RequestCache from './RequestCache'

/*
 * Exports instances to main container config.
 */
export default function (dependencies) {
  return {
    requestCache () {
      return new RequestCache()
    },
    bookingsApi (container) {
      return new BookingsApi(container.httpClient, container.state.endpointsConfig['bookings'], this.requestCache)
    },
    clientsApi (container) {
      return new ClientsApi(container.httpClient, container.state.endpointsConfig['clients'], this.requestCache)
    },
    sessionsApi (container) {
      return new SessionsApi(container.httpClient, container.state.endpointsConfig['sessions'], this.requestCache)
    }
  }
}