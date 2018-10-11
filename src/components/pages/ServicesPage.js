/**
 * Component for the services page.
 *
 * @since [*next-version*]
 *
 * @return {object} Services page component.
 */
export default function (store, { mapActions }, mapStore) {
  return {
    store,
    inject: {
      'services': 'services',
      'api': {
        from: 'servicesApi'
      },
      '_': {
        from: 'translate'
      }
    },
    components: {
      'services': 'services'
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
      /**
       * Fetch the services list.
       *
       * @since [*next-version*]
       */
      fetchServices () {
        this.isLoadingList = true
        this.api.fetch(this.buildParams()).then(response => {
          this.list = response.data.items
        }).then(() => {
          this.isLoadingList = false
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
        return {}
      }
    }
  }
}