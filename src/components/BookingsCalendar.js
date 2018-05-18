export default function (FullCalendar, { mapState, mapMutations }, moment) {
  /**
   * Render function for event parts
   *
   * @todo: move this stuff to templates from backend || vue
   * @todo: this is temp solution
   *
   * @param event
   * @return {string}
   */
  const renderEvent = function (event, _) {
    const title = event.title || _('New booking')
    const clientName = event.clientName || ''
    const action = event.title ? _('Click for more details') : _('Release to create booking')

    return `
      <div class="rc-event-field rc-event-field--title">${title}</div>
      <div class="rc-event-field rc-event-field--time">${event.start.format('HH:mm')} - ${event.end.format('HH:mm')}</div>
      <div class="rc-event-field rc-event-field--month-collapse">${clientName}</div>
      <div class="rc-event-field rc-event-field--month-collapse rc-event-field--click">${action}</div>
    `
  }

  return FullCalendar.extend({
    inject: {
      'bookingStatusesColors': 'bookingStatusesColors',
      'helpers': {
        from: 'bookingHelpers'
      },
      '_': {
        from: 'translate'
      },
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
      config: {
        type: Object,
        default () {
          const self = this
          return {
            eventLimit: true,
            viewRender (view) {
              self.$emit('period-change', view.start, view.end)
            },
            selectAllow (selectInfo) {
              return selectInfo.start.isSameOrAfter(moment(), 'day')
            }
          }
        },
      },
    },

    computed: {
      generatedEvents () {
        return this.generateEvents(this.bookings, this.colorScheme)
      }
    },

    mounted () {
      this.$on('event-created', this.eventCreated)
      this.$on('event-selected', this.eventClicked)
      this.$on('event-render', this.eventRender)
    },

    methods: {
      ...mapMutations('bookingOptions', [
        'setAvailabilityEditorState'
      ]),

      /**
       * Event is created using calendar
       *
       * @param params
       */
      eventCreated (params) {
        this.fireMethod('unselect')
        /*
         * Don't create booking when `end` date is past.
         *
         * @todo: don't show blue box on creating.
         */
        if (moment().isAfter(params.end)) {
          return
        }

        this.$emit('booking-create', {
          start: params.start.format(),
          end: params.end.format()
        })
      },

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
          title: model.service.name,
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

        const textColor = '#000'

        return {
          color,
          textColor
        }
      },

      /**
       * Render event view.
       *
       * @param event
       * @param element
       * @param view
       */
      eventRender (event, element, view) {
        let endDate = event.end || event.start
        if (endDate.isBefore(moment(), 'day')) {
          element[0].classList.add('fc-event--past')
        }

        if (this.colorScheme === 'service') {
          element.addClass(`rc-service-event rc-service-event--${event.model.status}`)
        }

        element.find('.fc-content')
          .addClass(`rc-event`)
          .html(renderEvent(event, this._))
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