import makeStoreObject from './store'
import api from './api'
import libs from './libs'
import components from './components'
import transformers from './transformers'

export function services (dependencies, document) {
  const FunctionalToggleable = dependencies.stdLib.FunctionalToggleable
  const FunctionalArrayCollection = dependencies.stdLib.FunctionalArrayCollection

  const allServices = {
    document: function () {
      return document
    },
    dom: function (container) {
      return new dependencies.uiFramework.Dom.Dom(container.document)
    },
    selectorList: function () {
      return []
    },

    store (container) {
      const store = makeStoreObject({
        deepSet: container.lodash.set,
        deepHas: container.lodash.has,
      })
      return new container.vuex.Store(store)
    },

    settingsValues (container) {
      if (!container.state.settingsUi) {
        return {}
      }
      return container.state.settingsUi.values || {}
    },

    state: function (container) {
      return container.stateTransformer.transform(container['APP_STATE'], {
        timezone: container['APP_STATE'].timezone || container['APP_STATE'].config.timezone
      })
    },
    config: function (container) {
      return container['APP_STATE'].config || {}
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
    availabilitiesCollection (container) {
      const store = container.store

      return new FunctionalArrayCollection(() => {
        return store.state.app.availabilities.rules
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
    'bookingStatusesColors': function () {
      return {
        in_cart: '#f6e58d', // hide
        draft: '#dfe4ea',
        pending: '#1e90ff',
        approved: '#00d2d3',
        scheduled: '#2ed573',
        cancelled: '#eb4d4b',
        completed: '#57606f',
      }
    },
    components: function (container) {
      let components = {}
      /*
       * Get all registered components and provide them to
       * Vue root components only if their name is not started
       * with '_' or 'abstract'
       */
      Object.keys(registeredComponents).filter(key => {
        return key[0] !== '_' && key.indexOf('abstract') === -1
      }).map(key => {
        components[key] = container[key]
      })
      console.info(components)
      return components
    }
  }
  const registeredComponents = components(dependencies)
  const registeredApi = api(dependencies)
  const registeredLibs = libs(dependencies)
  const registeredTransformers = transformers(dependencies)

  return {
    ...allServices,
    ...registeredComponents,
    ...registeredApi,
    ...registeredLibs,
    ...registeredTransformers
  }
}