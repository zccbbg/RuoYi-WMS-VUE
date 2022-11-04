<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="库存移动Id" prop="inventoryMovementId">
        <el-input
          v-model="queryParams.inventoryMovementId"
          placeholder="请输入库存移动Id"
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
          v-hasPermi="['wms:inventoryMovementDetail:add']"
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
          v-hasPermi="['wms:inventoryMovementDetail:edit']"
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
          v-hasPermi="['wms:inventoryMovementDetail:remove']"
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
          v-hasPermi="['wms:inventoryMovementDetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsInventoryMovementDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="库存移动Id" align="center" prop="inventoryMovementId" v-if="columns[0].visible"/>
      <el-table-column label="物料" align="center" prop="itemId" v-if="columns[1].visible"/>
      <el-table-column label="计划数量" align="center" prop="planQuantity" v-if="columns[2].visible"/>
      <el-table-column label="实际数量" align="center" prop="realQuantity" v-if="columns[3].visible"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[4].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:inventoryMovementDetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:inventoryMovementDetail:remove']"
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

    <!-- 添加或修改库存移动详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="库存移动Id" prop="inventoryMovementId">
          <el-input v-model="form.inventoryMovementId" placeholder="请输入库存移动Id" />
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
import { listWmsInventoryMovementDetail, getWmsInventoryMovementDetail, delWmsInventoryMovementDetail, addWmsInventoryMovementDetail, updateWmsInventoryMovementDetail, exportWmsInventoryMovementDetail } from "@/api/wms/inventoryMovementDetail";

export default {
  name: "WmsInventoryMovementDetail",
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
      // 库存移动详情表格数据
      wmsInventoryMovementDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inventoryMovementId: null,
        itemId: null,
        planQuantity: null,
        realQuantity: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "库存移动Id", visible:  true  },
            { key: 2, label: "物料", visible:  true  },
            { key: 3, label: "计划数量", visible:  true  },
            { key: 4, label: "实际数量", visible:  true  },
                { key: 6, label: "备注", visible:  true  },
                         ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库存移动详情列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsInventoryMovementDetail(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsInventoryMovementDetailList = content;
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
        inventoryMovementId: null,
        itemId: null,
        planQuantity: null,
        realQuantity: null,
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
      this.title = "添加库存移动详情";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsInventoryMovementDetail(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改库存移动详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsInventoryMovementDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsInventoryMovementDetail(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库存移动详情编号为"' + ids + '"的数据项？').then(function() {
        return delWmsInventoryMovementDetail(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有库存移动详情数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsInventoryMovementDetail(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
