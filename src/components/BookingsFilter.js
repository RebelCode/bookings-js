/**
 * Component for filtering by status and client.
 *
 * @todo: filter by status
 *
 * @param mapState
 * @return {Component}
 *
 * @constructor
 */
export function CfBookingsFilter ({ mapState }) {
  return {
    template: "#bookings-filter-template",
    props: {
      searchString: {}
    },
    computed: {
      ...mapState('bookings', [
        'bookingsCount'
      ]),

      /**
       * Search string model. It emits update event on set to
       * simplify usage, so consumer can write:
       *
       * `:search-string.sync="searchString"`
       *
       * @see https://vuejs.org/v2/guide/components-custom-events.html#sync-Modifier
       *
       * @property {string}
       */
      searchStringModel: {
        get () {
          return this.searchString
        },
        set (value) {
          this.$emit('update:searchString', value)
        }
      }
    },
    methods: {
      /**
       * Fire submit event, so listener can request new
       * data according filter values.
       */
      submit () {
        this.$emit('submit')
      }
    }
  }
}