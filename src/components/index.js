import CfSessionLength from './SessionLength'
import CfModal from './Modal'
import CfAbstractEntityModalEditor from './AbstractEntityModalEditor'
import CfServiceAvailabilityEditor from './ServiceAvailabilityEditor'
import CfBookingEditor from './BookingEditor'
import CfSwitcher from './Switcher'
import CfAbstractButtonsGroup from './AbstractButtonsGroup'
import CfAbstractDialog from './AbstractDialog'
import CfAvailabilityCalendar from './AvailabilityCalendar'
import CfBookingsCalendar from './BookingsCalendar'
import CfBoolSwitcher from './BoolSwitcher'
import CfRcSelect from './RcSelect'
import { CfBookingsCalendarView } from './BookingsCalendarView'
import { CfDatetimePicker } from './DatetimePicker'
import { CfBookingsListView } from './BookingsListView'
import { CfServiceBookingsApplication } from './ServiceBookingsApplication'
import { CfBookingsApplication } from './BookingsApplication'
import { CfVueTimepicker } from './VueTimepicker'
import { CfBookingsFilter } from './BookingsFilter'
import { CfAbstractBookingsView } from './AbstractBookingsView'
import CfTimezoneSelect from './TimezoneSelect'

/*
 * Exports instances to main container config.
 */
export default function (dependencies) {
  return {
    'timezone-select': function (container) {
      return CfTimezoneSelect()
    },
    'service-bookings-application': function (container) {
      return CfServiceBookingsApplication(container.state, container.store, container.vuex)
    },
    'bookings-application': function (container) {
      return CfBookingsApplication(container.state, container.store, container.vuex, container.vue, dependencies.stdLib.FunctionalArrayCollection)
    },
    calendar: function (container) {
      return dependencies.calendar.CfFullCalendar(container.vue, container.jquery, container.lodash.defaultsDeep, 'generatedEvents')
    },
    wpListTable: function (container) {
      return container.vue.extend(dependencies.wpListTable.ListTable)
    },
    vueselect: function (container) {
      return CfRcSelect(container.vue.extend(dependencies.vueselect.VueSelect))
    },
    'availability-calendar': function (container) {
      return CfAvailabilityCalendar(container.calendar, container.moment)
    },
    'bookings-calendar': function (container) {
      return CfBookingsCalendar(container.calendar, container.vuex, container.moment)
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
      return CfDatetimePicker(container._datetimePicker, container.moment, container.config.formats.datetime.tzFree)
    },
    'time-picker': function (container) {
      return CfVueTimepicker(container.vue.options.components['vue-timepicker'])
    },
    tabs: function (container) {
      return new dependencies.tabs.CfTabs(container.vue)
    },
    tab: function (container) {
      return new dependencies.tabs.CfTab(container.vue)
    },
    modal: function (container) {
      return CfModal(container['abstract-dialog'])
    },
    'abstract-dialog': function (container) {
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
      return new CfSessionLength(container.vue, container.vuex, dependencies.stdLib.FunctionalArrayCollection)
    },

    'abstract-entity-modal-editor': function (container) {
      return new CfAbstractEntityModalEditor(container.vue)
    },
    'service-availability-editor': function (container) {
      return new CfServiceAvailabilityEditor(container['abstract-entity-modal-editor'], container.vuex, container.moment, dependencies.stdLib.FunctionalArrayCollection)
    },

    'booking-editor': function (container) {
      return new CfBookingEditor(container['abstract-entity-modal-editor'], container.vuex, container.moment, container.lodash.debounce)
    },
    'abstract-bookings-view': function (container) {
      return new CfAbstractBookingsView(container.vue, container.vuex)
    },
    'bookings-calendar-view': function (container) {
      return new CfBookingsCalendarView(container['abstract-bookings-view'], container.vuex, container.moment)
    },
    'bookings-list-view': function (container) {
      return new CfBookingsListView(container['abstract-bookings-view'], container.vuex, container.moment)
    },
    'bookings-filter': function (container) {
      return new CfBookingsFilter(container.vuex, dependencies.stdLib.FunctionalCollection)
    },
  }
}