export default function CfBookingEditor (AbstractEntityModalEditor, {mapState, mapMutations, mapActions}, moment, debounce) {
  return AbstractEntityModalEditor.extend({
    inject: {
      'clientsApi': 'clientsApi',
      'bookingsApi': 'bookingsApi',

      'config': 'config',
      'state': 'state',

      'bookingTransformer': 'bookingTransformer',

      'momentHelpers': 'momentHelpers',
      'helpers': {
        from: 'bookingHelpers'
      },

      /**
       * Function for text formatting, it will replace placeholders to given values.
       *
       * @var {Function}
       */
      'formatter': {
        from: 'textFormatter'
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

      'datetime-picker': 'datetime-picker',
      'timezone-select': 'timezone-select',
      'service-session-selector': 'service-session-selector',
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

          payment: null,

          clientTzName: 'UTC+0',
          notes: null,

          transition: '',
        },

        /**
         * Transition name for applying when booking is created.
         *
         * @property {string}
         */
        createTransition: false,

        errorMessage: false,

        newClient: {
          name: '',
          email: ''
        },

        /**
         * @property {object[]} List of clients found by search for autocomplete.
         */
        foundClients: []
      }
    },

    watch: {
      model: {
        deep: true,
        handler (value) {
          this.errorMessage = false
        }
      }
    },

    /**
     * Created component hook. 
     * Populates client timezone select with default website timezone.
     * 
     * @since [*next-version*]
     */
    created () {
      this.seedLock = true
      if (this.config.timezone) {
        this.model.clientTzName = this.config.timezone
      }
      this.seedLock = false
    },

    computed: {
      ...mapState('bookings', {
        entityModel: state => state.bookingModel,
        services: state => state.services,
      }),

      /**
       * CSS rules for styling booking status "pill" in editor.
       *
       * @return {object}
       */
      statusStyle () {
        return this.helpers.statusStyle(this.model.status)
      },

      /**
       * Map of status keys to map of transitions to status keys.
       * It will give ability to show only allowed transitions for
       * editing booking.
       *
       * @return {object}
       */
      transitionsMap () {
        return this.state.statusTransitions
      },

      /**
       * Map of transition keys to translated transitions labels.
       *
       * @return {object}
       */
      transitionsLabels () {
        return this.state.transitionsLabels
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
        return this.helpers.statusLabel(this.model.status)
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

        this.createTransition = false
      },

      /**
       * Save *new* booking with given status. It will show
       * confirmation dialog with asking user to confirm saving
       * booking with status.
       *
       * @param {string|boolean} createTransition Status for newly created booking.
       */
      saveNewBooking (createTransition = false) {
        this.createTransition = createTransition
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
        let model = this.bookingTransformer.transform(Object.assign({}, this.model))
        // @todo: fix this
        if (!model.id) {
          model['transition'] = 'draft'
        }

        this.isBookingSaving = true

        const savingError = (error) => {
          const errorResponse = error.response
          if (!errorResponse) {
            return
          }
          if (errorResponse.data.data && errorResponse.data.data.errors) {
            this.errorMessage = errorResponse.data.data.errors[0]
          }
        }

        return this.saveBookingOnBackend({api: this.bookingsApi, model}).then((response) => {
          return response
        }, savingError).then((response) => {
          if (!this.model.id && this.createTransition) {
            return this.applyTransition(response, this.createTransition)
          }
          return response
        }, savingError).then(() => {
          this.$emit('updated')
          this.forceCloseModal()
        }, savingError).finally(() => {
          this.isBookingSaving = false
        })
      },

      /**
       * Apply this transition when new booking is created.
       *
       * @param {object} response
       * @param {string} transition Transition to apply.
       * @return {*}
       */
      applyTransition (response, transition) {
        const model = {
          id: response.data.id,
          transition
        }
        return this.saveBookingOnBackend({
          api: this.bookingsApi, model
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
       * @param {any} time Time in any format moment can accept.
       * @param {string} timezone Timezone name
       * 
       * @return {string} Formatted string
       */
      format (time, timezone = 'UTC+0') {
        if (!time) return

        const serviceTimezone = !!this.model.service ? this.model.service.timezone : this.config.timezone
        const timeInServiceTimezone = this.momentHelpers.createInTimezone(time, serviceTimezone)

        return this.momentHelpers.switchToTimezone(timeInServiceTimezone.format(), timezone).format('DD/MM/YY HH:mm')
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
          vm.foundClients = response.data.items
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
        this.$nextTick(() => {
          if (this.model.end) {
            this.$validator.validate('end')
          }
        })
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
       * Check that given transition can be applied to current booking.
       *
       * @param {string} transition Transition to check
       *
       * @return {boolean}
       */
      canDoTransition (transition) {
        const status = this.model.status || 'none'
        const availableTransitions = this.transitionsMap[status]
        if (!availableTransitions) {
          return false
        }
        return !!availableTransitions[transition]
      }
    },

    components: {
      modal: 'modal',
      vueselect: 'vueselect',
      'datetime-picker': 'datetime-picker',
      'timezone-select': 'timezone-select',
      'service-session-selector': 'service-session-selector'
    }
  })
}