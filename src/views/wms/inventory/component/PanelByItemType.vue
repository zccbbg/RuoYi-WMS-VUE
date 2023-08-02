<template>
  <merge-table :table-data="tableData" :merge-arr="mergeArr">
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
    >
      <template v-slot="{ row }">


        <span>{{ row.itemName }}</span>

        <el-popconfirm
          v-if="row.itemDelFlag"
          placement="top-start"
          icon="el-icon-info"
          icon-color="red"
          width="200"
          class="ml10"
          trigger="hover"
          @confirm="deleteItem(row)"
          title="该物料已经被逻辑删除，是否清除库存记录？">
          <a slot="reference" class="el-icon-question red">删除</a>
        </el-popconfirm>

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
import {delWmsInventoryByItem} from "@/api/wms/inventory";

export default {
  name: 'PanelByItemType',
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
      mergeArr: ['itemTypeName', 'itemNo', 'itemName'], // 表格中的列名
    }
  }, methods: {
    deleteItem(row) {
      delWmsInventoryByItem(row.itemId).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.$emit('update', row)
      })
    }
  }
}
</script>
