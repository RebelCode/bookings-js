import { FunctionalArrayCollection } from '@rebelcode/std-lib'

export default function (state, store, Vuex) {
  const mapState = Vuex.mapState
  const mapMutations = Vuex.mapMutations

  return {
    store,
    inject: [
      'calendar',
      'repeater',
      'tabs', 'tab', 'modal',
      'session-length',
      'service-availability-editor',
      'bookings-page',
      'switcher',
      'bool-switcher',
      'availability-calendar',
      'selection-list',
      'availabilityEditorStateToggleable'
    ],
    data () {
      return {
        activeTab: 0,

        tabsConfig: {
          switcherClass: 'horizontal-tabs',
          switcherItemClass: 'horizontal-tabs__item',
          switcherActiveItemClass: '_active',
          tabsClass: 'tabs-content'
        },

        calendarConfig: {
          showDatesInCustomersTimezone: false
        },

        selectedStatuses: [],

        statuses: [{
          key: 'in-cart',
          value: 'In Cart'
        },{
          key: 'approved',
          value: 'Approved'
        },{
          key: 'completed',
          value: 'Completed'
        },{
          key: 'scheduled',
          value: 'Scheduled'
        }, {
          key: 'pending',
          value: 'Pending'
        }, {
          key: 'draft',
          value: 'Draft'
        }, {
          key: 'cancelled',
          value: 'Cancelled'
        }],

        statusesCollection: new FunctionalArrayCollection(() => {
          return this.statuses
        }, (newValue) => {}, (item) => {
          return item.key
        })
      }
    },
    computed: {
      ...mapState({
        events: state => state.app.events,
        screenStatuses: state => state.app.screenStatuses,
      })
    },
    mounted () {
      if (!state) {
        throw new Error('App state not initialized')
      }

      /*
       * @todo: seed store outside of mounted!
       */
      if (state.services) {
        const services = state.services.slice()
        delete state.services

        this.setInitialState(state)
        this.setServices(services)
      }

      this.selectedStatuses = this.screenStatuses.slice()
    },
    methods: {
      ...mapMutations([
        'setInitialState',
        'setScreenStatuses'
      ]),

      ...mapMutations('bookingOptions', [
        'setAvailabilityEditorState'
      ]),

      ...mapMutations('bookings', [
        'setServices'
      ]),

      openAvailabilityEditor (availability) {
        this.setAvailabilityEditorState(availability)
        this.availabilityEditorStateToggleable.setState(true)
      }
    },
    components: {
      calendar: 'calendar',
      repeater: 'repeater',
      tabs: 'tabs',
      tab: 'tab',
      modal: 'modal',
      switcher: 'switcher',
      'availability-calendar': 'availability-calendar',
      'session-length': 'session-length',
      'bool-switcher': 'bool-switcher',
      'selection-list': 'selection-list',

      'service-availability-editor': 'service-availability-editor',

      'bookings-page': 'bookings-page',
    }
  }
};