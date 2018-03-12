export default function (FullCalendar, Vuex, moment) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return FullCalendar.extend({
    inject: [
      'availabilityEditorStateToggleable'
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
        // console.info('events computed')
        //
        // if(!this.availabilities.map) return []
        //
        // console.info('events computed started rendering')
        //
        // return this.availabilities.map((item) => {
        //   return this.availabilityToEvent(item)
        // })
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
      ...mapMutations('bookingOptions', [
        'setAvailabilityEditorState'
      ]),

      /**
       * Render availabilities. It will transform all availabilities
       * to event format that understandable by full calendar.
       */
      renderRepeatedAvailabilities () {
        if (!this.availabilities.map) return
        let repeatedAvailabilities = [];

        for (let m = moment(this.rangeStart); m.diff(this.rangeEnd, 'days') <= 0; m.add(1, 'days')) {
          repeatedAvailabilities = repeatedAvailabilities.concat(
            this.getAvailabilitiesForDay(moment(m))
          )
        }

        this.generatedAvailabilities = repeatedAvailabilities;
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
      availabilityFitsInDay(availability, day) {
        let fromDate = moment(availability.fromDate, 'YYYY-MM-DD')

        const availabilityShouldnBeRendered = day.isBefore(fromDate)
          || this.availabilityEnded(availability, fromDate, day)
          || this.dayInExcluded(availability, day)

        if (availabilityShouldnBeRendered) {
          return false
        }

        return this.availabilityIsOnDay(availability, fromDate, day);
      },

      /**
       * Check day in excluded
       *
       * @param availability
       * @param day
       * @return {boolean}
       */
      dayInExcluded (availability, day) {
        if (!availability.excludes || !availability.excludes.dates || !availability.excludes.dates.length)
          return false

        for (let excludedDate of availability.excludes.dates) {
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
        let diff = availability.repeats.replace('ly', '')
        const metRecurringPeriod = fromDate.diff(day, diff) % availability.repeatsEvery === 0
        if(!metRecurringPeriod) return false

        return {
          daily () {
            return true
          },
          weekly () {
            return availability.repeatsOn.indexOf(day.format('ddd').toLowerCase()) > -1
          },
          monthly () {
            let mode = availability.repeatsOn[0]
            return mode === 'dow' ? fromDate.format('ddd') === day.format('ddd')
              : fromDate.format('D') === day.format('D')
          },
          yearly () {
            return fromDate.format('DD/MM') === day.format('DD/MM')
          }
        }[availability.repeats]()
      },

      /**
       * @param availability
       * @param fromDate
       * @param day
       * @return {*}
       */
      availabilityEnded (availability, fromDate, day) {
        if (availability.repeatsEnds === 'afterWeeks') {
          return moment(fromDate).add(availability.repeatsEndsWeeks, 'week').isBefore(day, 'day')
        }
        else if (availability.repeatsEnds === 'onDate') {
          return moment(availability.repeatsEndsDate, 'YYYY-MM-DD').isBefore(day, 'day')
        }
        return false;
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
        return {
          id: model.id,
          allDay: model.allDay,
          start: day.format('YYYY-MM-DD') + 'T' + model.fromTime,
          end: day.format('YYYY-MM-DD') + 'T' + model.toTime,
          model
        }
      },

      /**
       * Prepare time for the editor.
       *
       * @todo: Move this stuff to the editor, please
       *
       * @param time
       * @return {*}
       * @private
       */
      _getTimeModel (time) {
        if (time && time.format) {
          return {
            HH: time.format('HH'),
            mm: time.format('mm'),
          }
        }

        try {
          time = time.split(':')
          return {HH: time[0], mm: time[1]}
        }
        catch (e) {
          return {HH:null, mm: null}
        }
      },

      /**
       * Create event when user clicks on calendar day, or
       * select some duration on calendar, or user click
       * on floating Add button.
       *
       * @param params
       */
      eventCreated (params) {
        let event = {id: null}

        if (params) {
          let {start, end, allDay} = params;

          event = Object.assign({}, event, {
            fromDate: start.format(),
            isAllDay: allDay,
          })

          if (!allDay) {
            event = Object.assign({}, event, {
              fromTime: this._getTimeModel(start),
              toTime: this._getTimeModel(end)
            })
          }
        }

        this.setAvailabilityEditorState(event)
        this.availabilityEditorStateToggleable.setState(true)
      },

      eventClicked (event) {
        let model = Object.assign({}, event.model, {
          fromTime: this._getTimeModel(event.model.fromTime),
          toTime: this._getTimeModel(event.model.toTime)
        })
        this.setAvailabilityEditorState(model)
        this.availabilityEditorStateToggleable.setState(true)
      }
    },

    render(h) {
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
          }}, ['+'])
      ])
    }
  })
}