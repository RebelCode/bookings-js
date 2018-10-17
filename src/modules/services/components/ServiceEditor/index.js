import template from './template.html'

export default function (AbstractEntityModalEditor, { mapState, mapMutations, mapActions }) {
  return AbstractEntityModalEditor.extend({
    ...template,
    inject: {
      /**
       * Modal state injected from the container.
       *
       * @var {FunctionalToggleable}
       */
      modalState: {
        from: 'serviceEditorState'
      },

      'api': {
        from: 'servicesApi'
      },

      '_': {
        from: 'translate'
      },

      /**
       * @since [*next-version*]
       *
       * @property {Validator} complexSetupValidator Complex setup validator.
       */
      'complexSetupValidator': 'complexSetupValidator',

      /**
       * @since [*next-version*]
       *
       * @property {AvailabilityHelpers} availabilityHelpers Set of helper methods for availabilities.
       */
      'availabilityHelpers': 'availabilityHelpers',

      'availabilityEditorStateToggleable': 'availabilityEditorStateToggleable',

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
    },
    data () {
      return {
        isCreateConfirming: false,

        isSaving: false,

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

        model: {
          id: null,
          timezone: 'UTC+0',
          availability: {
            rules: []
          },
          sessionLengths: [],
          displayOptions: {
            allowCustomerChangeTimezone: false
          }
        }
      }
    },
    computed: {
      ...mapState('services', {
        entityModel: 'one',
        entitiesCollection: 'list'
      }),

      /**
       * @since [*next-version*]
       *
       * @property {number} maxAvailabilitiesDuration Maximum total duration of all availabilities in days.
       */
      maxAvailabilitiesDuration () {
        if (!this.model.availability.rules.length) {
          return 0
        }
        const availabilitiesDaysDurations = this.model.availability.rules.map(availability => {
          return this.availabilityHelpers.getFullDuration(availability)
        })
        return Math.max(...availabilitiesDaysDurations)
      },
    },
    watch: {
      model: {
        deep: true,
        handler () {
          this.complexSetupValidator.validate(this).then(validationResult => {
            this.lastComplexSetupValidationResult = validationResult
          })
        }
      }
    },
    methods: {
      ...mapMutations('bookingOptions', [
        'setAvailabilityEditorState'
      ]),

      ...mapActions('services', {
        dispatchCreate: 'create',
        dispatchUpdate: 'update'
      }),

      openAvailabilityEditor (availability = {}) {
        this.setAvailabilityEditorState(availability)
        this.availabilityEditorStateToggleable.setState(true)
      },

      save () {
        const dispatchSaveMethod = this.model.id ? 'dispatchUpdate' : 'dispatchCreate'
        this.isSaving = true
        return this[dispatchSaveMethod]({api: this.api, model: this.model}).then(() => {
          this.isSaving = false
          this.$emit('saved')
          this.forceCloseModal()
        })
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
  })
}