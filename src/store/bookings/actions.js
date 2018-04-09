export default {
  fetchBookings ({ commit }, { api, params }) {
    return api.fetch(params).then((response) => {
      commit('setBookings', response.data.items)
      commit('setBookingsCount', response.data.count)
    })
  }
}