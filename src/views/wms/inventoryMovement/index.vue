<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
             class="ry_form">
      <el-form-item label="移库状态" prop="status">
        <DictRadio v-model="queryParams.status" @change="handleQuery" size="small"
                   :radioData="dict.type.wms_movement_status" :showAll="'all'"/>
      </el-form-item>
      <el-form-item label="编号" prop="inventoryMovementNo">
        <el-input
          v-model="queryParams.inventoryMovementNo"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wms:inventoryMovement:add']"
        >创建移库单
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsInventoryMovementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="inventoryMovementNo" v-if="columns[0].visible"/>
      <el-table-column label="状态" align="center" prop="status" v-if="columns[1].visible">
        <template slot-scope="scope">
          <el-tag size="medium" effect="plain" :type="getStatusTag(scope.row)">
            {{ getStatus(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="createTime" width="180" v-if="columns[2].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[3].visible">
        <template v-slot="{ row }">
          <el-popover placement="left" width="300" trigger="hover" :content="row.remark" popper-class="popperOptions">
            <p class="showOverTooltip" slot="reference">{{ row.remark }}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="物料" align="center" prop="remark" v-if="columns[4].visible">
        <template slot-scope="scope">
          <p>物料品种数量：{{ scope.row.detailCount }}</p>
          <p>物料总数量：{{ scope.row.itemCount }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="{ row }">
          <el-button
            v-if="21 === row.status"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleUpdate(row)"
            v-hasPermi="['wms:inventoryMovement:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="handleDelete(row)"
            v-hasPermi="['wms:inventoryMovement:remove']"
          >删除
          </el-button>
          <el-button
            v-if="row.detailCount"
            size="mini"
            type="text"
            icon="el-icon-truck"
            @click.stop="handleStatus(row)"
            v-hasPermi="['wms:inventoryMovement:status']"
          >移库
          </el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  listWmsInventoryMovement,
  delWmsInventoryMovement,
  exportWmsInventoryMovement
} from "@/api/wms/inventoryMovement";
import {mapGetters} from "vuex";

export default {
  name: "WmsInventoryMovement",
  dicts: ['wms_movement_status'],
  computed: {
    ...mapGetters(['warehouseMap', 'areaMap', 'rackMap']),
    statusMap() {
      let obj = this.dict.type.wms_movement_status.map(item => [item.value, item.label])
      let map = new Map(obj)
      return map
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 库存移动表格数据
      wmsInventoryMovementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inventoryMovementNo: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      columns: [
        {key: 1, label: "编号", visible: true},
        {key: 2, label: "状态", visible: true},
        {key: 3, label: "下单时间", visible: true},
        {key: 4, label: "备注", visible: true},
        {key: 5, label: "物料", visible: true},
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getStatusTag(row) {
      switch (row.status) {
        case 21:
          return "info";
        case 22:
          return "warning";
        case 24:
          return "danger";
        case 23:
          return "success";
      }
    },
    getStatus(row) {
      return this.statusMap.get(row.status + "")
    },
    /** 查询库存移动列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsInventoryMovement(query, pageReq).then(response => {
        const {content, totalElements} = response
        this.wmsInventoryMovementList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({path: "/wms/inventoryMovement/edit"});
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      this.$router.push({path: "/wms/inventoryMovement/edit", query: {id}});
    },
    handleStatus(row) {
      const id = row.id || this.ids
      this.$router.push({path: "/wms/inventoryMovement/status", query: {id}});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const inventoryMovementNo = row.inventoryMovementNo
      this.$modal.confirm('是否确认删除库存移动编号为"' + inventoryMovementNo + '"的数据项？').then(function () {
        return delWmsInventoryMovement(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有库存移动数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsInventoryMovement(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {
      });
    }
  }
};
</script>
<style lang="stylus">
.popperOptions[x-placement^=left] .popper__arrow::after {
  border-left-color: #565D6B;
}

.popperOptions[x-placement^=right] .popper__arrow::after {
  border-right-color: #565D6B;
}

.popperOptions[x-placement^=bottom] .popper__arrow::after {
  border-bottom-color: #565D6B;
}

.popperOptions[x-placement^=top] .popper__arrow::after {
  border-top-color: #565D6B;
}

.popperOptions {
  background-color: #565D6B;
  color: #FFFFFF;
  border: #565D6B;
}
</style>
