export function momentHelpers (moment) {
  return {
    /**
     * Cache for weekdays in month. Example:
     *
     * {
     *  "2018/02.mon": [2, 9, 16, 23, 20]
     * }
     */
    weekdaysCache: {},

    /**
     * Check that dates are the same weekdays in months (two first mondays)
     *
     * @param {moment} firstDate
     * @param {moment} secondDate
     * @return {boolean} Is dates are the same weekdays in months (two first mondays)
     */
    weekdayOfMonthIsSame (firstDate, secondDate) {
      if (firstDate.day() !== secondDate.day()) {
        return false
      }
      return this.weekdayInMonth(firstDate) === this.weekdayInMonth(secondDate)
    },

    /**
     * Get number of weekday
     *
     * @param date
     * @return {*}
     */
    weekdayInMonthNumber (date) {
      return {
        0: 'first',
        1: 'second',
        2: 'third',
        3: 'fourth',
        4: 'last',
      }[this.weekdayInMonth(date, 'number')]
    },

    /**
     * Get the weekday number in month. For example, 2 April 2018 is
     * *first* Monday of month and
     *
     * @param {moment} date Date to analyse
     * @param {bool|string} format Format to get, don't pass it if full number and week day needed (0mon|-1wed)
     */
    weekdayInMonth (date, format = false) {
      let weekdaysInMonth = this._getWeekdaysInMonth(date)
      let weekdayNumber = weekdaysInMonth.indexOf(date.date())

      let result = {
        number: weekdayNumber,
        day: date.format('ddd'),
      }

      if (format) {
        return result[format]
      }
      return result.number + result.day
    },

    /**
     * Get array of weekdays in month using cache.
     *
     * @param {moment} date Date to get same weekdays
     *
     * @return {array} Weekdays (Mondays) in give month: [2, 9, 16, 23, 20]
     */
    _getWeekdaysInMonth (date) {
      let key = date.format('YYYY/MM.ddd')

      if (!this.weekdaysCache[key]) {
        this.weekdaysCache[key] = this._createWeekdaysInMonth(date)
      }

      return this.weekdaysCache[key]
    },

    /**
     * Create weekdays for month
     *
     * @param {moment} date Date to get same weekdays
     */
    _createWeekdaysInMonth (date) {
      const firstWeekDay = moment(date)
        .startOf('month')
        .day(date.format('dddd'))

      let result = []

      if (firstWeekDay.date() > 7) {
        firstWeekDay.add(7, 'd')
      }

      var month = firstWeekDay.month()
      while (month === firstWeekDay.month()) {
        result.push(firstWeekDay.date())
        firstWeekDay.add(7, 'd')
      }

      return result
    }
  }
}