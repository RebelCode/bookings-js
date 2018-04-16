export function CfBookingsListView (AbstractBookingsView, { mapState, mapMutations, mapActions }, moment) {
  return AbstractBookingsView.extend({
    inject: {
      'list-table': {
        from: 'wpListTable'
      },
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
            label: 'Edit / View Booking'
          },
          {
            key: 'trash',
            label: 'Delete Permanently'
          }
        ],

        columns: {
          'date': {
            label: 'Booking date and time',
          },
          'client': {
            label: 'Client Name'
          },
          'service': {
            label: 'Service'
          },
          'status': {
            label: 'Booking Status'
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
