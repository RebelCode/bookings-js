export function CfVueTimepicker(VueTimepicker) {
  return VueTimepicker.extend({
    template: '#vue-timepicker-template',
    props: {
      /**
       * Disable time picking before this time
       */
      disabledTo: {
        type: Object
      }
    },
    watch: {
      showDropdown (value) {
        if (value) {
          this.$nextTick(() => {
            this._scrollToSelected()
          })
        }
      }
    },
    computed: {
      disabledValues () {
        const def = { hour: [], minute: [], second: [], apm: [] }

        if (!this.disabledTo) {
          return def
        }

        let hour = [], minute = []

        const hourValue = this.hour ? Number(this.hour) : false

        const disableToHour = Number(this.disabledTo[this.hourType])
        const disableToMinute = Number(this.disabledTo[this.minuteType])

        hour = Array.apply(null, {length: disableToHour}).map(Number.call, Number)
        if (disableToMinute === 59) {
          hour.push(disableToHour)
        }

        if (hourValue === disableToHour) {
          minute = Array.apply(null, {length: disableToMinute + 1}).map(Number.call, Number)
        }

        return { hour, minute, second: [], apm: [] }
      }
    },
    methods: {
      /**
       * Scroll time pickers to selected values.
       *
       * @private
       */
      _scrollToSelected () {
        const scrollLists = [
          'hours', 'minutes', 'seconds', 'apms'
        ]
        for (let listClass of scrollLists) {
          const el = this.$el.querySelector(`.select-list .${listClass}`)
          if (!el) {
            continue
          }
          const activeNode = el.querySelector('.active')
          if (!activeNode) {
            continue
          }
          el.scrollTop = activeNode.offsetTop - 130 / 2 + 15
        }
      }
    }
  })
}