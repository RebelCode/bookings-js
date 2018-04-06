export function CfBookingsPage (store, { mapState, mapMutations }) {
  return {
    store,
    inject: {
      'bookings-calendar-view': 'bookings-calendar-view',
      'bookings-list-view': 'bookings-list-view',
      'booking-editor': 'booking-editor',
      'tabs': 'tabs',
      'tab': 'tab',

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
        }
      }
    },

    computed: {
      ...mapState({
        screenStatuses: state => state.app.screenStatuses
      }),
    },

    methods: {
      ...mapMutations('bookings', [
        'setBookingEditorState'
      ]),

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

      _openBookingEditor (booking = {}) {
        this.modalState.setState(true)
        this.setBookingEditorState(booking)
      },
    },

    components: {
      'booking-editor' : 'booking-editor',
      'bookings-calendar-view' : 'bookings-calendar-view',
      'bookings-list-view' : 'bookings-list-view',
      'tabs': 'tabs',
      'tab': 'tab',
    }
  }
}
