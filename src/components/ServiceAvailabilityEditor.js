import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export default function CfServiceAvailabilityEditor (AbstractEntityModalEditor, Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return AbstractEntityModalEditor.extend({
    inject: {
      modalState: {
        from: 'availabilityEditorStateToggleable'
      },
      modal: 'modal',
      repeater: 'repeater',
      datepicker: 'datepicker'
    },
    data () {
      return {
        model: {
          id: null,
          fromDate: null,
          repeats: 'never',
          excludes: {
            dates: []
          }
        },

        exclusionsPickerVisible: false,

        excludesDatesCollection: new FunctionalArrayCollection(() => {
          return this.model.excludes.dates
        }, (newDates) => {
          this.model.excludes.dates = newDates
        }, (date) => {
          return date.toDateString()
        })
      }
    },
    computed: {
      ...mapState('bookingOptions', {
        entityModel: state => state.serviceAvailabilityModel
      }),

      ...mapState({
        entities: state => state.app.events
      })
    },
    methods: {
      ...mapMutations({
        setNewEntities: 'setNewEvents'
      }),

      _getExclusionItemTitle (date) {
        return date.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
      },

      excludeDateSelected (date) {
        if (this.excludesDatesCollection.hasItem(date)) {
          this.excludesDatesCollection.removeItem(date)
        }
        else {
          this.excludesDatesCollection.addItem(date)
        }
        this.$refs.exclusions.selectedDate = null
      },

      saveAvailability () {
        // save availability
      }
    },
    components: {
      repeater: 'repeater',
      modal: 'modal',
      datepicker: 'datepicker'
    }
  })
}