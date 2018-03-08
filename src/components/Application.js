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
      'switcher',
      'availability-calendar'
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
      ...mapState({
        events: state => state.app.events
      })
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
      'service-availability-editor': 'service-availability-editor',
    }
  }
};