export function CfAbstractBookingsView (Vue, { mapState, mapMutations }) {
  return Vue.extend({
    inject: [
      'bookings-filter'
    ],

    props: {
      isLoading: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      ...mapState('bookings', [
        'bookings',
        'bookingsCount',
        'services',
        'filter'
      ]),

      status: {
        get () {
          return this.filter.status
        },
        set (value) {
          this.setBookingsFilter({
            key: 'status',
            value
          })
        }
      },

      search: {
        get () {
          return this.filter.search
        },
        set (value) {
          this.setBookingsFilter({
            key: 'search',
            value
          })
        }
      },

      service: {
        get () {
          return this.filter.service
        },
        set (value) {
          this.setBookingsFilter({
            key: 'service',
            value
          })
        }
      },
    },

    mounted () {
      this.$emit('ready')
      this.$nextTick(this.updateFilter)
    },

    methods: {
      ...mapMutations('bookings', [
        'setBookingsFilter',
        'setBookingsViewFilter'
      ]),

      buildParams () {
        throw new Error('Implement `buildParams()` method.')
      },

      updateFilter () {
        /*
         * Get view-specific parameters, for example:
         *
         * `page` for page number in list view;
         * `start` and `end` for calendar view.
         */
        let params = this.buildParams()

        /*
         * Get params that are the same for both views.
         */
        let viewFilter = Object.assign({}, this.filter)

        /*
         * Remove null keys from filter.
         */
        viewFilter = Object.keys(viewFilter)
          .filter(key => {
            return viewFilter[key] !== null
          })
          .reduce((res, key) => (res[key] = viewFilter[key], res), {})

        params = Object.assign({}, params, viewFilter)

        this.setBookingsViewFilter(params)
        this.$emit('update-filter')
      },
    },

    components: {
      'bookings-filter': 'bookings-filter',
    }
  })
}