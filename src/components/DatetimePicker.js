export function CfDatetimePicker (DatetimePicker, moment) {
  return DatetimePicker.extend({
    template: '#datepicker-template',
    inject: [
      'datepicker'
    ],
    props: {
      /**
       * @property {string} Moment-ish format for input
       */
      dataFormat: {
        type: String,
        default: 'YYYY-MM-DD HH:mm:ss'
      },

      /**
       * Date format for date picker
       */
      dateFormat: {
        type: String,
        default: 'dd/MM/yyyy'
      }
    },
    computed: {
      /**
       * Time value for project's vue time picker
       */
      timeValue: {
        get () {
          if (!this.value) return null

          const datetime = moment(this.value)
          return {
            HH: datetime.format('HH'),
            mm: datetime.format('mm')
          }
        },

        set (newValue) {
          const datetime = moment(this.value || moment())

          datetime.set({
            hour: newValue.HH,
            minute: newValue.mm
          })

          this.$emit('input', datetime.format(this.dataFormat))
        }
      },

      /**
       * Date value for project's vue time picker
       */
      dateValue: {
        get () {
          if (!this.value) return null

          return moment(this.value).format('YYYY-MM-DD')
        },

        set (newValue) {
          const value = moment(this.value || moment())

          value.set({
            year: newValue.getFullYear(),
            month: newValue.getMonth(),
            date: newValue.getUTCDate()
          })

          this.$emit('input', value.format(this.dataFormat))
        }
      },
    },
    mounted () {
      this.$refs.timepicker.$el.querySelector('input').onclick = (e) => {
        e.target.select()
      }
    },
    methods: {
      openDatepicker () {
        this.$refs.datepicker.$refs.dateInput.click()
      },
      datepickerOpened () {
        this.$refs.datepicker.$refs.dateInput.select()
      },
      dateSelected () {
        this.$refs.timepicker.toggleDropdown()
        this.$refs.timepicker.$el.querySelector('input').select()
      }
    },
    components: {
      datepicker: 'datepicker'
    }
  })
}