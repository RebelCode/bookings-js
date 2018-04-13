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
      <div class="rc-event-field rc-event-field--title">${event.title}</div>
      <div class="rc-event-field rc-event-field--time">${event.start.format('HH:mm')} - ${event.end.format('HH:mm')}</div>
      <div class="rc-event-field rc-event-field--month-collapse">${event.clientName}</div>
      <div class="rc-event-field rc-event-field--month-collapse rc-event-field--click">Click here to see details...</div>
    `
  }

  return FullCalendar.extend({
    inject: [
      'bookingStatusesColors'
    ],
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
      header: {
        default () {
          return {
            left: 'prev',
            center: 'title',
            right: 'next'
          }
        },
      },
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
            eventLimit: true,
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
          editable: false, // disable dragging and resizing
          title: model.service.title,
          start: moment(model.start),
          end: moment(model.end),

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
       *
       * @return {Object}
       */
      bookingColor (booking, colorScheme) {
        const color = colorScheme === 'status' ?
          this.bookingStatusesColors[booking.status] : booking.service.color

        const textColor = this._getBrightness(color) > .5 ? '#000' : '#fff'

        return {
          color,
          textColor
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

        const c_r = parseInt(hexCode.substr(0, 2),16);
        const c_g = parseInt(hexCode.substr(2, 2),16);
        const c_b = parseInt(hexCode.substr(4, 2),16);

        return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000 / 255;
      },

      /**
       * Render event view.
       *
       * @param event
       * @param element
       * @param view
       */
      eventRender (event, element, view) {
        if (this.colorScheme === 'service') {
          element.addClass(`rc-service-event rc-service-event--${event.model.status}`)
        }

        element.find('.fc-content')
          .addClass(`rc-event`)
          .html(renderEvent(event))
      },

      /**
       * Runs when user clicks on event in the calendar.
       *
       * @param event
       */
      eventClicked (event) {
        this.$emit('booking-click', Object.assign({}, event.model))
      }
    }
  })
}