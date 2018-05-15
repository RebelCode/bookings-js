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
      'timezone-select',
      'availability-calendar',
      'availabilityEditorStateToggleable',
      'availabilityTransformer'
    ],
    data () {
      return {
        overlappingAvailabilities: false,

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
        sessions: state => state.app.sessions,
        availabilities: state => state.app.availabilities
      }),

      /**
       * Timezone name for service.
       * 
       * @property {string} Service timezone
       */
      timezone: {
        get () {
          return this.$store.state.app.timezone
        },
        set (value) {
          this.$store.commit('setTimezone', value)
        }
      },

      bookingsEnabled: {
        get () {
          return this.$store.state.app.bookingsEnabled
        },
        set (value) {
          this.$store.commit('setBookingsEnabled', value)
        }
      },

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
      },

      bookingOptionsFormData () {
        return JSON.stringify({
          bookingsEnabled: this.bookingsEnabled,
          availability: {
            serviceTimezone: this.timezone,
            rules: this.availabilities.map(item => {
              return this.availabilityTransformer.transform(Object.assign({}, item))
            })
          },
          sessionLengths: this.sessions,
          displayOptions: {
            useCustomerTimezone: this.useCustomerTimezone
          },
        })
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
      'timezone-select': 'timezone-select'
    }
  }
};