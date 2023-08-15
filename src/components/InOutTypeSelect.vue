<template>
  <div class="item-select-wrapper">
    <el-cascader :options="options" :clearable="clearable" placeholder="请选择操作类型"
                 v-model="value1" :size="size" :show-all-levels="false">
    </el-cascader>
  </div>
</template>

<script>

const optionsMap = [{
  name: "入库",
  dictName: "wms_receipt_type",
},
  {
    name: "出库",
    dictName: "wms_shipment_type",
  },
  {
    name: "移库",
    dictName: "wms_movement_type",
  },
  {
    name: "盘点",
    dictName: "wms_check_type",
  }]
const dictNames = optionsMap.map(item => item.dictName)
const names = optionsMap.map(item => item.name)
export default {
  name: 'InOutTypeSelect',
  dicts: dictNames,
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    size: {
      type: String,
      default: 'small'
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    value1: {
      get() {
        return this.value
      },
      set(v) {
        // 取数组的第二个元素
        let type = v[1] || v[0] || null
        this.$emit('input', type)
      }
    },
    options: {
      get() {
        let options = []
        let dict = this.dict.type
        for (let i = 0; i < dictNames.length; i++) {
          let dictName = dictNames[i]
          let name = names[i]
          let option = {
            value: name,
            label: name,
            children: dict[dictName].map(item => {
              return {
                value: item.value,
                label: item.label
              }
            })
          }
          options.push(option)
        }
        return options
      }
    }
  },
}
</script>

<style lang="stylus">

</style>
