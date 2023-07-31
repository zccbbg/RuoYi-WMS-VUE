<template>
  <merge-table :table-data="tableData" :merge-arr="['itemNo']">
    <el-table-column
      prop="itemNo"
      label="物料信息"
    >
      <template v-slot="{ row }">
        <el-row>
          <el-col :span="12">
            <span>名称：{{ row.itemName }}</span>
          </el-col>
          <el-col :span="12">
            <span>编码：{{ row.itemNo }}</span>
          </el-col>
        </el-row>
        <span>类型：{{ row.itemTypeName }}</span>
        <el-popover
          placement="top-start"
          title="提示"
          width="200"
          trigger="hover"
          content="该物料已经被逻辑删除。">
          <i slot="reference" class="el-icon-question red"></i>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="warehouseName"
      label="仓库/库区"
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
  name: 'PanelByItem',
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
  }
}
</script>
