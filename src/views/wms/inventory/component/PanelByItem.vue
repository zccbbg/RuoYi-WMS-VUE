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
        <el-row>
          <el-col :span="12">
            <span>类型：{{ row.itemTypeName }}</span>
          </el-col>
          <el-col :span="12" v-if="row.itemDelFlag">
            <el-popconfirm
              placement="top-start"
              icon="el-icon-info"
              icon-color="red"
              width="200"
              trigger="hover"
              @confirm="deleteItem(row)"
              title="该物料已经被逻辑删除，是否清除库存记录？">
              <a slot="reference" class="el-icon-question red" >删除</a>
            </el-popconfirm>
          </el-col>
        </el-row>

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
  },
  methods: {
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
