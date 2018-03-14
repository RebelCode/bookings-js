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
        from: 'availabilitiesCollection'
      },

      modal: 'modal',
      repeater: 'repeater',

      datepicker: 'datepicker',
      vueselect: 'vueselect',
    },

    data () {
      return {
        selectValue: 'Root Canal Treatment',
        selectValuePerson: 'Jean Mark Mac Gloinn',
        isCreatingClient: false,
        model: {
          id: null,
        }
      }
    },

    methods: {
      onServiceSearch (term) {
        this.servicesApi
          .search(term)
          .then()
      }
    },

    computed: {
      ...mapState('bookings', {
        entityModel: state => state.bookingModel
      }),
    },

    components: {
      modal: 'modal',
      vueselect: 'vueselect',
    }
  })
}