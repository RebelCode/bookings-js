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

          clientTime: null,
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
    }
  })
}