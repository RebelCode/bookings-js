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
      })
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