import { momentHelpers } from './moment-helpers'
import { bookingHelpers } from './booking-helpers'
import { isMobile } from './is-mobile'
import AvailabilityHelpers from './AvailabilityHelpers'
import NotificationsCenter from './NotificationsCenter'
import makeMapStore from './makeMapStore'
import { makeClickOutside } from './makeClickOutside'
import pipesServiceDefinition from './uiActions/pipesServiceDefinition'
import actionFactoriesDefinitions from './uiActions/actionFactoriesDefinitions'
import ValidatorFactory from './validation/ValidatorFactory'

export default function (dependencies, applicationState) {
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

      Vue.use(dependencies.validate, {
        events: false,
        dictionary: {
          en: {
            messages: {
              after: (field, [target, inclusion]) => `The ${field} time must be after${inclusion ? ' or equal to' : ''} the ${target} time.`,
            }
          }
        }
      })

      Vue.use(dependencies.toasted.default, {
        position: 'top-center',
        duration: 4000
      })

      return Vue
    },

    validatorFactory () {
      return new ValidatorFactory(dependencies.validate.Rules, (field, rule, args) => {
        const dictionary = dependencies.validate.Validator.dictionary
        return dictionary.getFieldMessage(dictionary.locale, field, rule, [field, args])
      })
    },

    notificationsCenter (container) {
      return new NotificationsCenter(container.vue.toasted.show, container.vue.toasted.error)
    },

    /**
     * Map of available UI action pipe's names to instances.
     *
     * @since [*next-version*]
     */
    ...pipesServiceDefinition(dependencies, applicationState),

    /**
     * Available action factories definitions.
     *
     * @since [*next-version*]
     */
    ...actionFactoriesDefinitions(),

    /**
     * Service definition for template render function factory.
     *
     * @since [*next-version*]
     *
     * @param {Container} container Service container.
     *
     * @return {TemplateRenderFunctionFactory}
     */
    makeTemplateRenderFunction (container) {
      return (templateId) => {
        const templateString = container.document.getElementById(templateId).innerHTML
        return (templateData) => new Function(`{${Object.keys(templateData).join(',')}}`, 'return `' + templateString + '`')(templateData)
      }
    },

    /**
     * Booking calendar event template renderer function.
     *
     * @since [*next-version*]
     *
     * @param {Container} container Service container.
     *
     * @return {TemplateRenderFunction}
     */
    renderBookingsEventTemplate (container) {
      return container.makeTemplateRenderFunction('rc-booking-calendar-event')
    },

    /**
     * Availability calendar event template renderer function.
     *
     * @since [*next-version*]
     *
     * @param {Container} container Service container.
     *
     * @return {TemplateRenderFunction}
     */
    renderAvailabilityEventTemplate (container) {
      return container.makeTemplateRenderFunction('rc-availability-calendar-event')
    },

    /**
     * Function for mapping store fields.
     *
     * @since [*next-version*]
     *
     * @param {Container} container DI Container.
     *
     * @return {mapStoreFunction}
     */
    mapStore (container) {
      return makeMapStore(container.lodash.get)
    },

    clickOutside (container) {
      return makeClickOutside()
    },

    jquery: function () {
      return dependencies.jquery
    },
    lodash: function () {
      return dependencies.lodash.noConflict()
    },
    momentHelpers: function (container) {
      return momentHelpers(container.moment, container.config.formats.datetime)
    },
    bookingHelpers: function (container) {
      return bookingHelpers(container.bookingStatusesColors, container.state.statuses)
    },
    availabilityHelpers: function (container) {
      return new AvailabilityHelpers(container.moment)
    },
    moment: function () {
      const moment = dependencies.moment
      return dependencies.momentRange.extendMoment(moment)
    },
    createDatetime: function (container) {
      return (value, timezone) => container.momentHelpers.switchToTimezone(value, timezone || 'UTC')
    },
    sha1: function () {
      return dependencies.sha1
    },
    humanizeDuration: function () {
      return dependencies.humanizeDuration
    },
    equal: function () {
      return dependencies.fastDeepEqual
    },
    httpClient: function () {
      return dependencies.axios
    },
    pluralize: function () {
      return dependencies.pluralize
    },
    textFormatter: function () {
      return dependencies.textFormatter.vsprintf
    },
    translator: function (container) {
      return new dependencies.uiFramework.I18n.FormatTranslator(
        container.textFormatter
      )
    },
    translate: function (container) {
      return function (format, params) {
        return container.translator.translate(format, params)
      }
    },
    hashCode: function (container) {
      return container.sha1
    },
    isMobile: function () {
      return isMobile
    }
  }
}