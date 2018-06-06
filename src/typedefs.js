/**
 * Availability object is rule for sessions generation that describes
 * how exactly sessions should be generated.
 *
 * @typedef {Object} Availability
 *
 * @property {number} id Availability id.
 * @property {string} start Start datetime of available time in ISO8601 format.
 * @property {string} end End datetime of available time in ISO8601 format.
 * @property {boolean} isAllDay Is availability is all day availability
 * @property {boolean} repeat Is availability repeated
 * @property {boolean} repeatPeriod How frequently availability is repeated (1 - every one repeatUnit, etc).
 * @property {string} repeatUnit Availability repeat period. Can be "day" | "week" | "month" | "year".
 * @property {string} repeatUntil Until which moment in time availability repeated. Can be "period" | "date".
 * @property {number} repeatUntilPeriod If repeat until is "period", during how many periods it will be repeated.
 * @property {string} repeatUntilDate If repeat until is "date", until which date (in ISO8601) it will be repeated.
 * @property {string[]} repeatWeeklyOn Array of full weekdays ("monday") on which availability should be repeated. Works only with weekly repeating.
 * @property {string} repeatMonthlyOn How to repeat availability on monthly repeating ("day_of_week" | "date_of_month")
 * @property {string[]} excludeDates Array of dates in ISO8601 that should be excluded from repeating.
 */