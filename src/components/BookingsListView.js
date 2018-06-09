export function CfBookingsListView (AbstractBookingsView, { mapState, mapMutations, mapActions }, moment) {
  return AbstractBookingsView.extend({
    inject: {
      'isMobile': 'isMobile',
      'bookingHelpers': 'bookingHelpers',
      'config': 'config',
      'list-table': {
        from: 'wpListTable'
      },
      '_': {
        from: 'translate'
      },

      /**
       * Function for text formatting, it will replace placeholders to given values.
       *
       * @var {Function}
       */
      'formatter': {
        from: 'textFormatter'
      }
    },

    data () {
      return {
        page: 1,
        month: null,

        /**
         * @since [*next-version*]
         *
         * @property {string[]} Array of component's fields that will be used for bookings search.
         */
        requestParams: [
          'page', 'month', 'service', 'search', 'status'
        ],

        actions: [
          {
            key: 'edit',
            label: this._('Edit / View Booking')
          },
          {
            key: 'trash',
            label: this._('Delete Permanently')
          }
        ],

        columns: {
          'date': {
            label: this._(this.isMobile() ? 'Booking details' : 'Booking date and time'),
          },
          'client': {
            label: this._('Client Name')
          },
          'service': {
            label: this._('Service')
          },
          'status': {
            label: this._('Booking Status')
          }
        },
      }
    },

    computed: {
      pagesCount () {
        if (!this.bookingsCount) {
          return 1
        }
        return Math.ceil(this.bookingsCount / 10)
      },
    },

    methods: {
      humanizeDate (date) {
        return moment(date).format('h:mm a, dddd, Do MMMM YYYY')
      },

      onActionClick (action, row) {
        if (action === 'edit') {
          this.$emit('edit', row)
        }
        if (action === 'trash') {
          this.$emit('delete', row, true)
        }
      },

      goToPage (page) {
        this.page = page
        this.applyFilter()
      },

      _month(monthNumber) {
        return moment(monthNumber, 'M').format('MMMM')
      }
    },

    components: {
      'list-table' : 'list-table',
    }
  })
}
