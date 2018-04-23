export default function CfBookingEditor (AbstractEntityModalEditor, {mapState, mapMutations, mapActions}, moment, debounce) {
  return AbstractEntityModalEditor.extend({
    inject: {
      'clientsApi': 'clientsApi',
      'bookingsApi': 'bookingsApi',

      'helpers': {
        from: 'bookingHelpers'
      },

      'humanizeDuration': 'humanizeDuration',
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
      entitiesCollection: {
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
        isCreateConfirming: false,

        isBookingSaving: false,

        isClientsLoading: false,
        isCreatingClient: false,
        isSavingClient: false,

        isDeleting: false,

        model: {
          id: null,

          client: null,
          service: null,

          start: null,
          end: null,

          status: null,

          paymentNumber: null,

          clientTimezone: 0,
          note: null,

          newStatus: '',
        },

        newClient: {
          name: '',
          email: ''
        },

        foundClients: [],

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

      statusStyle () {
        return this.helpers.statusStyle(this.model.status)
      },

      /**
       * Get human readable duration of booking with minutes
       * precision:
       *
       * 4 weeks, 4 days, 7 hours and 55 minutes.
       *
       * @return {string|null}
       */
      duration () {
        if (!this.model.start || !this.model.end) return null

        const diffInMilliseconds = Math.abs(moment(this.model.end).diff(moment(this.model.start), 'minutes')) * 60 * 1000

        if (!diffInMilliseconds) {
          return null
        }

        return this.humanizeDuration(diffInMilliseconds, {
          conjunction: ' and ',
          serialComma: false,
          units: ['y', 'w', 'd', 'h', 'm'],
          round: true
        })
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
      ...mapActions('bookings', [
        'saveBookingOnBackend',
      ]),

      /**
       * Close all confirmation dialogs.
       */
      closeAllConfirmation () {
        /**
         * Set default confirmation state
         *
         * @type {boolean}
         */
        this.removeConfirming = false
        this.closeConfirming = false
        this.cancelConfirming = false

        this.isCreateConfirming = false
        this.isCreatingClient = false
      },

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
        this.$validator.validateAll().then((result) => {
          if (!result) {
            this.isCreateConfirming = false
            return;
          }
          this.saveBooking().then(() => {
            this.isCreateConfirming = false
          })
        })
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

        this.isBookingSaving = true

        return this.saveBookingOnBackend({api: this.bookingsApi, model}).then(() => {
          this.$emit('updated')
          this.forceCloseModal()
          this.isBookingSaving = false
        })
      },

      confirmBookingDeletion () {
        this.isDeleting = false
        this.removeConfirming = true
      },

      deleteBooking () {
        this.isDeleting = true
        this.$emit('delete', Object.assign({}, this.model))
      },

      /**
       * Format time in given offset for displaying universal
       * and client's times.
       *
       * @param time
       * @param offset
       */
      format (time, offset = 0) {
        return moment(time).utcOffset(Number(offset)).format('DD/MM/YY HH:mm')
      },

      /**
       * Search clients on the server.
       *
       * @param {String} search      Current search text
       * @param {Function} loading   Toggle loading class
       */
      onClientSearch (search, loading) {
        this.isClientsLoading = true
        loading(true)
        this._searchClients(loading, search, this);
      },

      _searchClients: debounce((loading, search, vm) => {
        vm.clientsApi.fetch({search}).then((response) => {
          vm.foundClients = response.data
          vm.isClientsLoading = false
          loading(false)
        })
      }, 350),

      /**
       * Show client creation form.
       */
      createClient () {
        this.newClient = {
          name: '',
          email: ''
        }
        this.isCreatingClient = true
      },

      /**
       * Start value is changed
       */
      startChanged () {
        if (this.model.end) {
          this.$validator.validateAll({
            end: this.model.end
          })
        }
        this.errors.remove('start')
      },

      /**
       * Close client creation form.
       */
      cancelClientCreation () {
        this.errors.clear('client-editor')
        this.isCreatingClient = false
      },

      /**
       * Store new client on the backend.
       */
      saveNewClient () {
        this.$validator.validateAll('client-editor').then((result) => {
          if (!result) {
            return
          }
          this.isSavingClient = true
          this.clientsApi.create(this.newClient).then((response) => {
            this.model.client = response.data
            this.isSavingClient = false
            this.isCreatingClient = false
          })
        })

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