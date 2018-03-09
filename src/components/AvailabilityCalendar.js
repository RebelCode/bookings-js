export default function (FullCalendar, Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return FullCalendar.extend({
    inject: [
      'availabilityEditorStateToggleable'
    ],
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
      }
    },

    computed: {
      events () {
        if(!this.availabilities.map) return []

        return this.availabilities.map((item) => {
          return this.availabilityToEvent(item)
        })
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
       * Convert availability model to event format that understandable by
       * calendar. This is required to not force backend to prepare data
       * for the concrete calendar implementation.
       *
       * @param availability
       * @return {{id: null, allDay: *, start: string, end: string, model: {} & any}}
       */
      availabilityToEvent (availability) {
        let model = Object.assign({}, availability)

        console.info(model)

        return {
          id: model.id,
          allDay: model.allDay,
          start: model.fromDate + 'T' + model.fromTime,
          end: model.fromDate + 'T' + model.toTime,
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