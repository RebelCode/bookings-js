import { FunctionalToggleable, FunctionalArrayCollection } from '@rebelcode/std-lib'
import applicationFactory from './components/Application'

import CfSessionLength from './components/SessionLength'
import CfModal from './components/Modal'
import CfAbstractEntityModalEditor from './components/AbstractEntityModalEditor'
import CfServiceAvailabilityEditor from './components/ServiceAvailabilityEditor'
import CfSwitcher from './components/Switcher'
import CfAbstractButtonsGroup from './components/AbstractButtonsGroup'
import CfAbstractDialog from './components/AbstractDialog'
import CfAvailabilityCalendar from './components/AvailabilityCalendar'

import store from './store'
import CfBoolSwitcher from './components/BoolSwitcher'

export function services (dependencies, document) {
  return {
    vuex: function (container) {
      let Vue = container.vue,
        Vuex = dependencies.vuex
      Vue.use(Vuex)
      return Vuex
    },
    vue: function () {
      let Vue = dependencies.vue
      Vue.use(dependencies.uiFramework.Core.InjectedComponents)

      /*
       * Built timepicker's restriction. It should be installed as a plugin.
       */
      Vue.use(dependencies.timepicker)

      return Vue
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
    equal: function () {
      return dependencies.fastDeepEqual
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
    availabilityEditorStateToggleable: function (container) {
      return new FunctionalToggleable((newVisibility) => {
        container.store.commit('ui/setAvailabilityModalVisibility', newVisibility)
      }, () => {
        return container.store.state.ui.availabilityModalVisible
      })
    },
    app: function (container) {
      return applicationFactory(APP_STATE, container.store, container.vuex)
    },
    calendar: function (container) {
      return dependencies.calendar.CfFullCalendar(container.vue, container.jquery, container.lodash.defaultsDeep)
    },
    availabilitiesCollection (container) {
      const store = container.store

      return new FunctionalArrayCollection(() => {
        return store.state.app.events
      }, (newValue) => {
        store.commit('setNewEvents', newValue)
      }, (item) => {
        return item.id
      })
    },
    'availability-calendar': function (container) {
      // return {}
      return CfAvailabilityCalendar(container.calendar, container.vuex, container.moment)
    },
    repeater: function (container) {
      return new dependencies.repeater.CfRepeater(container.vue)
    },
    'selection-list': function (container) {
      return new dependencies.selectionList.CfSelectionList(container.repeater)
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
    'bool-switcher': function (container) {
      return CfBoolSwitcher(container.switcher)
    },
    'session-length': function (container) {
      return new CfSessionLength(container.vue, container.vuex)
    },

    'abstract-entity-modal-editor': function (container) {
      return new CfAbstractEntityModalEditor(container.vue)
    },
    'service-availability-editor': function (container) {
      return new CfServiceAvailabilityEditor(container['abstract-entity-modal-editor'], container.vuex, container.moment)
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
        timepicker: container.timepicker,
        switcher: container.switcher,

        'availability-calendar': container['availability-calendar'],
        'bool-switcher': container['bool-switcher'],

        'session-length': container['session-length'],
        'selection-list': container['selection-list'],
        'service-availability-editor': container['service-availability-editor'],
      }
    }
  }
}