<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="编号" prop="inventoryMovementNo">
        <el-input
          v-model="queryParams.inventoryMovementNo"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原货架Id" prop="sourceRackId">
        <el-input
          v-model="queryParams.sourceRackId"
          placeholder="请输入原货架Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标货架" prop="targetRackId">
        <el-input
          v-model="queryParams.targetRackId"
          placeholder="请输入目标货架"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="checkStatus">
        <el-select v-model="queryParams.checkStatus" placeholder="请选择审核状态" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="checkUserId">
        <el-input
          v-model="queryParams.checkUserId"
          placeholder="请输入审核人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核时间" prop="checkTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.checkTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择审核时间">
        </el-date-picker>
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
          v-hasPermi="['wms:wmsInventoryMovement:add']"
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
          v-hasPermi="['wms:wmsInventoryMovement:edit']"
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
          v-hasPermi="['wms:wmsInventoryMovement:remove']"
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
          v-hasPermi="['wms:wmsInventoryMovement:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wmsInventoryMovementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="inventoryMovementNo" v-if="columns[0].visible"/>
      <el-table-column label="原货架Id" align="center" prop="sourceRackId" v-if="columns[1].visible"/>
      <el-table-column label="目标货架" align="center" prop="targetRackId" v-if="columns[2].visible"/>
      <el-table-column label="状态" align="center" prop="status" v-if="columns[3].visible"/>
      <el-table-column label="审核状态" align="center" prop="checkStatus" v-if="columns[4].visible"/>
      <el-table-column label="审核人" align="center" prop="checkUserId" v-if="columns[5].visible"/>
      <el-table-column label="审核时间" align="center" prop="checkTime" width="180" v-if="columns[6].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.checkTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[7].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:wmsInventoryMovement:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:wmsInventoryMovement:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改库存移动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="编号" prop="inventoryMovementNo">
          <el-input v-model="form.inventoryMovementNo" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="原货架Id" prop="sourceRackId">
          <el-input v-model="form.sourceRackId" placeholder="请输入原货架Id" />
        </el-form-item>
        <el-form-item label="目标货架" prop="targetRackId">
          <el-input v-model="form.targetRackId" placeholder="请输入目标货架" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="form.checkStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核人" prop="checkUserId">
          <el-input v-model="form.checkUserId" placeholder="请输入审核人" />
        </el-form-item>
        <el-form-item label="审核时间" prop="checkTime">
          <el-date-picker clearable size="small"
                        v-model="form.checkTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择审核时间">
          </el-date-picker>
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
import { listWmsInventoryMovement, getWmsInventoryMovement, delWmsInventoryMovement, addWmsInventoryMovement, updateWmsInventoryMovement, exportWmsInventoryMovement } from "@/api/wms/inventoryMovement";

export default {
  name: "WmsInventoryMovement",
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
        sourceRackId: null,
        targetRackId: null,
        status: null,
        checkStatus: null,
        checkUserId: null,
        checkTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "编号", visible:  true  },
            { key: 2, label: "原货架Id", visible:  true  },
            { key: 3, label: "目标货架", visible:  true  },
            { key: 4, label: "状态", visible:  true  },
            { key: 5, label: "审核状态", visible:  true  },
            { key: 6, label: "审核人", visible:  true  },
            { key: 7, label: "审核时间", visible:  true  },
            { key: 8, label: "备注", visible:  true  },
                             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库存移动列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsInventoryMovement(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsInventoryMovementList = content;
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
        inventoryMovementNo: null,
        sourceRackId: null,
        targetRackId: null,
        status: 0,
        checkStatus: 0,
        checkUserId: null,
        checkTime: null,
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
      this.title = "添加库存移动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsInventoryMovement(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改库存移动";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsInventoryMovement(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsInventoryMovement(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库存移动编号为"' + ids + '"的数据项？').then(function() {
        return delWmsInventoryMovement(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
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
      }).catch(() => {});
    }
  }
};
</script>
