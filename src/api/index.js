import BookingsApi from './BookingsApi'
import ClientsApi from './ClientsApi'

/*
 * Exports instances to main container config.
 */
export default function (dependencies) {
  return {
    bookingsApi (container) {
      return new BookingsApi(container.httpClient, container['APP_STATE'].endpointsConfig['bookings'])
    },
    clientsApi (container) {
      return new ClientsApi(container.httpClient, container['APP_STATE'].endpointsConfig['clients'])
    }
  }
}