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
        params: {
          page: 1,
        },
        month: false,

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
            label: this._(this.isMobile () ? 'Booking details' : 'Booking date and time'),
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
        return moment(date).format('ha, dddd, Do MMMM YYYY')
      },

      onActionClick (action, row) {
        if (action === 'edit') {
          this.$emit('edit', row)
        }
        if (action === 'trash') {
          this.$emit('delete', row, true)
        }
      },

      buildParams () {
        let params = Object.assign({}, this.params)
        if (this.service) {
          params['service'] = this.service
        }
        if (this.month) {
          params['month'] = this.month
        }
        return params
      },

      goToPage (page) {
        this.params.page = page
        this.updateFilter()
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
