import { FunctionalCollection } from '@rebelcode/std-lib/src/FunctionalCollection'

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
export function CfBookingsFilter ({ mapState, mapMutations }) {
  return {
    template: "#bookings-filter-template",
    inject: {
      'selection-list': 'selection-list',
      '_': {
        from: 'translate'
      },
    },
    props: {
      searchString: {},
      status: {}
    },
    data () {
      return {
        items: new FunctionalCollection(() => {
          let resultStatuses = {}
          Object.keys(this.statuses).map(key => {
            resultStatuses[key] = {
              id: key,
              title: this.appStatuses[key] || this._('All'),
              count: this.statuses[key]
            }
          })
          return resultStatuses
        }, (statuses) => {
          this.setBookingsStatuses(statuses)
        }, (status) => {
          return status.id
        })
      }
    },
    computed: {
      ...mapState({
        appStatuses: state => state.app.statuses
      }),
      ...mapState('bookings', [
        'bookingsCount',
        'statuses'
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
      },

      /**
       * Status model for selection list.
       *
       * @property {array}
       */
      statusModel: {
        get () {
          return [this.status]
        },
        set (value) {
          this.$emit('update:status', value[0])
          this.submit()
        }
      },
    },
    methods: {
      ...mapMutations('bookings', [
        'setBookingsStatuses'
      ]),

      /**
       * Fire submit event, so listener can request new
       * data according filter values.
       */
      submit () {
        this.$emit('submit')
      }
    },
    components: {
      'selection-list': 'selection-list'
    }
  }
}