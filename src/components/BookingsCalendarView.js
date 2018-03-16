export function CfBookingsCalendarView (Vuex, moment) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return {
    inject: [
      'bookings-calendar',
      'switcher',
    ],

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

    watch: {
      calendarView (view) {
        this.$refs.calendar.fireMethod('changeView', view)
      }
    },

    computed: {
      ...mapState({
        bookings: state => state.app.bookings,
        screenStatuses: state => state.app.screenStatuses
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
        return this.screenStatuses.indexOf(booking.status) > -1
      },

      bookingPassesServicesFilter (booking) {
        if (this.service === 'all') return true
        return booking.service.id === this.service
      },

      goToToday () {
        this.$refs.calendar.fireMethod('changeView', this.calendarView, moment())
      },

      createNewBooking () {

      },

      updateBookings (start, end) {
        console.info(start, end)
      }
    },

    components: {
      'bookings-calendar' : 'bookings-calendar',
      'switcher' : 'switcher',
    }
  }
}
