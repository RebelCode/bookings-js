import template from './template.html'

export default function ({ mapMutations }, dateFormats) {
  return {
    ...template,
    inject: {
      '_': {
        from: 'translate'
      },
      'moment': 'moment',
      'config': 'config',
      'availabilityEditorStateToggleable': 'availabilityEditorStateToggleable',
      'availability-calendar': 'availability-calendar',
      'service-availability-editor': 'service-availability-editor',
      'timezone-select': 'timezone-select',
    },
    data () {
      return {
        isTransitioning: false,
        overlappingAvailabilities: false,
      }
    },
    props: {
      value: {},
      timezone: {}
    },
    computed: {
      valueProxy: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      timezoneProxy: {
        get () {
          return this.timezone
        },
        set (value) {
          this.$emit('update:timezone', value)
        }
      }
    },
    methods: {
      ...mapMutations('bookingOptions', [
        'setAvailabilityEditorState'
      ]),

      setTransitioning (type, value) {
        console.info({type})
        this.isTransitioning = value
      },

      addRule () {
        this.openAvailabilityEditor({
          start: this.moment().add(1, 'day').startOf('day'),
          end: this.moment().add(2, 'day').endOf('day'),
          allDay: true,
        })
      },

      editRule (availability) {
        this.openAvailabilityEditor(availability)
      },

      removeRule (availability) {
        if (!confirm(this._('Are you sure you want to delete this availability? There is no undo option.'))) {
          return
        }

      },

      /**
       * Open the availability editor with given availability.
       *
       * @since [*next-version*]
       *
       * @param {object} availability
       */
      openAvailabilityEditor (availability = {}) {
        this.setAvailabilityEditorState(availability)
        this.availabilityEditorStateToggleable.setState(true)
      },

      getInfo (availability) {
        return {
          timeRange: availability.isAllDay ? this._('All day') : this._('%s - %s', [
            this.moment(availability.start).format(this.config.formats.datetime.sessionTime),
            this.moment(availability.end).format(this.config.formats.datetime.sessionTime)
          ]),
          from: this._('From %s', [
            this.moment(availability.start).format('MMM D')
          ]),
          for: availability.repeatUntil === 'period' ? this._('for %s %s', [
            availability.repeatUntilPeriod,
            availability.repeatUnit,
          ]) : this._('till %s', [
            this.moment(availability.repeatUntilDate).format('MMM D')
          ]),
          repeatDescription: availability.repeat ? 'Mon - Fri' : null,
          frequency: availability.repeat ? this._('every %s %s', [
            availability.repeatPeriod,
            availability.repeatUnit
          ]) : null
        }
      }
    },
    components: {
      'availability-calendar': 'availability-calendar',
      'timezone-select': 'timezone-select',
      'service-availability-editor': 'service-availability-editor',
    }
  }
}
