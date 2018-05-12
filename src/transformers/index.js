import BookingTransformer from './BookingTransformer'
import AvailabilityTransformer from './AvilabilityTransformer'

export default function (dependencies) {
  return {
    bookingTransformer (container) {
      return new BookingTransformer(container)
    },
    availabilityTransformer (container) {
      return new AvailabilityTransformer(container)
    }
  }
}