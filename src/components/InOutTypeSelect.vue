<template lang="pug">
  .item-select-wrapper
    el-select(
      v-model="value1"
      clearable
      :size="size"
    )
      el-option(
        v-for="item in opTypes"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      )
        div {{item.label}}
</template>

<script>


import { mapGetters } from 'vuex'

let optionsCache = null
export default {
  name: 'InOutTypeSelect',
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
    }
  },
  computed: {
    ...mapGetters(['opTypes']),
    value1: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
}
</script>

<style lang="stylus">

</style>
