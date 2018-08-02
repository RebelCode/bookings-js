export function CfServiceBookingsApplication (state, store, { mapState, mapGetters, mapMutations }) {
  return {
    store,
    inject: {
      'repeater': 'repeater',
      'tabs': 'tabs',
      'tab': 'tab',
      'modal': 'modal',
      'session-length': 'session-length',
      'service-availability-editor': 'service-availability-editor',
      'switcher': 'switcher',
      'bool-switcher': 'bool-switcher',
      'selection-list': 'selection-list',
      'timezone-select': 'timezone-select',
      'availability-calendar': 'availability-calendar',
      'availabilityEditorStateToggleable': 'availabilityEditorStateToggleable',
      'availabilityStoreTransformer': 'availabilityStoreTransformer',

      /**
       * @since [*next-version*]
       *
       * @var {Object.<string, UiActionsPipe>} uiActionsPipes Map of available UI action pipe's names to instances.
       */
      'uiActionsPipes': 'uiActionsPipes',

      'config': 'config',
      '_': {
        from: 'translate'
      }
    },
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
          allowCustomerChangeTimezone: false
        },
      }
    },
    computed: {
      ...mapGetters({
        availabilities: 'availabilities',
        sessions: 'sessionLengths'
      }),

      /**
       * Timezone name for service.
       * 
       * @property {string} Service timezone
       */
      timezone: {
        get () {
          return this.$store.state.app.timezone || this.config.timezone
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

      allowCustomerChangeTimezone: {
        get () {
          return this.$store.state.app.displayOptions.allowCustomerChangeTimezone
        },

        set (value) {
          this.$store.commit('setDisplayOptions', {
            key: 'allowCustomerChangeTimezone',
            value
          })
        }
      },

      bookingOptionsFormData () {
        return JSON.stringify({
          bookingsEnabled: this.bookingsEnabled,
          timezone: this.timezone,
          availability: {
            rules: this.availabilities.map(item => {
              return this.availabilityStoreTransformer.transform(Object.assign({}, item), {
                timezone: this.timezone
              })
            })
          },
          sessionLengths: this.sessions,
          displayOptions: {
            allowCustomerChangeTimezone: this.allowCustomerChangeTimezone
          },
        })
      }
    },
    watch: {
      /**
       * Watch for bookingsEnabled change, and if it is changed
       * run `bookings_enabled_changed` UI actions pipe.
       *
       * @since [*next-version*]
       */
      bookingsEnabled: {
        immediate: true,
        handler (newValue, oldValue) {
          if (!!newValue === !!oldValue) {
            return
          }
          const uiActionsPipe = this.uiActionsPipes['bookings_enabled_changed']
          if (uiActionsPipe) {
            newValue ? uiActionsPipe.act() : uiActionsPipe.revert()
          }
        }
      },
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
}
