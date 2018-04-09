import BookingsApi from './BookingsApi'

/*
 * Exports instances to main container config.
 */
export default function (dependencies) {
  return {
    bookingsApi (container) {
      return new BookingsApi(container.httpClient, container['APP_STATE'].endpointsConfig['bookings'])
    }
  }
}