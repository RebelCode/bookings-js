import template from './template.html'
import ValidationResult from '../../../../libs/validation/ValidationResult'

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

      'validatorFactory': 'validatorFactory',

      'availabilityEditorStateToggleable': 'availabilityEditorStateToggleable',

      /**
       * API Errors Handler factory function.
       *
       * @since [*next-version*]
       *
       * @var {Function}
       */
      'apiErrorHandlerFactory': 'apiErrorHandlerFactory',

      'repeater': 'repeater',
      'tabs': 'tabs',
      'tab': 'tab',
      'modal': 'modal',
      'session-length': 'session-length',
      'v-image-selector': 'v-image-selector',
      'color-picker': 'color-picker',
      'switcher': 'switcher',
      'bool-switcher': 'bool-switcher',
      'timezone-select': 'timezone-select',
      'selection-list': 'selection-list',
    },
    data () {
      return {
        errorMessage: null,

        isCreateConfirming: false,

        isSavingDraft: false,
        isSavingPublished: false,

        activeTab: 0,

        tabsConfig: {
          switcherClass: 'horizontal-tabs',
          switcherItemClass: 'horizontal-tabs__item',
          switcherActiveItemClass: '_active',
          tabsClass: 'tabs-content'
        },

        helpTabsMap: {
          // availability tab
          2: {
            link: 'https://docs.eddbookings.com/article/345-how-to-add-a-new-service-the-availability-calendar-explained',
            title: 'Learn more about availability rules'
          }
        },

        rules: {
          draft: [{
            field: 'name',
            rule: 'required'
          }],
          publish: [{
            field: 'name',
            rule: 'required'
          }, {
            field: 'availability.rules.length',
            rule: 'min_value',
            value: 1
          }, {
            field: 'sessionLengths.length',
            rule: 'min_value',
            value: 1
          }]
        },

        /**
         * @since [*next-version*]
         *
         * @property {ValidationResult|null} lastComplexSetupValidationResult The last result of complex setup validation.
         */
        lastComplexSetupValidationResult: null,

        lastValidationResult: new ValidationResult(),

        model: {
          id: null,
          name: null,
          status: 'draft',
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
        },

        /**
         * @since [*next-version*]
         *
         * @property {ApiErrorHandler} servicesApiErrorHandler Handles error responses for the services API.
         */
        servicesApiErrorHandler: this.apiErrorHandlerFactory((error) => {
          this.setSaving(false)
          this.errorMessage = error
        }),
      }
    },
    computed: {
      ...mapState('services', {
        entityModel: 'one',
        entitiesCollection: 'list'
      }),

      /**
       * Link to the docs.
       *
       * @since [*next-version*]
       *
       * @return {object}
       */
      helpLink () {
        if (this.errorMessage || !this.lastValidationResult.valid || !this.helpTabsMap[this.activeTab]) {
          return false
        }
        return this.helpTabsMap[this.activeTab]
      },

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
          this.errorMessage = null
          this.complexSetupValidator.validate(this).then(validationResult => {
            this.lastComplexSetupValidationResult = validationResult
          })
        }
      },

      /**
       * Watch for changes of 'model.sessionLengths' field and remove errors if the field is changed.
       *
       * @since [*next-version*]
       */
      'model.sessionLengths': {
        deep: true,
        handler () {
          this.lastValidationResult.removeErrors('sessionLengths.length')
        },
      },

      /**
       * Watch for changes of 'model.availability.rules' field and remove errors if the field is changed.
       *
       * @since [*next-version*]
       */
      'model.availability.rules': {
        deep: true,
        handler () {
          this.lastValidationResult.removeErrors('availability.rules.length')
        },
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

      saveDraft () {
        return this.save({
          status: 'draft'
        })
      },

      /**
       * Save the service that is being edited.
       *
       * @since [*next-version*]
       *
       * @return {Promise<T>} The promise that holds server's response data.
       */
      save (statusInfo = {status: 'publish'}) {
        const validator = this.validatorFactory.make(this.rules[statusInfo.status])
        return validator.validate(this.model).then(result => {
          this.lastValidationResult = result
          if (this.lastValidationResult.valid) {
            return true
          }
        }).then(isValid => {
          if (!isValid) {
            return
          }
          const dispatchSaveMethod = this.model.id ? 'dispatchUpdate' : 'dispatchCreate'

          this.setSaving(statusInfo.status, true)
          const model = Object.assign({}, this.model, statusInfo)

          return this[dispatchSaveMethod]({api: this.api, model}).then(() => {
            this.setSaving(false)
            this.$emit('saved')
            this.forceCloseModal()
          })
        }).catch(error => this.servicesApiErrorHandler.handle(error))
      },

      /**
       * Set saving indicator.
       *
       * @since [*next-version*]
       *
       * @param {string|boolean} status Status name or `false` to set all indicators to false.
       * @param {boolean} value Saving indicator for status.
       */
      setSaving (status, value = true) {
        if (!status) {
          this.isSavingDraft = false
          this.isSavingPublished = false

          return
        }

        const statusMap = {
          draft: 'isSavingDraft',
          publish: 'isSavingPublished',
        }

        this[statusMap[status]] = value
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
      'timezone-select': 'timezone-select',
      'selection-list': 'selection-list',
      'v-image-selector': 'v-image-selector',
      'color-picker': 'color-picker'
    }
  })
}