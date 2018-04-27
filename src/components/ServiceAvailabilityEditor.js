import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export default function CfServiceAvailabilityEditor (AbstractEntityModalEditor, { mapState, mapMutations }, moment) {
  const helpers = {
    /**
     * Create date object from string in format YYYY-MM-DD
     *
     * @param date
     * @return {Date}
     */
    getDate (date) {
      const parts = date.split("-");
      return new Date(parts[0], parts[1] - 1, parts[2])
    },

    /**
     * Make computed time model
     *
     * @param obj
     * @param key
     * @return {*}
     */
    makeTimeModel (key) {
      return {
        get () {
          if (!this.model[key]) {
            return {HH: null, mm: null}
          }
          let parts = this.model[key].split(':')
          return {HH: parts[0], mm: parts[1]}
        },

        set (value) {
          if (value.HH && value.mm) {
            this.model[key] = value.HH + ':' + value.mm + ':00'
          }
        }
      }
    },
  }

  return AbstractEntityModalEditor.extend({
    inject: {
      'momentHelpers': 'momentHelpers',
      'pluralize': 'pluralize',

      modalState: {
        from: 'availabilityEditorStateToggleable'
      },

      '_': {
        from: 'translate'
      },

      /**
       * Editing entity items collection. Used to remove editing
       * items from it when user confirm deletion.
       *
       * @var {FunctionalArrayCollection}
       */
      entitiesCollection: {
        from: 'availabilitiesCollection'
      },

      modal: 'modal',
      repeater: 'repeater',
      datepicker: 'datepicker',
      'time-picker': 'time-picker',

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

          repeatsEnds: 'afterPeriod',
          repeatsEndsPeriod: null,
          repeatsEndsDate: null,

          excludesDates: []
        },

        exclusionsPickerVisible: false,

        excludesDatesCollection: new FunctionalArrayCollection(() => {
          return this.model.excludesDates.sort()
        }, (newDates) => {
          this.model.excludesDates = newDates
        }, (date) => {
          return date
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
        if (this.seedLock) return

        this.model.repeatsEvery = 1

        switch (newValue) {
          case 'month':
            this.model.repeatsOn = [ 'dom' ]
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

      excludesDatesModels () {
        let dates = this.model.excludesDates.map((date) => {
          return helpers.getDate(date)
        })
        return { dates }
      },

      /**
       * Current day is used for disabling dates in start at datepicker up to this date.
       *
       * @return {Date}
       */
      currentDay () {
        let today = moment()
        today.set({
          hour: 0,
          minute: 0,
          second: 0,
        })
        return today.toDate()
      },

      /**
       * When availability starts, used for disabling dates in ends on datepicker up to start date.
       *
       * @return {Date}
       */
      availabilityStart () {
        return moment(this.model.fromDate).toDate()
      },

      fromTimeModel: helpers.makeTimeModel('fromTime'),
      toTimeModel: helpers.makeTimeModel('toTime'),

      repeatingTitle () {
        return this.pluralize(this._(this.model.repeats), Number(this.model.repeatsEvery))
      },

      repeatsEndsTitle () {
        return this.pluralize(this._(this.model.repeats), Number(this.model.repeatsEndsPeriod))
      },

      repeatingDuration () {
        switch (this.model.repeats) {
          case 'day':
            return 31
          case 'week':
            return 51
          case 'month':
            return 12
          case 'year':
            return 5
          default:
            return 31
        }
      },

      repeatsOn () {
        if (this.model.repeats !== 'week' && this.model.repeats !== 'month') {
          return []
        }

        let start = moment(this.model.fromDate)

        let repeatsOptions = {
          week: {
            mon: this._('M'),
            tue: this._('T'),
            wed: this._('W'),
            thu: this._('T'),
            fri: this._('F'),
            sat: 'S', // @todo: FIX IN ALPHA
            sun: 'S', // @todo: FIX IN ALPHA
          },
          month: {
            dom: start ? this._('Monthly on day %s', [start.format('D')]) : '',
            dow: start ? this._('Monthly on the %s %s', [this.momentHelpers.weekdayInMonthNumber(start), start.format('dddd')]) : '',
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
        setNewEntities: 'setNewAvailabilities'
      }),

      _getExclusionItemTitle (date) {
        return helpers.getDate(date).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
      },

      /**
       * Is entity can be updated or deleted.
       *
       * @return {bool}
       */
      entityCanBeModified () {
        return true
      },

      excludeDateSelected (date) {
        date = moment(date).format('YYYY-MM-DD')

        if (this.excludesDatesCollection.hasItem(date)) {
          this.excludesDatesCollection.removeItem(date)
        }
        else {
          this.excludesDatesCollection.addItem(date)
        }

        this.$refs.exclusions.selectedDate = null
      }
    },
    components: {
      repeater: 'repeater',
      modal: 'modal',
      datepicker: 'datepicker',
      'time-picker': 'time-picker',
      'selection-list': 'selection-list'
    }
  })
}