import { momentHelpers } from './moment-helpers'
import { bookingHelpers } from './booking-helpers'

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
      return bookingHelpers(container.bookingStatusesColors)
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
    }
  }
}