import template from './template.html'

export default function (mapStore) {
  return {
    ...template,
    inject: {
      'v-switch': 'v-switch',
      'humanizeDuration': 'humanizeDuration'
    },
    computed: {
      ...mapStore('services', [
        'list',
        'isLoadingList'
      ])
    },
    data () {
      return {
        statusesTransitionMap: {
          publish: 'draft',
          draft: 'publish'
        }
      }
    },
    methods: {
      /**
       * Get the preview of available session lengths of the service.
       *
       * @since [*next-version*]
       *
       * @param {Service} service The service to retrieve the preview for.
       *
       * @return {string}
       */
      getSessionsPreview (service) {
        return this.getDurationPreview(service.sessionLengthsStored) + ' · ' + this.getPricePreview(service.sessionLengthsStored)
      },

      getDurationPreview (sessions) {
        if (sessions.length === 1) {
          return this.humanizeDuration(sessions[0].sessionLength * 1000)
        }
        const last = sessions.length - 1
        return this.humanizeDuration(sessions[0].sessionLength * 1000) + ' - ' + this.humanizeDuration(sessions[last].sessionLength * 1000)
      },

      getPricePreview (sessions) {
        if (sessions.length === 1) {
          return sessions[0].price.formatted.replace('.00', '')
        }
        const last = sessions.length - 1
        return sessions[0].price.formatted.replace('.00', '') + ' - ' + sessions[last].price.formatted.replace('.00', '')
      },

      switchServiceStatus (service) {
        service.status = this.statusesTransitionMap[service.status]
        this.$emit('save', service)
      }
    },
    components: {
      'v-switch': 'v-switch',
    },
  }
}
