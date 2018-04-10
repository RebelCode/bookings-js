import { FunctionalToggleable, FunctionalArrayCollection } from '@rebelcode/std-lib'
import applicationFactory from './components/Application'

import CfSessionLength from './components/SessionLength'
import CfModal from './components/Modal'
import CfAbstractEntityModalEditor from './components/AbstractEntityModalEditor'
import CfServiceAvailabilityEditor from './components/ServiceAvailabilityEditor'
import CfBookingEditor from './components/BookingEditor'
import CfSwitcher from './components/Switcher'
import CfAbstractButtonsGroup from './components/AbstractButtonsGroup'
import CfAbstractDialog from './components/AbstractDialog'
import CfAvailabilityCalendar from './components/AvailabilityCalendar'
import CfBookingsCalendar from './components/BookingsCalendar'

import store from './store'
import CfBoolSwitcher from './components/BoolSwitcher'
import CfRcSelect from './components/RcSelect'
import { CfBookingsCalendarView } from './components/BookingsCalendarView'
import { CfDatetimePicker } from './components/DatetimePicker'
import { CfBookingsListView } from './components/BookingsListView'
import { CfServiceBookingsApplication } from './components/ServiceBookingsApplication'
import { CfBookingsApplication } from './components/BookingsApplication'

import api from './api'
import libs from './libs'

export function services (dependencies, document) {
  return Object.assign({
    document: function () {
      return document
    },
    dom: function (container) {
      return new dependencies.uiFramework.Dom.Dom(container.document)
    },
    selectorList: function () {
      return []
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
    bookingEditorState: function (container) {
      return new FunctionalToggleable((newVisibility) => {
        container.store.commit('ui/setBookingModalVisibility', newVisibility)
      }, () => {
        return container.store.state.ui.bookingModalVisible
      })
    },
    app: function (container) {
      return applicationFactory(container['APP_STATE'], container.store, container.vuex)
    },
    'service-bookings-application': function (container) {
      return CfServiceBookingsApplication(container['APP_STATE'], container.store, container.vuex)
    },
    'bookings-application': function (container) {
      return CfBookingsApplication(container['APP_STATE'], container.store, container.vuex, container.vue)
    },
    calendar: function (container) {
      return dependencies.calendar.CfFullCalendar(container.vue, container.jquery, container.lodash.defaultsDeep)
    },
    wpListTable: function (container) {
      return container.vue.extend(dependencies.wpListTable.ListTable)
    },
    vueselect: function (container) {
      return CfRcSelect(container.vue.extend(dependencies.vueselect.VueSelect))
    },
    availabilitiesCollection (container) {
      const store = container.store

      return new FunctionalArrayCollection(() => {
        return store.state.app.availabilities
      }, (newValue) => {
        store.commit('setNewAvailabilities', newValue)
      }, (item) => {
        return item.id
      })
    },
    bookingsCollection (container) {
      const store = container.store

      return new FunctionalArrayCollection(() => {
        return store.state.app.bookings
      }, (newValue) => {
        store.commit('setNewBookings', newValue)
      }, (item) => {
        return item.id
      })
    },
    'availability-calendar': function (container) {
      // return {}
      return CfAvailabilityCalendar(container.calendar, container.moment)
    },
    'bookings-calendar': function (container) {
      // return {}
      return CfBookingsCalendar(container.calendar, container.vuex, container.moment)
    },
    'bookingStatusesColors': function () {
      return {
        'in-cart': '#f6e58d', // hide
        draft: '#dfe4ea',
        pending: '#1e90ff',
        approved: '#00d2d3',
        scheduled: '#2ed573',
        cancelled: '#eb4d4b',
        completed: '#57606f',
      }
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
    _datetimePicker: function (container) {
      return dependencies.datetimePicker.CfDatetimePicker(container.vue)
    },
    'datetime-picker': function (container) {
      return CfDatetimePicker(container._datetimePicker, container.moment)
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

    'booking-editor': function (container) {
      return new CfBookingEditor(container['abstract-entity-modal-editor'], container.vuex, container.moment, container.lodash.debounce)
    },
    'bookings-calendar-view': function (container) {
      return new CfBookingsCalendarView(container.vuex, container.moment)
    },
    'bookings-list-view': function (container) {
      return new CfBookingsListView(container.vuex, container.moment)
    },

    components: function (container) {
      return {
        app: container.app,
        calendar: container.calendar,
        vueselect: container.vueselect,
        repeater: container.repeater,
        tabs: container.tabs,
        tab: container.tab,
        modal: container.modal,
        datepicker: container.datepicker,
        timepicker: container.timepicker,
        'datetime-picker': container['datetime-picker'],
        switcher: container.switcher,
        wpListTable: container.wpListTable,

        'availability-calendar': container['availability-calendar'],
        'bool-switcher': container['bool-switcher'],

        'bookings-application': container['bookings-application'],

        'service-bookings-application': container['service-bookings-application'],
        'session-length': container['session-length'],
        'selection-list': container['selection-list'],
        'service-availability-editor': container['service-availability-editor'],

        'booking-editor': container['booking-editor'],
        'bookings-calendar': container['bookings-calendar'],
        'bookings-calendar-view': container['bookings-calendar-view'],
        'bookings-list-view': container['bookings-list-view']
      }
    }
  }, api(dependencies), libs(dependencies))
}