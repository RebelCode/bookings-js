import { FunctionalToggleable, FunctionalArrayCollection } from '@rebelcode/std-lib'

import store from './store'
import api from './api'
import libs from './libs'
import components from './components'

export function services (dependencies, document) {
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

  return {
    ...allServices,
    ...registeredComponents,
    ...registeredApi,
    ...registeredLibs,
  }
}