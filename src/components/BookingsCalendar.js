export default function (FullCalendar, { mapState, mapMutations }, moment) {
  return FullCalendar.extend({
    inject: {
      'bookingStatusesColors': 'bookingStatusesColors',
      'helpers': {
        from: 'bookingHelpers'
      },
      '_': {
        from: 'translate'
      },

      /**
       * Function for creating datetime in timezone.
       *
       * @since [*next-version*]
       *
       * @property {CreateDatetimeFunction} createDatetime
       */
      'createDatetime': 'createDatetime',

      /**
       * Function for rendering template.
       *
       * @since [*next-version*]
       *
       * @property {RenderFunction} renderTemplate
       */
      'renderTemplate': 'renderTemplate'
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
      },
      ...mapState('bookings', [
        'timezone'
      ])
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
          start: this.createDatetime(model.start, this.timezone),
          end: this.createDatetime(model.end, this.timezone),

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
          .html(this.renderTemplate('rc-booking-calendar-event', {
            title: event.title || this._('New booking'),
            clientName: event.clientName || '',
            action: event.title ? this._('Click for more details') : this._('Release to create booking'),
            start: event.start.format('HH:mm'),
            end: event.end.format('HH:mm')
          }))
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