<template>
<el-cascader
  placeholder="请选择仓库信息"
  :options="options"
  v-model="selections"
  :props="{ checkStrictly: true }"
  clearable
  :size="size"
  :disabled="disabled"
  filterable></el-cascader>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: {
      type: [String, Number,Array],
      default: null
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: []
    }
  },
  computed: {
    ...mapGetters(['rackList', 'areaList', 'warehouseList']),
    selections: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  created() {
    this.setOptions()
  },
  methods: {
    setOptions() {
      let areaMap = new Map()
      let warehouseMap = new Map()
      this.rackList.forEach(rack => {
        let children = areaMap.get(rack.areaId)
        if (!children) {
          children = []
          areaMap.set(rack.areaId, children)
        }
        children.push({ value: rack.id, label: rack.rackName })
      })
      this.areaList.forEach(area => {
        let children = warehouseMap.get(area.warehouseId)
        if (!children) {
          children = []
          warehouseMap.set(area.warehouseId, children)
        }
        children.push({ value: area.id, label: area.areaName, children: areaMap.get(area.id) })
      })
      this.options = this.warehouseList.map(warehouse => {
        return {
          value: warehouse.id,
          label: warehouse.warehouseName,
          children: warehouseMap.get(warehouse.id)
        }
      })
    }
  }
}
</script>
