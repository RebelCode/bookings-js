export function CfBookingsListView ({ mapState, mapMutations }, moment) {
  return {
    inject: {
      'list-table': {
        from: 'wpListTable'
      },
    },

    data () {
      return {
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
            label: 'Booking Date',
          },
          'client': {
            label: 'Client name'
          },
          'service': {
            label: 'Service'
          },
          'status': {
            label: 'Booking status'
          }
        },

        service: 'all',
      }
    },

    computed: {
      ...mapState({
        items: state => state.app.bookings
      }),

      ...mapState('bookings', [
        'services'
      ]),
    },

    methods: {
      humanizeDate (date) {
        return moment(date).format('ha, MMMM Do, YYYY') // 12pm, June 20th, 2017
      },

      onActionClick (action, row) {
        if (action === 'edit') {
          this.$emit('edit', row)
        }
      },

      goToPage () {}
    },

    components: {
      'list-table' : 'list-table',
    }
  }
}
