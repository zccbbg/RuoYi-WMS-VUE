<template>
  <el-select placeholder="请选择客户" clearable v-model="customer">
    <el-option
      v-for="customer in customerList"
      :key="customer.id"
      :label="customer.customerName"
      :value="customer.id"
    ></el-option>
  </el-select>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: ['value','size'],
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['customerList']),
    customer: {
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
  methods: {
  }
}
</script>
