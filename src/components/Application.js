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
      'session-length', 'service-availability-editor',
      'modalStateToggleable',
      'switcher'
    ],
    data () {
      return {
        switcherValue: 'two',
        switcherStates: {
          one: 'One',
          two: 'Two',
          three: 'Three',
        },

        activeTab: 0,

        tabsConfig: {
          switcherClass: 'horizontal-tabs',
          switcherItemClass: 'horizontal-tabs__item',
          switcherActiveItemClass: '_active',
          tabsClass: 'tabs-content'
        },
      }
    },
    computed: {
      ...mapState([
        'events'
      ])
    },
    mounted () {
      if (!state) {
        throw new Error('App state not initialized')
      }

      this.setInitialState(state)
    },
    methods: {
      ...mapMutations([
        'setInitialState'
      ]),
      ...mapMutations('bookingOptions', [
        'setAvailabilityFromDate'
      ]),

      dayClick (date, jsEvent, view) {
        if (view.name !== 'month' && view.name !== 'agendaWeek') return

        this.setAvailabilityFromDate(date.format('DD/MM/YYYY'))
        this.modalStateToggleable.setState(true)
      }
    },
    components: {
      calendar: 'calendar',
      repeater: 'repeater',
      tabs: 'tabs',
      tab: 'tab',
      modal: 'modal',
      switcher: 'switcher',
      'session-length': 'session-length',
      'service-availability-editor': 'service-availability-editor',
    }
  }
};