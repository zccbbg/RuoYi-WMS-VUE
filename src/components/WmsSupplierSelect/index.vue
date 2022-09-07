<template>
  <el-select placeholder="请选择供应商" clearable v-model="supplier">
      <el-option
            v-for="supplier in supplierList"
            :key="supplier.id"
            :label="supplier.supplierName"
            :value="supplier.id"
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
    ...mapGetters(['supplierList']),
    supplier: {
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
