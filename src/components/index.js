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
import { CfSettingsApplication } from './SettingsApplication'
import { CfColorPicker } from './ColorPicker'
import WizardEditor from './settings/WizardEditor.vue'
import EditableInput from './settings/EditableInput.vue'

import { page as ServicesPage } from './../modules/services'
import Services from './../modules/services/components/Services'
import ServicesEditor from './../modules/services/components/ServiceEditor'
import CfSessionLength from './../modules/services/components/SessionLength'

import VSwitch from './ui/VSwitch.vue'

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

    'settings-application' (container) {
      return CfSettingsApplication(container.store, container.vuex, container.mapStore, container.settingsValues)
    },
    'wizard-editor' () {
      return WizardEditor
    },
    'editable-input' () {
      return EditableInput
    },

    /**
     * The page for managing services.
     *
     * @since [*next-version*]
     *
     * @return {object|VueComponent}
     */
    'services-page' (container) {
      return ServicesPage(container.store, container.vuex, container.mapStore)
    },

    /**
     * Component for displaying services list.
     *
     * @since [*next-version*]
     *
     * @return {object|VueComponent}
     */
    'services' (container) {
      console.info('Services(container.mapStore)', Services(container.mapStore))
      return Services(container.mapStore)
    },

    'service-editor' (container) {
      return new ServicesEditor(container['abstract-entity-modal-editor'], container.vuex)
    },

    'session-length' (container) {
      return new CfSessionLength(container.vuex, dependencies.stdLib.FunctionalArrayCollection)
    },

    /**
     * State switching component.
     *
     * @since [*next-version*]
     *
     * @return {object|VueComponent}
     */
    'v-switch' () {
      console.info('VSwitch', VSwitch)
      return VSwitch
    },

    calendar: function (container) {
      return dependencies.calendar.CfFullCalendar(container.vue, container.jquery, container.defaultsDeep, 'generatedEvents')
    },
    wpListTable: function (container) {
      return container.vue.extend(dependencies.wpListTable)
    },
    vueselect: function (container) {
      return CfRcSelect(container.vue.extend(dependencies.vueselect))
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

    'datetime-picker' (container) {
      return CfDatetimePicker(container._datetimePicker, container.moment, container.config.formats.datetime.tzFree)
    },

    'createDatetimeCapable' (container) {
      return dependencies.bookingWizardComponents.MfCreateDatetimeCapable(container.moment)
    },

    /**
     * Component for selecting session for service.
     *
     * @since [*next-version*]
     *
     * @param {Container} container DI Container.
     *
     * @return {object}
     */
    'service-session-selector' (container) {
      return dependencies.bookingWizardComponents.CfServiceSessionSelector(
        container.createDatetimeCapable,
        container.sessionsApi,
        container.config.formats.datetime
      )
    },

    /**
     * Component for selecting session duration.
     *
     * @since [*next-version*]
     *
     * @return {object}
     */
    'session-duration-picker' () {
      return dependencies.bookingWizardComponents.CfSessionDurationPicker()
    },

    /**
     * Component for selecting date when selecting session for service.
     *
     * @since [*next-version*]
     *
     * @param {Container} container DI Container.
     *
     * @return {object}
     */
    'session-date-picker' (container) {
      return dependencies.bookingWizardComponents.CfSessionDatePicker(
        container.createDatetimeCapable,
        container.config.formats.datetime
      )
    },

    /**
     * Component for selecting time when selecting session for service.
     *
     * @since [*next-version*]
     *
     * @param {Container} container DI Container.
     *
     * @return {object}
     */
    'session-time-picker' (container) {
      return dependencies.bookingWizardComponents.CfSessionTimePicker(
        container.createDatetimeCapable,
        container.config.formats.datetime
      )
    },

    /**
     * Component for switching between near dates in calendar.
     *
     * @since [*next-version*]
     *
     * @param {Container} container DI Container.
     *
     * @return {object}
     */
    'date-navigator' (container) {
      return dependencies.bookingWizardComponents.CfDateNavigator(
        container.createDatetimeCapable,
        container.config.formats.datetime
      )
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

    'core-color-picker' (container) {
      return dependencies.vueColor.Sketch
    },

    'color-picker' (container) {
      return CfColorPicker(container.clickOutside)
    }
  }
}