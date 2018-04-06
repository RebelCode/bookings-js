export function CfBookingsCalendarView ({ mapState, mapMutations }, moment) {
  return {
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

        service: 'all', // OR service id
        calendarView: 'agendaWeek', // 'month', 'agendaDay'
        colorScheme: 'status', // OR 'service'
      }
    },

    props: {
      statuses: {
        default () {
          return []
        }
      }
    },

    watch: {
      calendarView (view) {
        this.$refs.calendar.fireMethod('changeView', view)
      }
    },

    computed: {
      ...mapState({
        bookings: state => state.app.bookings
      }),

      ...mapState('bookings', [
        'services'
      ]),

      filteredBookings () {
        return this.bookings.filter(booking => {
          return this.bookingPassesVisibleStatuses(booking)
            && this.bookingPassesServicesFilter(booking)
        })
      }
    },

    methods: {
      bookingPassesVisibleStatuses (booking) {
        return this.statuses.indexOf(booking.status) > -1
      },

      bookingPassesServicesFilter (booking) {
        if (this.service === 'all') return true
        return booking.service.id === this.service
      },

      goToToday () {
        this.$refs.calendar.fireMethod('changeView', this.calendarView, moment())
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
        // booking will be fetched from remote here
      }
    },

    components: {
      'bookings-calendar' : 'bookings-calendar',
      'switcher' : 'switcher',
    }
  }
}
