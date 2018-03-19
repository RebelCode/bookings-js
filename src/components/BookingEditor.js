export default function CfBookingEditor (AbstractEntityModalEditor, Vuex, moment) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return AbstractEntityModalEditor.extend({
    inject: {
      /**
       * Modal state injected from elsewhere.
       *
       * @var {FunctionalToggleable}
       */
      modalState: {
        from: 'bookingEditorState'
      },

      /**
       * Editing entity items collection. Used to remove editing
       * items from it when user confirm deletion.
       *
       * @var {FunctionalArrayCollection}
       */
      itemsCollection: {
        from: 'bookingsCollection'
      },

      modal: 'modal',
      repeater: 'repeater',

      datepicker: 'datepicker',
      vueselect: 'vueselect',

      'datetime-picker': 'datetime-picker'
    },

    data () {
      return {
        isCreatingClient: false,

        model: {
          id: null,

          client: null,
          service: null,

          start: null,
          end: null,

          status: null,
          paymentNumber: null,

          clientTimezone: null,
          note: null,

          newStatus: null,
        },

        actionsMap: {
          'scheduled': ['draft', 'pending', 'cancelled'],
          'draft': ['pending', 'scheduled'],
          'pending': ['scheduled', 'draft', 'cancelled'],
          'cancelled': ['pending'],
          'completed': ['scheduled'],
        }
      }
    },

    computed: {
      ...mapState('bookings', {
        entityModel: state => state.bookingModel,
        services: state => state.services,
      }),

      /**
       * Get human readable duration of booking with minutes
       * precision: 2 hours 30 minutes
       *
       * @return {string|null}
       */
      duration () {
        if (!this.model.start || !this.model.end) return null

        const defaultMinutesThreshold = moment.relativeTimeThreshold('m')
        const defaultHoursThreshold = moment.relativeTimeThreshold('h')

        moment.relativeTimeThreshold('m', 60)
        moment.relativeTimeThreshold('h', 24)

        const diffInSeconds = Math.abs(moment(this.model.end).diff(moment(this.model.start), 'minutes')) * 60

        let result = ''

        if (Math.floor(diffInSeconds / 3600)) {
          result += moment.duration(diffInSeconds - (diffInSeconds % 3600), 'seconds').humanize()
        }
        if (Math.floor(diffInSeconds % 3600) && (Math.floor(diffInSeconds / 3600) <= 23)) {
          result += ' ' + moment.duration(Math.floor(diffInSeconds % 3600), 'seconds').humanize()
        }

        moment.relativeTimeThreshold('m', defaultMinutesThreshold)
        moment.relativeTimeThreshold('h', defaultHoursThreshold)

        return result
      },

      /**
       * Booking status title for displaying.
       *
       * @return {string}
       */
      statusTitle () {
        if (!this.model.status) {
          return
        }
        return this.model.status.charAt(0).toUpperCase() + this.model.status.slice(1)
      }
    },

    methods: {
      format (time, offset = 0) {
        const currentOffset = moment().utcOffset() / 60
        return moment(time).utcOffset(currentOffset + Number(offset)).format('DD/MM/YY HH:mm')
      },

      onServiceSearch (term) {
        this.servicesApi
          .search(term)
          .then()
      },

      bookingCanBe (newStatus) {
        if (!this.model.id) return false

        return this.actionsMap[this.model.status].indexOf(newStatus) > -1
      }
    },

    components: {
      modal: 'modal',
      vueselect: 'vueselect',
      'datetime-picker': 'datetime-picker'
    }
  })
}