<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="wmsWarehouseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="仓库编号" align="center" prop="warehouseNo" v-if="columns[0].visible"/>
      <el-table-column label="仓库名称" align="center" prop="warehouseName" v-if="columns[1].visible"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[2].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:wmsWarehouse:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:wmsWarehouse:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
import { listWmsWarehouse, getWmsWarehouse, delWmsWarehouse, addWmsWarehouse, updateWmsWarehouse, exportWmsWarehouse } from "@/api/wms/warehouse";

export default {
  name: "WmsWarehouse",
  data(){
    return{
      // 遮罩层
      loading: true,
      // 仓库表格数据
      wmsWarehouseList: [],
      // 总条数
      total: 0,
      columns: [
            { key: 1, label: "仓库编号", visible:  true  },
            { key: 2, label: "仓库名称", visible:  true  },
                { key: 4, label: "备注", visible:  true  },
                         ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseNo: null,
        warehouseName: null,

    },
  }
  },
  created() {
    this.getList();
    },
  methods:{
    /** 查询仓库列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsWarehouse(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsWarehouseList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsWarehouse(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改仓库";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除仓库编号为"' + ids + '"的数据项？').then(function() {
        return delWmsWarehouse(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
  }
}

</script>

<style>

</style>

