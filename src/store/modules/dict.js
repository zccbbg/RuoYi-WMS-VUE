import { allWmsItem } from '@/api/wms/item'

export default {
  state: {
    items: []
  },
  mutations: {
    SET_ITEMS(state, list) {
      state.items = list
    }
  },
  actions: {
    loadItems({commit}) {
      return allWmsItem()
        .then(res => {
          commit('SET_ITEMS', res);
          return res
        })
    }
  }
}
