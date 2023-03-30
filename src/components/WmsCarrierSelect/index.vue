<template>
  <el-select placeholder="请选择承运商" clearable v-model=" carrier">
    <el-option
      v-for="customer in carrierList"
      :key="customer.id"
      :label="customer.carrierName"
      :value="customer.id"
    ></el-option>
  </el-select>
</template>
<script>
import {mapGetters} from 'vuex';

export default {
  props: ['value', 'size'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['carrierList']),
    carrier: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      }
    }
  },
  created() {
  },
  methods: {}
}
</script>
