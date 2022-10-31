import { allWmsItem } from '@/api/wms/item'
import { listByTypes } from '@/api/system/dict/data'
import { DICT_TYPES } from '@/config/business'
export default {
  state: {
    items: [],
    dictTypeMap: {},
  },
  mutations: {
    SET_ITEMS(state, list) {
      state.items = list
    },
    SET_DICT_TYPE_MAP(state, list) {
      const map = {};
      list.forEach(it => {
        const {dictType} = it;
        let arr = map[dictType];
        if (!arr) {
          arr = [];
          map[dictType] = arr;
        }
        arr.push(it);
      })
      state.dictTypeMap = map;
    }
  },
  actions: {
    loadItems({commit}) {
      return allWmsItem()
        .then(res => {
          commit('SET_ITEMS', res);
          return res
        })
    },
    loadAllDict({ commit }) {
      listByTypes(DICT_TYPES).then(res => {
        const { rows } = res
        commit('SET_DICT_TYPE_MAP', rows.map(it => ({value: it.dictValue, label: it.dictLabel, dictType: it.dictType})))
      })
    }
  }
}
