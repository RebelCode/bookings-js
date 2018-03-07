import { FunctionalToggleable } from '@rebelcode/std-lib'
import applicationFactory from './components/Application'

import CfSessionLength from './components/SessionLength'
import CfModal from './components/Modal'
import CfModalNewBooking from './components/ModalNewBooking'
import CfSwitcher from './components/Switcher'
import CfAbstractButtonsGroup from './components/AbstractButtonsGroup'
import CfAbstractDialog from './components/AbstractDialog'

import store from './store'

export function services (dependencies, document) {
  return {
    vuex: function (container) {
      let Vue = container.vue,
        Vuex = dependencies.vuex

      Vue.version = container._vue.version
      Vue.config = container._vue.config
      Vue.set = container._vue.set

      Vue.use(Vuex)

      return Vuex
    },
    _vue: function () {
      return dependencies.vue
    },
    vue: function (container) {
      return container._vue.extend()
    },
    jquery: function () {
      return dependencies.jquery
    },
    lodash: function () {
      return dependencies.lodash
    },
    moment: function () {
      return dependencies.moment
    },
    document: function () {
      return document
    },
    dom: function (container) {
      return new dependencies.uiFramework.Dom.Dom(container.document)
    },
    selectorList: function () {
      return [
        '#calendar-app',
        '#metabox-calendar-app',
      ]
    },
    store: function (container) {
      return new container.vuex.Store(store)
    },
    modalStateToggleable: function (container) {
      return new FunctionalToggleable((newVisibility) => {
        container.store.commit('ui/setAvailabilityModalVisibility', newVisibility)
      }, () => {
        return container.store.state.ui.availabilityModalVisible
      })
    },
    app: function (container) {
      return applicationFactory(APP_STATE, container.vuex)
    },
    calendar: function (container) {
      return dependencies.calendar.CfFullCalendar(container.vue, container.jquery, container.lodash.defaultsDeep)
    },
    repeater: function (container) {
      return new dependencies.repeater.CfRepeater(container.vue)
    },
    datepicker: function () {
      return dependencies.datepicker
    },
    tabs: function (container) {
      return new dependencies.tabs.CfTabs(container.vue)
    },
    tab: function (container) {
      return new dependencies.tabs.CfTab(container.vue)
    },
    modal: function (container) {
      return CfModal(container.dialog)
    },
    dialog: function (container) {
      return CfAbstractDialog(container.vue)
    },
    'abstract-button-group': function (container) {
      return CfAbstractButtonsGroup(container.vue)
    },
    switcher: function (container) {
      return CfSwitcher(container['abstract-button-group'])
    },
    'session-length': function (container) {
      return new CfSessionLength(container.vue, container.repeater)
    },
    'modal-new-booking': function (container) {
      return new CfModalNewBooking(container.vue, container.vuex)
    },
    components: function (container) {
      return {
        app: container.app,
        calendar: container.calendar,
        repeater: container.repeater,
        tabs: container.tabs,
        tab: container.tab,
        modal: container.modal,
        datepicker: container.datepicker,
        switcher: container.switcher,

        'session-length': container['session-length'],
        'modal-new-booking': container['modal-new-booking'],
      }
    }
  }
}