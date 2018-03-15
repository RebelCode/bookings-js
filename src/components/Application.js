import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export default function (state, store, Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return {
    store,
    inject: [
      'calendar',
      'repeater',
      'tabs', 'tab', 'modal',
      'session-length', 'service-availability-editor', 'booking-editor',
      'switcher',
      'bool-switcher',
      'availability-calendar',
      'bookings-calendar',
    ],
    data () {
      return {
        activeTab: 0,

        tabsConfig: {
          switcherClass: 'horizontal-tabs',
          switcherItemClass: 'horizontal-tabs__item',
          switcherActiveItemClass: '_active',
          tabsClass: 'tabs-content'
        },

        calendarConfig: {
          showDatesInCustomersTimezone: false
        },

        colorScheme: 'status',
      }
    },
    computed: {
      ...mapState({
        events: state => state.app.events,
        bookings: state => state.app.bookings
      })
    },
    mounted () {
      if (!state) {
        throw new Error('App state not initialized')
      }

      this.setInitialState(state)
    },
    methods: {
      ...mapMutations([
        'setInitialState'
      ]),

      createNewBooking () {

      },

      updateBookings (start, end) {
        console.info(start, end)
      }
    },
    components: {
      calendar: 'calendar',
      repeater: 'repeater',
      tabs: 'tabs',
      tab: 'tab',
      modal: 'modal',
      switcher: 'switcher',
      'availability-calendar': 'availability-calendar',
      'session-length': 'session-length',
      'bool-switcher': 'bool-switcher',

      'service-availability-editor': 'service-availability-editor',
      'booking-editor': 'booking-editor',
      'bookings-calendar': 'bookings-calendar',
    }
  }
};