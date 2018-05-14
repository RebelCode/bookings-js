import { momentHelpers } from './moment-helpers'
import { bookingHelpers } from './booking-helpers'
import { isMobile } from './is-mobile'

export default function (dependencies) {
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
      return Vue
    },
    jquery: function () {
      return dependencies.jquery
    },
    lodash: function () {
      return dependencies.lodash
    },
    momentHelpers: function (container) {
      return momentHelpers(container.moment)
    },
    bookingHelpers: function (container) {
      return bookingHelpers(container.bookingStatusesColors, container.APP_STATE.statuses)
    },
    moment: function () {
      return dependencies.moment 
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
    translator: function () {
      return new dependencies.uiFramework.I18n.FormatTranslator(
        dependencies.textFormatter.vsprintf
      )
    },
    translate: function (container) {
      return function (format, params) {
        return container.translator.translate(format, params)
      }
    },
    isMobile: function () {
      return isMobile
    }
  }
}