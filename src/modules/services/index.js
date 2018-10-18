export { default as store } from './store'

/**
 * Component for the services page.
 *
 * @since [*next-version*]
 *
 * @return {object} Services page component.
 */
export function page (store, { mapActions, mapMutations }, mapStore) {
  return {
    store,
    inject: {
      'services': 'services',

      'api': {
        from: 'servicesApi'
      },

      '_': {
        from: 'translate'
      },

      'config': 'config',

      /**
       * Modal state injected from elsewhere.
       *
       * @var {FunctionalToggleable}
       */
      modalState: {
        from: 'serviceEditorState'
      },

      'service-editor': 'service-editor',

      'service-availability-editor': 'service-availability-editor',
    },
    components: {
      'services': 'services',
      'service-editor': 'service-editor',
      'service-availability-editor': 'service-availability-editor',
    },
    data () {
      return {
        search: ''
      }
    },
    computed: {
      ...mapStore('services', [
        'list',
        'isLoadingList'
      ])
    },
    created () {
      this.fetchServices()
    },
    methods: {
      ...mapMutations('services', [
        'setServiceEditorState'
      ]),

      ...mapActions('services', {
        dispatchUpdate: 'update',
        dispatchDelete: 'delete',
        dispatchFetch: 'fetch'
      }),

      /**
       * Open service's modal.
       *
       * @since [*next-version*]
       *
       * @param {service} service The service that is being edited.
       */
      openServiceEditor (service = {}) {
        this.modalState.setState(true)
        this.setServiceEditorState(service)
      },

      /**
       *
       */
      deleteService (model) {
        if (!confirm(this._('Are you sure you want to delete this service?'))) {
          return
        }
        this.$set(model, 'isSaving', true)
        this.dispatchDelete({ api: this.api, model }).then(() => {
          this.$set(model, 'isSaving', false)
          this.fetchServices()
        })
      },

      /**
       * Fetch the services list.
       *
       * @since [*next-version*]
       */
      fetchServices () {
        this.isLoadingList = true
        this.dispatchFetch({
          api: this.api,
          params: this.buildParams(),
          transformOptions: { timezone: this.config.timezone }
        }).then(() => {
          this.isLoadingList = false
        })
      },

      /**
       *
       */
      saveService (model) {
        this.$set(model, 'isSaving', true)
        this.dispatchUpdate({ api: this.api, model }).then(() => {
          this.$set(model, 'isSaving', false)
        })
      },

      /**
       * Get params for fetching the list of services.
       *
       * @since [*next-version*]
       *
       * @return {object}
       */
      buildParams () {
        const params = {}
        if (this.search) {
          params['s'] = this.search
        }
        return params
      }
    }
  }
}