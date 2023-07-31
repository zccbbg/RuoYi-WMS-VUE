<template>
  <merge-table :table-data="tableData" :merge-arr="mergeArr">
    <el-table-column
      prop="warehouseName"
      label="仓库/库区"
    >
      <template v-slot="{ row }">

        <span>{{ row.warehouseName }}</span>

        <el-popover
          v-if="!row.warehouseDelFlag"
          placement="top-start"
          title="提示"
          width="200"
          trigger="hover"
          content="该物料未分配仓库/库区。">
          <a slot="reference" class="el-icon-question blue" @click="deleteItem(row)">分配</a>
        </el-popover>

        <el-popover
          v-if="row.warehouseDelFlag"
          placement="top-start"
          title="提示"
          width="200"
          trigger="hover"
          content="该仓库已经被逻辑删除。">
          <a slot="reference" class="el-icon-question red" @click="deleteItem(row)">删除</a>
        </el-popover>
      </template>


    </el-table-column>

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
  name: 'PanelByWarehouse',
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
      mergeArr: ['warehouseName'], // 表格中的列名
    }
  },
  methods: {
    deleteItem(row) {
      console.log('该物料未分配仓库/库区。', row)
      this.$message({
        message: '该功能暂未开放',
        type: 'warning'
      });
    }
  }
}
</script>
