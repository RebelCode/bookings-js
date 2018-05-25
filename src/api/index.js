import BookingsApi from './BookingsApi'
import ClientsApi from './ClientsApi'
import SessionsApi from './SessionsApi'

/*
 * Exports instances to main container config.
 */
export default function (dependencies) {
  return {
    bookingsApi (container) {
      return new BookingsApi(container.httpClient, container.state.endpointsConfig['bookings'])
    },
    clientsApi (container) {
      return new ClientsApi(container.httpClient, container.state.endpointsConfig['clients'])
    },
    sessionsApi (container) {
      return new SessionsApi(container.httpClient, container.state.endpointsConfig['sessions'])
    }
  }
}