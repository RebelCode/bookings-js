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
    moment: function () {
      return dependencies.moment
    },
    equal: function () {
      return dependencies.fastDeepEqual
    },
    httpClient: function () {
      let axios = dependencies.axios
      axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      return axios
    }
  }
}