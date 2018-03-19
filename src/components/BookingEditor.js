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
        isCreateConfirming: true,

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

          newStatus: '',
        },

        /**
         * Actions that can be taken with given booking. Action is transition to another status.
         *
         * @see: https://aventura.atlassian.net/wiki/spaces/EDDBK/pages/59751681/Status+Terms
         */
        actionsMap: {
          'in-cart': ['pending'],
          'draft': ['pending'],
          'pending': ['approved', 'cancelled'],
          'approved': ['scheduled'],
          'scheduled': ['draft', 'pending', 'cancelled'],
          'cancelled': ['in-cart', 'draft', 'pending', 'approved', 'scheduled'],
          'completed': ['in-cart', 'draft', 'pending', 'approved', 'scheduled'],
        }
      }
    },

    computed: {
      ...mapState('bookings', {
        entityModel: state => state.bookingModel,
        services: state => state.services,
      }),

      /**
       * Get available actions for current booking status.
       * Action is transition to another status.
       *
       * @see https://aventura.atlassian.net/wiki/spaces/EDDBK/pages/59751681/Status+Terms
       *
       * @return {array}
       */
      availableActions () {
        if (!this.model.id) return []
        return this.actionsMap[this.model.status] || []
      },

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
       * @return {string|null}
       */
      statusTitle () {
        if (!this.model.status) {
          return null
        }
        return this.model.status.charAt(0).toUpperCase() + this.model.status.slice(1)
      }
    },

    methods: {
      /**
       * Save *new* booking with given status. It will show
       * confirmation dialog with asking user to confirm saving
       * booking with status.
       *
       * @param {string} newStatus Status for newly created booking.
       */
      saveNewBooking (newStatus) {
        this.model.newStatus = newStatus
        this.isCreateConfirming = true
      },

      /**
       * Confirm booking creation and close modal.
       */
      confirmBookingCreation () {
        this.isCreateConfirming = false
        this.saveBooking()
      },

      /**
       * Save booking.
       */
      saveBooking () {
        let model = Object.assign({}, this.model)

        if (model['newStatus']) {
          model.status = model['newStatus']
          delete model['newStatus']
        }

        /*
         * @todo: interact with backend instead of simple insert to vuex store.
         */
        this.saveItem(model)

        this.forceCloseModal()
      },

      /**
       * Format time in given offset for displaying universal
       * and client's times.
       *
       * @param time
       * @param offset
       */
      format (time, offset = 0) {
        const currentOffset = moment().utcOffset() / 60
        return moment(time).utcOffset(currentOffset + Number(offset)).format('DD/MM/YY HH:mm')
      },

      /**
       * Possible handler for typing in any vue-select field.
       * Used for async getting results while typing in the field.
       * For example, for clients search
       *
       * @param term
       *
       * @todo: implement async client/services search
       */
      onSearch (term) {
        // this.servicesApi.search(term).then(...)
      },

      /**
       * Check booking can be saved with given status
       *
       * @param newStatus
       * @return {boolean}
       */
      bookingCanBe (newStatus) {
        return this.availableActions.indexOf(newStatus) > -1
      }
    },

    components: {
      modal: 'modal',
      vueselect: 'vueselect',
      'datetime-picker': 'datetime-picker'
    }
  })
}