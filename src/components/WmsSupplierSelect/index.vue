<template>
  <el-select placeholder="请选择供应商" clearable v-model="supplier">
      <el-option
            v-for="supplier in wmsSupplierList"
            :key="supplier.id"
            :label="supplier.supplierName"
            :value="supplier.id"
          ></el-option>
  </el-select>
</template>
<script>
import { listWmsSupplier} from '@/api/wms/supplier'
export default {
  props: ['value','size'],
  data() {
    return {
      wmsSupplierList: [],
    }
  },
  computed: {
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
    this.getSupplierList();
  },
  methods: {
    getSupplierList(){
      listWmsSupplier({},{page:0,size:1000}).then(response => {
        const { content } = response
        this.wmsSupplierList = content;
      });
    },
  }
}
</script>
