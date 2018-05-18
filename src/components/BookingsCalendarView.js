export function CfBookingsCalendarView (AbstractBookingsView, { mapState, mapMutations }, moment) {
  return AbstractBookingsView.extend({
    inject: {
      'bookings-calendar': 'bookings-calendar',
      'switcher': 'switcher',

      /**
       * Modal state injected from elsewhere.
       *
       * @var {FunctionalToggleable}
       */
      modalState: {
        from: 'bookingEditorState'
      },
    },

    data () {
      return {
        calendarViews: {
          'agendaDay': 'Day',
          'agendaWeek': 'Week',
          'month': 'Month',
        },

        calendarView: 'agendaWeek', // 'month', 'agendaDay'
        colorScheme: 'status', // OR 'service'

        params: {
          start: null,
          end: null
        },
      }
    },

    props: {
      statuses: {
        default () {
          return []
        }
      },
      isLoading: {
        type: Boolean,
        default: false
      }
    },

    watch: {
      calendarView (view) {
        this.$refs.calendar.fireMethod('changeView', view)
      }
    },

    methods: {
      goToToday () {
        this.$refs.calendar.fireMethod('changeView', this.calendarView, moment())
      },

      createBooking (bookingParams) {
        this.$emit('create', bookingParams)
      },

      editBooking (booking) {
        this.$emit('edit', booking)
      },

      /**
       * Update bookings according new dates.
       *
       * @param start {moment} Start date
       * @param end {moment} End date
       */
      updateBookings (start, end) {
        this.params.start = start.format('YYYY-MM-DD')
        this.params.end = end.format('YYYY-MM-DD')

        this.updateFilter()
      },

      /**
       * Build parameters for request
       *
       * @return {object}
       */
      buildParams () {
        return Object.assign({}, this.params)
      }
    },

    components: {
      'bookings-calendar' : 'bookings-calendar',
      'switcher' : 'switcher',
    }
  })
}
