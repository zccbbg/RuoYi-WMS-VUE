<template>
  <merge-table :table-data="tableData" :merge-arr="mergeArr">
    <el-table-column
      prop="warehouseName"
      label="仓库"
    ></el-table-column>
    <el-table-column
      prop="areaName"
      label="库区"
    ></el-table-column>

    <el-table-column
      prop="itemTypeName"
      label="物料类型"
    >
    </el-table-column>
    <el-table-column
      prop="itemNo"
      label="物料编码"
    ></el-table-column>
    <el-table-column
      prop="itemName"
      label="物料名称"
    ></el-table-column>

    <el-table-column
      prop="quantity"
      label="库存"
    ></el-table-column>
  </merge-table>
</template>

<script>
import MergeTable from "@/views/wms/inventory/component/MergeTable.vue";

export default {
  name: 'PanelByArea',
  components: {MergeTable},
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    // loading: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      mergeArr: ['warehouseName', 'areaName','itemTypeName'], // 表格中的列名
    }
  }
}
</script>
