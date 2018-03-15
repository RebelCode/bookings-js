export default function (FullCalendar, Vuex, moment) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  /**
   * Render function for event parts
   *
   * @todo: move this stuff to templates from backend
   * @todo: this is temp solution
   *
   * @param event
   * @return {string}
   */
  const renderEvent = function (event) {
    return `
      <div class="rc-event-field">${event.title}</div>
      <div class="rc-event-field">${event.start.format('HH:mm')} - ${event.end.format('HH:mm')}</div>
      <div class="rc-event-field">${event.clientName}</div>
      <div class="rc-event-field rc-event-field--click">Click here to see details...</div>
    `
  }

  return FullCalendar.extend({
    data () {
      return {
        generatedEvents: []
      }
    },
    props: {
      bookings: {
        default () {
          return []
        }
      },

      colorScheme: {
        type: String,
        default: 'status'
      },
      // header: {
      //   default () {
      //     return {
      //       left: 'agendaWeek,month',
      //       right: 'prev title next'
      //     }
      //   },
      // },
      // defaultView: {
      //   default () {
      //     return 'agendaWeek'
      //   },
      // },
      config: {
        type: Object,
        default () {
          const self = this
          return {
            // events: this.computedEvents,
            viewRender (view) {
              self.$emit('period-change', view.start, view.end)
            }
          }
        },
      },
    },

    computed: {
      events () {
        return this.generateEvents(this.bookings, this.colorScheme)
      }
    },

    mounted () {
      this.$on('event-selected', this.eventClicked)
      this.$on('event-render', this.eventRender)
    },

    methods: {
      ...mapMutations('bookingOptions', [
        'setAvailabilityEditorState'
      ]),

      /**
       * Transform bookings to events format that is understandable
       * and renderable bu FullCalendar.
       *
       * @param bookings
       * @param colorScheme
       */
      generateEvents (bookings, colorScheme) {
        return bookings.map((booking) => {
          return this.bookingToEvent(booking, colorScheme)
        })
      },

      /**
       * Convert availability model to event format that understandable by
       * calendar. This is required to not force backend to prepare data
       * for the concrete calendar implementation.
       *
       * @param booking
       * @return {{id: null, allDay: *, start: string, end: string, model: {} & any}}
       */
      bookingToEvent (booking, colorScheme) {
        let model = Object.assign({}, booking)

        return Object.assign({}, {
          id: model.id,
          title: model.service.title,
          start: model.start,
          end: model.end,

          clientName: model.client.name,

          ...this.bookingColor(booking, colorScheme),

          model
        }, {})
      },

      /**
       * Get booking color
       *
       * @param booking
       * @param colorScheme
       * @return {{backgroundColor: string, borderColor: string, textColor: string}}
       */
      bookingColor (booking, colorScheme) {
        let color = '#686de0';

        const textColor = this._getBrightness(color) > .5 ? '#000' : '#fff'

        return {
          backgroundColor: color,
          borderColor: color,
          textColor: textColor
        }
      },

      /**
       * Get color brightness to determine text color over event
       *
       * @param hexCode
       * @return {number}
       * @private
       */
      _getBrightness(hexCode) {
        // strip off any leading #
        hexCode = hexCode.replace('#', '');

        var c_r = parseInt(hexCode.substr(0, 2),16);
        var c_g = parseInt(hexCode.substr(2, 2),16);
        var c_b = parseInt(hexCode.substr(4, 2),16);

        return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000 / 255;
      },

      eventRender (event, element, view) {
        element.find('.fc-content').html(renderEvent(event))
        console.info('EVENT RENDER', element.find('.fc-content'))
      },

      /**
       * Runs when user clicks on event in the calendar.
       *
       * @param event
       */
      eventClicked (event) {
        let model = Object.assign({}, event.model)
        // Open booking editor here
      }
    }
  })
}