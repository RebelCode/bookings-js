export function bookingHelpers (statusesColors) {
  return {
    /**
     * Get status style for booking
     *
     * @param status
     * @return {{'background-color': *, color: string}}
     */
    statusStyle (status) {
      return {
        'background-color': statusesColors[status],
        'color': '#000'
      }
    }
  }
}