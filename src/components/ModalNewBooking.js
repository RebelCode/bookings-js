import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export default function CfModalNewBooking (Vue, Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return {
    inject: ['modalStateToggleable', 'modal', 'repeater', 'datepicker'],
    data () {
      return {
        repeats: 'weekly',

        exclusionsPickerVisible: false,
        excludedPlaceholder: null,
        excludes: {
          dates: []
        },

        excludesDatesCollection: new FunctionalArrayCollection(() => {
          return this.excludes.dates
        }, (newDates) => {
          this.excludes.dates = newDates
        }, (date) => {
          return date.toDateString()
        })
      }
    },
    computed: {
      ...mapState('bookingOptions', [
        'serviceAvailabilityModel'
      ]),

      fromDate: {
        get () {
          return this.serviceAvailabilityModel.fromDate
        },

        set (newDate) {
          this.setAvailabilityFromDate(newDate)
        }
      },

      modalState () {
        return this.modalStateToggleable
      }
    },
    methods: {
      ...mapMutations('bookingOptions', [
        'setAvailabilityFromDate'
      ]),

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

      saveNewBooking () {
        // booking saving logic
      }
    },
    components: {
      repeater: 'repeater',
      modal: 'modal',
      datepicker: 'datepicker'
    }
  }
}