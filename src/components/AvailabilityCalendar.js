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
      this.$on('day-click', this.dayClicked)
      this.$on('event-selected', this.eventClicked)
    },

    methods: {
      ...mapMutations('bookingOptions', [
        'setAvailabilityEditorState'
      ]),

      dayClicked (date, jsEvent, view) {
        this.setAvailabilityEditorState({
          id: null,
          fromDate: date.format('DD/MM/YYYY')
        })
        this.availabilityEditorStateToggleable.setState(true)
      },

      eventClicked (event) {
        this.setAvailabilityEditorState(event)
        this.availabilityEditorStateToggleable.setState(true)
      }
    }
  })
}