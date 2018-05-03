/**
 * Calendar for rendering availabilities in format suitable
 * for customer.
 *
 * Customer will see how exactly availabilities will be available
 * across days.
 *
 * @param FullCalendar
 * @param moment
 * @return {*}
 */
export default function (FullCalendar, moment) {
  const datetimeFormat = 'YYYY-MM-DD HH:mm:ss'

  return FullCalendar.extend({
    inject: [
      'availabilitiesCollection',
      'momentHelpers'
    ],
    data () {
      return {
        rangeStart: null,
        rangeEnd: null,
        generatedAvailabilities: []
      }
    },
    props: {
      availabilities: {
        default () {
          return []
        }
      },
      overlappingAvailabilities: {
        type: Boolean,
        default: false,
      },
      header: {
        default () {
          return {
            left: 'agendaWeek,month today',
            right: 'title prev,next'
          }
        },
      },
      defaultView: {
        default () {
          return 'agendaWeek'
        },
      },
      config: {
        type: Object,
        default () {
          let self = this
          return {
            viewRender (view) {
              self.rangeStart = view.start
              self.rangeEnd = view.end
              self.renderRepeatedAvailabilities()
            },
            selectAllow (selectInfo) {
              return selectInfo.start.isSameOrAfter(moment(), 'day')
            }
          }
        },
      },
    },

    computed: {
      events () {
        return this.generatedAvailabilities
      }
    },

    watch: {
      availabilities: {
        deep: true,
        handler () {
          if (!this.rangeStart) return
          this.renderRepeatedAvailabilities()
        }
      },
      generatedAvailabilities (value) {
        let overlapping = {}
        for (let availability of value) {
          if (!overlapping[availability.start]) {
            overlapping[availability.start] = 0
          }
          if (availability.model.isAllDay) {
            overlapping[availability.start]++
          }
          if (overlapping[availability.start] > 1) {
            this.$emit('update:overlappingAvailabilities', true)
            return
          }
        }
        this.$emit('update:overlappingAvailabilities', false)
      }
    },

    mounted () {
      this.$on('event-created', this.eventCreated)
      this.$on('event-selected', this.eventClicked)
      this.$on('event-render', this.eventRender)
    },

    methods: {
      eventRender (event, el) {
        let endDate = event.end || event.start
        if (endDate.isBefore(moment(), 'day')) {
          el[0].classList.add('fc-event--past')
        }
      },

      /**
       * Render availabilities.
       *
       * It will render each availability repeated
       * according availability repeating rules.
       *
       * It will help customer to see exactly on which days and how
       * sessions are available.
       */
      renderRepeatedAvailabilities () {
        if (!this.availabilities.map) return
        let repeatedAvailabilities = []

        for (let m = moment(this.rangeStart); m.diff(this.rangeEnd, 'days') <= 0; m.add(1, 'days')) {
          repeatedAvailabilities = repeatedAvailabilities.concat(
            this.getAvailabilitiesForDay(moment(m))
          )
        }

        this.generatedAvailabilities = repeatedAvailabilities
      },

      /**
       * Get availabilities in form of events for the given day.
       *
       * @param day
       */
      getAvailabilitiesForDay (day) {
        return this.availabilities.filter((item) => {
          return this.availabilityFitsInDay(item, day)
        }).map((item) => {
          return this.availabilityToEvent(item, day)
        })
      },

      /**
       * Is current availability should be rendered in this day
       *
       * @param availability
       * @param day
       * @return {*}
       */
      availabilityFitsInDay (availability, day) {
        let fromDate = moment(availability.start, 'YYYY-MM-DD HH:mm:ss')
        fromDate.set({
          hour: 0,
          minute: 0,
        })

        console.info('fits in day', fromDate.format('YYYY-MM-DD HH:mm:ss'), day.format('YYYY-MM-DD HH:mm:ss'))

        const availabilityShouldntBeRendered = fromDate.isAfter(day, 'day')
          || this.availabilityEnded(availability, fromDate, day)
          || this.dayInExcluded(availability, day)

        if (availabilityShouldntBeRendered) {
          return false
        }

        return this.availabilityIsOnDay(availability, fromDate, day)
      },

      /**
       * Check day in excluded
       *
       * @param availability
       * @param day
       * @return {boolean}
       */
      dayInExcluded (availability, day) {
        if (!availability.excludesDates || !availability.excludesDates.length)
          return false

        for (let excludedDate of availability.excludesDates) {
          if (moment(excludedDate, 'YYYY-MM-DD').isSame(day, 'day')) {
            return true
          }
        }

        return false
      },

      /**
       * Return true if availability should be rendered ion that day.
       *
       * @param availability
       * @param fromDate
       * @param day
       * @return {*}
       */
      availabilityIsOnDay (availability, fromDate, day) {
        let diff = availability.repeatUnit
        const metRecurringPeriod = fromDate.diff(day, diff) % availability.repeatPeriod === 0
        if (!metRecurringPeriod) return false

        if (!availability.repeat) {
          return fromDate.isSame(day, 'day')
        }

        const vm = this

        const repeatingRules = {
          days () {
            return true
          },
          weeks () {
            return availability.repeatWeeklyOn.indexOf(day.format('dddd').toLowerCase()) > -1
          },
          months () {
            let mode = availability.repeatMonthlyOn[0]
            return mode === 'day_of_week' ? vm.momentHelpers.weekdayOfMonthIsSame(fromDate, day) : fromDate.format('D') === day.format('D')
          },
          years () {
            return fromDate.format('DD/MM') === day.format('DD/MM')
          }
        }

        return repeatingRules[availability.repeatUnit] ? repeatingRules[availability.repeatUnit]() : false
      },

      /**
       * Is availability repeating ended.
       *
       * This is determined by the ending date or by the weeks count,
       * after which availability becomes not available.
       *
       * @param availability
       * @param fromDate
       * @param day
       * @return {*}
       */
      availabilityEnded (availability, fromDate, day) {
        if (!availability.repeat) {
          return false
        }
        if (availability.repeatUntil === 'period') {
          return moment(fromDate).add(availability.repeatUntilPeriod, availability.repeatUnit).isBefore(day)
        }
        else if (availability.repeatUntil === 'date') {
          return moment(availability.repeatUntilDate, 'YYYY-MM-DD').isBefore(day)
        }
        return false
      },

      /**
       * Convert availability model to event format that understandable by
       * calendar. This is required to not force backend to prepare data
       * for the concrete calendar implementation.
       *
       * @param availability
       * @return {{id: null, allDay: *, start: string, end: string, model: {} & any}}
       */
      availabilityToEvent (availability, day) {
        let model = Object.assign({}, availability)

        let availabilityDuration = moment(availability.end).diff(moment(availability.start), 'seconds'),
          availabilityStartTime = moment(availability.start).format('HH:mm:ss')

        let eventStart = day.format('YYYY-MM-DD') + 'T' + availabilityStartTime,
          eventEnd = moment(eventStart).add(availabilityDuration, 'seconds').format('YYYY-MM-DD\THH:mm:ss')

        return Object.assign({}, {
          id: model.id,
          editable: false, // disable dragging and resizing
          start: eventStart,
          end: eventEnd,
          allDay: model.isAllDay,
          model
        })
      },

      /**
       * Create event when user clicks on calendar day, or
       * select some duration on calendar, or user click
       * on floating Add button.
       *
       * @param params {{start:moment, end:moment, allDay:boolean}} Params, coming from full calendar.
       */
      eventCreated (params) {
        this.fireMethod('unselect')

        let event = {id: null}

        if (params) {
          let {start, end, allDay} = params

          event = Object.assign({}, event, {
            start: start.format(datetimeFormat),
            end: end.format(datetimeFormat),
            isAllDay: allDay,
          })
        }

        this.$emit('availability-click', event)
      },

      /**
       * Triggered when user clicks on event in calendar.
       *
       * @param event
       */
      eventClicked (event) {
        this.$emit('availability-click', Object.assign({}, event.model))
      }
    },

    render (h) {
      let self = this
      return h('div', {
        ref: 'calendar'
      }, [
        h('div', {
          class: 'button-floating',
          on: {
            click () {
              self.eventCreated()
            }
          }
        }, ['+'])
      ])
    }
  })
}