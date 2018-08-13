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

      /**
       * @since [*next-version*]
       *
       * @property {Validator} complexSetupValidator Complex setup validator.
       */
      'complexSetupValidator': 'complexSetupValidator',

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

        /**
         * @since [*next-version*]
         *
         * @property {ValidationResult|null} lastComplexSetupValidationResult The last result of complex setup validation.
         */
        lastComplexSetupValidationResult: null,

        displayOptions: {
          allowCustomerChangeTimezone: false
        }
      }
    },
    computed: {
      ...mapGetters({
        availabilities: 'availabilities',
        sessions: 'sessionLengths'
      }),

      /**
       * @since [*next-version*]
       *
       * @property {number} maxAvailabilitiesDuration Maximum total duration of all availabilities in days.
       */
      maxAvailabilitiesDuration () {
        if (!this.availabilities.length) {
          return 0
        }
        const availabilitiesDaysDurations = this.availabilities.map(availability => {
          return this.availabilityHelpers.getFullDuration(availability)
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

      /**
       * Watch for `bookingOptionsFormData` change and emit validation event.
       *
       * @since [*next-version*]
       */
      bookingOptionsFormData () {
        this.$emit('data-change')
      }
    },
    mounted () {
      if (!state) {
        throw new Error('Service Bookings App state not initialized')
      }

      this.setInitialState(state)

      /*
       * Run validation when data changed.
       */
      this.$on('data-change', () => {
        this.complexSetupValidator.validate(this).then(validationResult => {
          this.lastComplexSetupValidationResult = validationResult
        })
      })
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
