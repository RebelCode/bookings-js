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
  const timeFormat = 'HH:mm:ss'

  return FullCalendar.extend({
    inject: [
      'availabilitiesCollection'
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
      header: {
        default () {
          return {
            left: 'agendaWeek,month',
            right: 'prev title next'
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
      }
    },

    mounted () {
      this.$on('event-created', this.eventCreated)
      this.$on('event-selected', this.eventClicked)
    },

    methods: {
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
        let fromDate = moment(availability.fromDate, 'YYYY-MM-DD')

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
        let diff = availability.repeats
        const metRecurringPeriod = fromDate.diff(day, diff) % availability.repeatsEvery === 0
        if (!metRecurringPeriod) return false

        const repeatingRules = {
          never () {
            return fromDate.isSame(day, 'day')
          },
          day () {
            return true
          },
          week () {
            return availability.repeatsOn.indexOf(day.format('ddd').toLowerCase()) > -1
          },
          month () {
            let mode = availability.repeatsOn[0]
            return mode === 'dow' ? fromDate.format('ddd') === day.format('ddd')
              : fromDate.format('D') === day.format('D')
          },
          year () {
            return fromDate.format('DD/MM') === day.format('DD/MM')
          }
        }

        return repeatingRules[availability.repeats] ? repeatingRules[availability.repeats]() : false
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
        if (availability.repeats === 'never') {
          return false
        }
        if (availability.repeatsEnds === 'afterWeeks') {
          return moment(fromDate).add(availability.repeatsEndsWeeks, 'week').isBefore(day)
        }
        else if (availability.repeatsEnds === 'onDate') {
          return moment(availability.repeatsEndsDate, 'YYYY-MM-DD').isBefore(day)
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

        return Object.assign({}, {
          id: model.id,
          model
        }, !model.isAllDay ? {
          start: day.format('YYYY-MM-DD') + 'T' + model.fromTime,
          end: day.format('YYYY-MM-DD') + 'T' + model.toTime,
          allDay: model.isAllDay,
        } : {
          start: day.format('YYYY-MM-DD'),
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
        let event = {id: null}

        if (params) {
          let {start, end, allDay} = params

          event = Object.assign({}, event, {
            fromDate: start.format(),
            isAllDay: allDay,
          })

          if (!allDay) {
            event = Object.assign({}, event, {
              fromTime: start.format(timeFormat),
              toTime: end.format(timeFormat)
            })
          }
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