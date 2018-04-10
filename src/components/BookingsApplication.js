import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export function CfBookingsApplication(state, store, { mapState, mapMutations, mapActions }) {
  return {
    store,
    inject: {
      'selection-list': 'selection-list',
      'bookings-calendar-view': 'bookings-calendar-view',
      'bookings-list-view': 'bookings-list-view',
      'booking-editor': 'booking-editor',
      'tabs': 'tabs',
      'tab': 'tab',

      'api': {
        from: 'bookingsApi'
      },
      /**
       * Modal state injected from elsewhere.
       *
       * @var {FunctionalToggleable}
       */
      modalState: {
        from: 'bookingEditorState'
      },
    },
    data () {
      return {
        activeView: 0,

        tabsConfig: {
          switcherItemClass: 'fc-button fc-state-default tab-item',
          switcherActiveItemClass: 'fc-state-active',
          switcherClass: 'fc-button-group'
        },
        
        selectedStatuses: [],

        statuses: [
          {
            key: 'in-cart',
            value: 'In Cart'
          }, {
            key: 'approved',
            value: 'Approved'
          }, {
            key: 'completed',
            value: 'Completed'
          }, {
            key: 'scheduled',
            value: 'Scheduled'
          }, {
            key: 'pending',
            value: 'Pending'
          }, {
            key: 'draft',
            value: 'Draft'
          }, {
            key: 'cancelled',
            value: 'Cancelled'
          }
        ],

        statusesCollection: new FunctionalArrayCollection(() => {
          return this.statuses
        }, (newValue) => {}, (item) => {
          return item.key
        })
      }
    },
    computed: {
      ...mapState({
        screenStatuses: state => state.app.screenStatuses,
      }),
      ...mapState('ui', {
        isLoading: state => state.bookings.isLoading,
        viewFilter: state => state.bookings.viewFilter,
      }),
    },
    mounted () {
      if (!state) {
        throw new Error('App state not initialized')
      }

      /*
       * @todo: seed store outside of mounted!
       */
      if (state.services) {
        const services = state.services.slice()
        delete state.services

        this.setInitialState(state)
        this.setServices(services)
      }

      this.selectedStatuses = this.screenStatuses.slice()
    },
    methods: {
      ...mapMutations([
        'setInitialState'
      ]),

      ...mapMutations('bookings', [
        'setServices',
        'setBookingEditorState',
        'setBookings',
        'setBookingsCount'
      ]),

      ...mapMutations('ui', [
        'setBookingsViewFilter',
        'setBookingsIsLoading',
      ]),

      ...mapActions('bookings', [
        'fetchBookings',
        'deleteBookingFromBackend'
      ]),

      clearBookings () {
        this.setBookings([])
        this.setBookingsCount(0)
      },

      setScreenStatuses (statuses) {
        this.$store.commit('setScreenStatuses', statuses)
        this.fetch()
      },

      fetch (params = false) {
        if (params) {
          this.setBookingsViewFilter(Object.assign({}, params))
        }
        params = Object.assign({}, this.viewFilter)
        params['statuses'] = this.screenStatuses
        this.setBookingsIsLoading(true)
        this.fetchBookings({ api: this.api, params }).then(() => {
          this.setBookingsIsLoading(false)
        })
      },

      createBooking () {
        this._openBookingEditor()
      },

      /**
       * Open booking for editing.
       *
       * @param booking
       */
      editBooking (booking) {
        this._openBookingEditor(booking)
      },

      /**
       * Open booking for editing.
       *
       * @param booking
       */
      deleteBooking (booking, askConfirmation = true) {
        if (askConfirmation) {
          if (confirm('Are you sure you want to delete this booking? There is no undo option.')) {
            this._deleteBooking(booking)
          }
        }
        else {
          this._deleteBooking(booking)
        }
      },

      _deleteBooking(model) {
        this.deleteBookingFromBackend({ api: this.api, model }).then(() => {
          this._closeBookingEditor()
          this.fetch()
        })
      },

      _openBookingEditor (booking = {}) {
        this.modalState.setState(true)
        this.setBookingEditorState(booking)
      },

      _closeBookingEditor () {
        this.modalState.setState(false)
        this.setBookingEditorState({})
      },
    },
    components: {
      'booking-editor' : 'booking-editor',
      'bookings-calendar-view' : 'bookings-calendar-view',
      'bookings-list-view' : 'bookings-list-view',
      'tabs': 'tabs',
      'tab': 'tab',
      'selection-list': 'selection-list',
    }
  }
}
