export function CfServiceBookingsApplication (state, store, Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return {
    store,
    inject: [
      'repeater',
      'tabs', 'tab', 'modal',
      'session-length',
      'service-availability-editor',
      'switcher',
      'bool-switcher',
      'selection-list',
      'availability-calendar',
      'availabilityEditorStateToggleable'
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

        displayOptions: {
          useCustomerTimezone: false
        },
      }
    },
    computed: {
      ...mapState({
        availabilities: state => state.app.availabilities
      }),

      useCustomerTimezone: {
        get () {
          return this.$store.state.app.displayOptions.useCustomerTimezone
        },

        set (value) {
          this.$store.commit('setDisplayOptions', {
            key: 'useCustomerTimezone',
            value
          })
        }
      }
    },
    mounted () {
      if (!state) {
        throw new Error('Service Bookings App state not initialized')
      }

      this.setInitialState(state)
    },
    methods: {
      ...mapMutations([
        'setInitialState',
      ]),

      ...mapMutations('bookingOptions', [
        'setAvailabilityEditorState'
      ]),

      openAvailabilityEditor (availability) {
        this.setAvailabilityEditorState(availability)
        this.availabilityEditorStateToggleable.setState(true)
      }
    },
    components: {
      repeater: 'repeater',
      tabs: 'tabs',
      tab: 'tab',
      modal: 'modal',
      switcher: 'switcher',
      'availability-calendar': 'availability-calendar',
      'session-length': 'session-length',
      'bool-switcher': 'bool-switcher',
      'selection-list': 'selection-list',
      'service-availability-editor': 'service-availability-editor',
    }
  }
};