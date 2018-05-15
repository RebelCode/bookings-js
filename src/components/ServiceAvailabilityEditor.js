export default function CfServiceAvailabilityEditor (AbstractEntityModalEditor, { mapState, mapMutations }, moment, FunctionalArrayCollection) {
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
    }
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
      'datetime-picker': 'datetime-picker',
      'time-picker': 'time-picker',

      'selection-list': 'selection-list'
    },
    data () {
      return {
        model: {
          id: null,

          start: null,
          end: null,

          isAllDay: false,

          repeat: false,
          repeatPeriod: 1,
          repeatUnit: 'days', // | "weeks" | "months" | "years"
          repeatUntil: 'period', // | "date"
          repeatUntilPeriod: 4,
          repeatUntilDate: null,

          repeatWeeklyOn: [],
          repeatMonthlyOn: [], // "day_of_week" | "date_of_month"

          excludeDates: []
        },

        exclusionsPickerVisible: false,

        excludeDatesCollection: new FunctionalArrayCollection(() => {
          return this.model.excludeDates.sort()
        }, (newDates) => {
          this.model.excludeDates = newDates
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
       * Set end time when user it is empty and user set start time
       *
       * @param newValue
       */
      'model.start': function (newValue) {
        if (!this.model.end) {
          this.model.end = newValue
        }
      },
      /**
       * Change default values when repeats changes.
       */
      'model.repeatUnit': function (newValue) {
        if (this.seedLock) return

        this.model.repeatPeriod = 1

        switch (newValue) {
          case 'months':
            this.model.repeatWeeklyOn = []
            this.model.repeatMonthlyOn = [ 'day_of_month' ]
            break
          default:
            this.model.repeatWeeklyOn = []
            this.model.repeatMonthlyOn = []
        }
      },

      /**
       * Preserve at least one selected day when selected weeks repeating.
       */
      'model.repeatWeeklyOn': {
        deep: true,
        handler: function (newValue) {
          if (this.seedLock || !this.model.start || !this.isSameDay() || newValue.length) return

          this.model.repeatWeeklyOn = [
            moment(this.model.start).format('dddd').toLowerCase()
          ]
        }
      },
    },
    computed: {
      ...mapState({
        timezone: state => state.app.timezone
      }),
      ...mapState('bookingOptions', {
        entityModel: state => state.serviceAvailabilityModel
      }),

      /**
       * Repeat until date casted to Date type
       *
       * @property {Date}
       */
      repeatUntilDateModel: {
        get () {
          if (!this.model.repeatUntilDate) {
            return
          }
          return moment(this.model.repeatUntilDate).toDate()
        },
        set (value) {
          this.model.repeatUntilDate = moment(value).format('YYYY-MM-DD')
        }
      },

      /**
       * Minimal possible repeating period
       */
      minimalRepeatPeriod () {
        if (!this.model.start || !this.model.end) {
          return 1
        }
        return moment(this.model.end).diff(moment(this.model.start), this.model.repeatUnit) + 1
      },

      excludeDatesModels () {
        let dates = this.model.excludeDates.map((date) => {
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
        return moment(this.model.start).toDate()
      },

      repeatingTitle () {
        return this.pluralize(this._(this.model.repeatUnit), Number(this.model.repeatPeriod))
      },

      repeatsUntilPeriodTitle () {
        return this.pluralize(this._(this.model.repeatUnit), Number(this.model.repeatUntilPeriod))
      },

      repeatingDuration () {
        switch (this.model.repeatUnit) {
          case 'days':
            return 31
          case 'weeks':
            return 52
          case 'months':
            return 12
          case 'years':
            return 5
          default:
            return 31
        }
      },

      repeatsOn () {
        if (this.model.repeatUnit !== 'weeks' && this.model.repeatUnit !== 'months') {
          return []
        }

        let start = moment(this.model.start)

        let repeatsOptions = {
          weeks: {
            monday: this._('M'),
            tuesday: this._('T'),
            wednesday: this._('W'),
            thursday: this._('T'),
            friday: this._('F'),
            saturday: 'S', // @todo: FIX IN ALPHA
            sunday: 'S', // @todo: FIX IN ALPHA
          },
          months: {
            day_of_month: start ? this._('Monthly on day %s', [start.format('D')]) : '',
            day_of_week: start ? this._('Monthly on the %s %s', [this.momentHelpers.weekdayInMonthNumber(start), start.format('dddd')]) : '',
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

        return makeKeyValueArray(repeatsOptions[this.model.repeatUnit])
      }
    },
    methods: {
      ...mapMutations({
        setNewEntities: 'setNewAvailabilities'
      }),

      _getExclusionItemTitle (date) {
        return helpers.getDate(date).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
      },

      normalizeRepeatPeriod () {
        if (!this.model.start || !this.model.end) {
          return
        }

        if (this.model.repeatPeriod < this.minimalRepeatPeriod) {
          this.model.repeatPeriod = this.minimalRepeatPeriod
          return
        }

        if (this.model.repeatPeriod > this.repeatingDuration) {
          this.model.repeatPeriod = this.repeatingDuration
        }
      },

      /**
       * Check that availability start is on the same day.
       *
       * @return {boolean}
       */
      isSameDay () {
        if (!this.model.start || !this.model.end) {
          return false
        }
        return moment(this.model.start).isSame(this.model.end, 'day')
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

        if (this.excludeDatesCollection.hasItem(date)) {
          this.excludeDatesCollection.removeItem(date)
        }
        else {
          this.excludeDatesCollection.addItem(date)
        }

        this.$refs.exclusions.selectedDate = null
      }
    },
    components: {
      repeater: 'repeater',
      modal: 'modal',
      datepicker: 'datepicker',
      'datetime-picker': 'datetime-picker',
      'time-picker': 'time-picker',
      'selection-list': 'selection-list'
    }
  })
}