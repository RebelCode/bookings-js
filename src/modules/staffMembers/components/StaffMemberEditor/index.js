import template from './template.html'
import ValidationResult from '../../../../libs/validation/ValidationResult'

/**
 * The staff member modal editor.
 *
 * @param AbstractEntityModalEditor
 * @param mapState
 * @param mapMutations
 * @param mapActions
 *
 * @return {*}
 */
export function CfStaffMemberEditor (AbstractEntityModalEditor, { mapState, mapMutations, mapActions }) {
  return AbstractEntityModalEditor.extend({
    ...template,
    inject: {
      /**
       * Modal state injected from the container.
       *
       * @var {FunctionalToggleable}
       */
      modalState: {
        from: 'staffMemberEditorState'
      },

      'api': {
        from: 'staffMembersApi'
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

      'sessionEditorState': 'sessionEditorState',

      /**
       * API Errors Handler factory function.
       *
       * @since [*next-version*]
       *
       * @var {Function}
       */
      'apiErrorHandlerFactory': 'apiErrorHandlerFactory',

      'tabs': 'tabs',
      'tab': 'tab',
      'modal': 'modal',
      'config': 'config',
      'v-image-selector': 'v-image-selector',
    },
    data () {
      return {
        errorMessage: null,

        isCreateConfirming: false,

        isSaving: false,

        activeTab: 0,

        tabsConfig: {
          switcherClass: 'horizontal-tabs',
          switcherItemClass: 'horizontal-tabs__item',
          switcherActiveItemClass: '_active',
          tabsClass: 'tabs-content'
        },

        rules: [{
          field: 'name',
          rule: 'required'
        }],

        /**
         * @since [*next-version*]
         *
         * @property {ValidationResult|null} lastComplexSetupValidationResult The last result of complex setup validation.
         */
        lastComplexSetupValidationResult: null,

        lastValidationResult: new ValidationResult(),

        model: {
          id: null,
          name: '',
          image_id: null,
          image_url: null,
          availability: {
            rules: []
          }
        },

        /**
         * @since [*next-version*]
         *
         * @property {ApiErrorHandler} staffMembersApiErrorHandler Handles error responses for the staff members API.
         */
        staffMembersApiErrorHandler: this.apiErrorHandlerFactory((error) => {
          this.setSaving(false)
          this.errorMessage = error
        }),
      }
    },
    computed: {
      ...mapState('staffMembers', {
        entityModel: 'one',
        entitiesCollection: 'list'
      }),

      /**
       * Staff member's image model.
       *
       * @since [*next-version*]
       */
      staffMemberImage: {
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
    },
    watch: {
      model: {
        deep: true,
        handler () {
          this.errorMessage = null
        }
      },
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
      ...mapActions('staffMembers', {
        dispatchCreate: 'create',
        dispatchUpdate: 'update'
      }),

      /**
       * Save the staff member that is being edited.
       *
       * @since [*next-version*]
       *
       * @return {Promise<T>} The promise that holds server's response data.
       */
      save () {
        const validator = this.validatorFactory.make(this.rules)
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

          this.setSaving(true)
          const model = Object.assign({}, this.model)

          return this[dispatchSaveMethod]({api: this.api, model}).then(() => {
            this.setSaving(false)
            this.$emit('saved')
            this.forceCloseModal()
          })
        }).catch(error => this.staffMembersApiErrorHandler.handle(error))
      },

      /**
       * Set saving indicator.
       *
       * @since [*next-version*]
       *
       * @param {string|boolean} status Status name or `false` to set all indicators to false.
       * @param {boolean} value Saving indicator for status.
       */
      setSaving (value) {
        this.isSaving = value
      }
    },
    components: {
      tabs: 'tabs',
      tab: 'tab',
      modal: 'modal',
      'availabilities': 'availabilities',
      'v-image-selector': 'v-image-selector',
    }
  })
}