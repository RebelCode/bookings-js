import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export default function CfServiceAvailabilityEditor (AbstractEntityModalEditor, Vuex, moment) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return AbstractEntityModalEditor.extend({
    inject: {
      modalState: {
        from: 'availabilityEditorStateToggleable'
      },
      modal: 'modal',
      repeater: 'repeater',
      datepicker: 'datepicker',
      'selection-list': 'selection-list'
    },
    data () {
      return {
        model: {
          id: null,

          /**
           * @var {string|null}
           */
          fromDate: null,

          fromTime: null,
          toTime: null,

          isAllDay: false,

          repeats: 'never',
          repeatsEvery: 2,
          repeatsOn: [],

          repeatsEnds: 'afterWeeks',
          repeatsEndsWeeks: null,
          repeatsEndsDate: null,

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
        }),

        repeatsOnCollection: new FunctionalArrayCollection(() => {
          return this.repeatsOn
        }, (newValue) => {}, (item) => {
          return item.key
        })
      }
    },
    watch: {
      /**
       * Change default values when repeats changes.
       */
      'model.repeats': function (newValue) {
        this.model.repeatsEvery = 2

        switch (newValue) {
          case 'monthly':
            this.model.repeatsOn = [ 'dow' ]
            break
          default:
            this.model.repeatsOn = []
        }
      }
    },
    computed: {
      ...mapState('bookingOptions', {
        entityModel: state => state.serviceAvailabilityModel
      }),

      ...mapState({
        entities: state => state.app.events
      }),

      repeatingTitle () {
        switch (this.model.repeats) {
          case 'daily':
            return 'days'
          case 'weekly':
            return 'weeks'
          case 'monthly':
            return 'months'
          case 'yearly':
            return 'years'
          default:
            return 'nopes :)'
        }
      },

      repeatingDuration () {
        switch (this.model.repeats) {
          case 'daily':
            return 31
          case 'weekly':
            return 51
          case 'monthly':
            return 12
          case 'yearly':
            return 5
          default:
            return 31
        }
      },

      repeatsOn () {
        if (this.model.repeats !== 'weekly' && this.model.repeats !== 'monthly') {
          return []
        }

        let repeatsOptions = {
          weekly: {
            mon: 'M',
            tue: 'T',
            wed: 'W',
            thu: 'T',
            fri: 'F',
            sat: 'S',
            sun: 'S',
          },
          monthly: {
            dom: 'Day of the month',
            dow: 'Day of the week',
          }
        }

        let makeKeyValueArray = (obj) => {
          return Object.keys(obj).map((key) => {
            return {
              key,
              value: obj[key]
            }
          })
        }

        return makeKeyValueArray(repeatsOptions[this.model.repeats])
      }
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
      datepicker: 'datepicker',
      'selection-list': 'selection-list'
    }
  })
}