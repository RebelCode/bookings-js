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
       * @property {AvailabilityHelpers} availabilityHelpers Set of helper methods for availabilities.
       */
      'availabilityHelpers': 'availabilityHelpers',

      /**
       * @since [*next-version*]
       *
       * @property {UiActionsPipe} uiActionBookingsEnabledChanged UI action pipe for bookings enabled change.
       */
      'uiActionBookingsEnabledChanged': 'uiActionBookingsEnabledChanged',

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
    props: {
      /**
       * @since [*next-version*]
       *
       * @property sessionLengthsCountLimit {number} How many sessions allowed without showing limit warning message.
       */
      sessionLengthsCountLimit: {
        default: 0,
        type: Number
      },

      /**
       * @since [*next-version*]
       *
       * @property availabilityRepeatDaysLimit {number} Max allowed repeating days of availability without showing limit warning message.
       */
      availabilityRepeatDaysLimit: {
        default: 0,
        type: Number
      },

      /**
       * @since [*next-version*]
       *
       * @property sessionLengthsCountLimit {number} Exceeded limit warning message.
       */
      exceededLimitMessage: String,
    },
    computed: {
      ...mapGetters({
        availabilities: 'availabilities',
        sessions: 'sessionLengths'
      }),

      /**
       * Should exceeded limit warning should be visible.
       *
       * @since [*next-version*]
       *
       * @return {boolean} Should exceeded limit warning should be visible.
       */
      isExceededLimitWarningVisible () {
        return (!!this.sessions.length && this.sessions.length >= this.sessionLengthsCountLimit)
          || (!!this.maxAvailabilityRepeatDays && this.maxAvailabilityRepeatDays >= this.availabilityRepeatDaysLimit)
      },

      /**
       * Get maximum number of days for availability.
       *
       * @since [*next-version*]
       *
       * @return {number} Maximum number of days that availability is available.
       */
      maxAvailabilityRepeatDays () {
        if (!this.availabilities.length) {
          return 0
        }
        const availabilitiesDaysDurations = this.availabilities.map(availability => {
          return this.availabilityHelpers.getRepeatDaysCount(availability)
        })
        return Math.max(...availabilitiesDaysDurations)
      },

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
          if (!this.uiActionBookingsEnabledChanged || !!newValue === !!oldValue) {
            return
          }
          newValue ? this.uiActionBookingsEnabledChanged.act() : this.uiActionBookingsEnabledChanged.revert()
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
