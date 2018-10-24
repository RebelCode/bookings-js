import template from './template.html'

/**
 * The service modal editor.
 *
 * @param AbstractEntityModalEditor
 * @param mapState
 * @param mapMutations
 * @param mapActions
 *
 * @return {*}
 */
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

      'availabilities': 'availabilities',

      'availabilityEditorStateToggleable': 'availabilityEditorStateToggleable',

      'repeater': 'repeater',
      'tabs': 'tabs',
      'tab': 'tab',
      'modal': 'modal',
      'session-length': 'session-length',
      'v-image-selector': 'v-image-selector',
      'color-picker': 'color-picker',
      'switcher': 'switcher',
      'bool-switcher': 'bool-switcher',
      'selection-list': 'selection-list',
    },
    data () {
      return {
        isCreateConfirming: false,

        isSaving: false,

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
          name: null,
          description: null,
          timezone: 'UTC+0',
          imageId: null,
          imageSrc: null,
          color: null,
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
       * Service's image model.
       *
       * @since [*next-version*]
       */
      serviceImage: {
        get () {
          return {
            id: this.model.imageId,
            url: this.model.imageSrc,
          }
        },
        set (value) {
          this.model.imageId = value.id
          this.model.imageSrc = value.url
        }
      },

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
    mounted () {
      /*
       * Switch tab to the first on fields seed.
       */
      this.$on('seed', () => {
        this.activeTab = 0
      })
    },
    methods: {
      ...mapActions('services', {
        dispatchCreate: 'create',
        dispatchUpdate: 'update'
      }),

      /**
       * Save the service that is being edited.
       *
       * @since [*next-version*]
       *
       * @return {Promise<T>} The promise that holds server's response data.
       */
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
      'availabilities': 'availabilities',
      'session-length': 'session-length',
      'bool-switcher': 'bool-switcher',
      'selection-list': 'selection-list',
      'v-image-selector': 'v-image-selector',
      'color-picker': 'color-picker'
    }
  })
}