<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="出库单" prop="shipmentOrderId">
        <el-input
          v-model="queryParams.shipmentOrderId"
          placeholder="请输入出库单"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料" prop="itemId">
        <el-input
          v-model="queryParams.itemId"
          placeholder="请输入物料"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划数量" prop="planQuantity">
        <el-input
          v-model="queryParams.planQuantity"
          placeholder="请输入计划数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际数量" prop="realQuantity">
        <el-input
          v-model="queryParams.realQuantity"
          placeholder="请输入实际数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货架" prop="rackId">
        <el-input
          v-model="queryParams.rackId"
          placeholder="请输入货架"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['wms:shipmentOrderDetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wms:shipmentOrderDetail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wms:shipmentOrderDetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['wms:shipmentOrderDetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsShipmentOrderDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="出库单" align="center" prop="shipmentOrderId" v-if="columns[0].visible"/>
      <el-table-column label="物料" align="center" prop="itemId" v-if="columns[1].visible"/>
      <el-table-column label="计划数量" align="center" prop="planQuantity" v-if="columns[2].visible"/>
      <el-table-column label="实际数量" align="center" prop="realQuantity" v-if="columns[3].visible"/>
      <el-table-column label="货架" align="center" prop="rackId" v-if="columns[4].visible"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[5].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:shipmentOrderDetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:shipmentOrderDetail:remove']"
          >删除</el-button>
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

    <!-- 添加或修改出库单详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="出库单" prop="shipmentOrderId">
          <el-input v-model="form.shipmentOrderId" placeholder="请输入出库单" />
        </el-form-item>
        <el-form-item label="物料" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料" />
        </el-form-item>
        <el-form-item label="计划数量" prop="planQuantity">
          <el-input v-model="form.planQuantity" placeholder="请输入计划数量" />
        </el-form-item>
        <el-form-item label="实际数量" prop="realQuantity">
          <el-input v-model="form.realQuantity" placeholder="请输入实际数量" />
        </el-form-item>
        <el-form-item label="货架" prop="rackId">
          <el-input v-model="form.rackId" placeholder="请输入货架" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWmsShipmentOrderDetail, getWmsShipmentOrderDetail, delWmsShipmentOrderDetail, addWmsShipmentOrderDetail, updateWmsShipmentOrderDetail, exportWmsShipmentOrderDetail } from "@/api/wms/shipmentOrderDetail";

export default {
  name: "WmsShipmentOrderDetail",
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
      // 出库单详情表格数据
      wmsShipmentOrderDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shipmentOrderId: null,
        itemId: null,
        planQuantity: null,
        realQuantity: null,
        rackId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "出库单", visible:  true  },
            { key: 2, label: "物料", visible:  true  },
            { key: 3, label: "计划数量", visible:  true  },
            { key: 4, label: "实际数量", visible:  true  },
            { key: 5, label: "货架", visible:  true  },
                { key: 7, label: "备注", visible:  true  },
                         ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询出库单详情列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsShipmentOrderDetail(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsShipmentOrderDetailList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        shipmentOrderId: null,
        itemId: null,
        planQuantity: null,
        realQuantity: null,
        rackId: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加出库单详情";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsShipmentOrderDetail(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改出库单详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsShipmentOrderDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsShipmentOrderDetail(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除出库单详情编号为"' + ids + '"的数据项？').then(function() {
        return delWmsShipmentOrderDetail(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有出库单详情数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsShipmentOrderDetail(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
