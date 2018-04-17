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
        'color': this.getBrightness(statusesColors[status]) > .5 ? '#000' : '#fff'
      }
    },


    /**
     * Get color brightness to determine text color over event
     *
     * @param hexCode
     * @return {number}
     * @private
     */
    getBrightness(hexCode) {
      // strip off any leading #
      hexCode = hexCode.replace('#', '');

      const c_r = parseInt(hexCode.substr(0, 2),16);
      const c_g = parseInt(hexCode.substr(2, 2),16);
      const c_b = parseInt(hexCode.substr(4, 2),16);

      return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000 / 255;
    },
  }
}