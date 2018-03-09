export default function (FullCalendar, Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return FullCalendar.extend({
    inject: [
      'availabilityEditorStateToggleable'
    ],
    props: {
      header: {
        default() {
          return {
            left: 'agendaWeek,month',
            right: 'prev title next'
          }
        },
      },
      defaultView: {
        default() {
          return 'agendaWeek'
        },
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

      _getTimeModel (time) {
        try {
          return {
            HH: time.format('HH'),
            mm: time.format('mm'),
          }
        }
        catch (e) {
          return {HH:null, mm: null}
        }
      },

      eventCreated (params) {
        let event = {id: null}

        if (params) {
          let {start, end, allDay} = params;

          event = Object.assign({}, event, {
            fromDate: start.format('DD/MM/YYYY'),
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
        this.setAvailabilityEditorState(event)
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