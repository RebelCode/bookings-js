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

    mounted () {
      this.$emit('ready')
      this.$nextTick(this.updateFilter)
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

    computed: {
      ...mapState('bookings', [
        'bookings',
        'bookingsCount',
        'services'
      ]),

      filteredBookings () {
        return this.bookings.filter(booking => {
          return this.bookingPassesServicesFilter(booking)
        })
      }
    },

    methods: {
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
        this.$emit('update-filter', {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD'),
        })
      }
    },

    components: {
      'bookings-calendar' : 'bookings-calendar',
      'switcher' : 'switcher',
    }
  }
}
