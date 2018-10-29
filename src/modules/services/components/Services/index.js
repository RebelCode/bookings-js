import template from './template.html'

/**
 * The services list component.
 *
 * @since [*next-version*]
 *
 * @param mapStore
 *
 * @return {*}
 */
export default function (mapStore) {
  return {
    ...template,
    inject: {
      'v-switch': 'v-switch',
      'humanizeDuration': 'humanizeDuration',
      '_': {
        from: 'translate'
      }
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
    props: {
      isInitialFetchResults: {
        default: false
      },
    },
    methods: {
      /**
       * Get sessions duration preview.
       *
       * @since [*next-version*]
       *
       * @param {object[]} sessions List of available session lengths.
       */
      getDurationPreview (sessions) {
        if (sessions.length === 1) {
          return this.humanizeDuration(sessions[0].sessionLength * 1000)
        }
        const last = sessions.length - 1
        if (this.isSessionLengthUnitsAreSame(sessions[0].sessionLength, sessions[last].sessionLength)) {
          return this.humanizeDuration(sessions[0].sessionLength * 1000).split(' ')[0] + '-' + this.humanizeDuration(sessions[last].sessionLength * 1000)
        }
        return this.humanizeDuration(sessions[0].sessionLength * 1000) + ' - ' + this.humanizeDuration(sessions[last].sessionLength * 1000)
      },

      isSessionLengthUnitsAreSame (a, b) {
        const units = [
          60 * 60 * 24 * 30, // month
          60 * 60 * 24 * 7, // week
          60 * 60 * 24, // day
          60 * 60, // hour
          60, // minute
        ]
        const getUnit = sessionLength => {
          let result = false
          units.forEach((unit, i) => {
            if (Math.floor(sessionLength / unit) > 0) {
              result = i
              return
            }
          })
          return result
        }
        const aUnit = getUnit(a)
        const bUnit = getUnit(b)
        return aUnit !== false && bUnit !== false && aUnit === bUnit
      },

      /**
       * Get sessions price preview.
       *
       * @since [*next-version*]
       *
       * @param {object[]} sessions List of available session lengths.
       */
      getPricePreview (sessions) {
        if (sessions.length === 1) {
          return sessions[0].price.formatted.replace('.00', '')
        }
        const last = sessions.length - 1
        return sessions[0].price.formatted.replace('.00', '') + ' - ' + sessions[last].price.formatted.replace('.00', '')
      },

      /**
       * Switch service's status.
       *
       * @since [*next-version*]
       *
       * @param {object} service
       */
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
