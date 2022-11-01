<template lang="pug">
  .item-select-wrapper
    el-select(
      v-model="value1"
      filterable
      remote
      clearable
      :remote-method="doSearch"
      :loading="loading"
      :size="size"
      )
      el-option(
        v-for="item in options"
        :key="item.id"
        :label="item.itemName"
        :value="item.id"
      )
        div {{item.itemName}}
        .info {{item.itemNo}}
</template>

<script>
import { listWmsItem } from '@/api/wms/item'

export default {
  name: 'ItemSelect',
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      options: [],
      loading: false
    }
  },
  computed: {
    value1: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  created() {
    this.doSearch();
  },
  methods: {
    doSearch(search) {
      listWmsItem({search}, {page: 0, size: 20}).then(res => {
        const { content, totalElements } = res
        this.options = content
      })
    }
  }
}
</script>

<style lang="stylus">

</style>
