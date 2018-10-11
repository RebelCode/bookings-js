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
        good: true
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
        return this.getDurationPreview(service.sessionLengths) + ' · ' + this.getPricePreview(service.sessionLengths)
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
      }
    },
    components: {
      'v-switch': 'v-switch',
    },
  }
}
