<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="库存盘点单号，系统自动生成" prop="inventoryCheckNo">
        <el-input
          v-model="queryParams.inventoryCheckNo"
          placeholder="请输入库存盘点单号，系统自动生成"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库存盘点类型" prop="inventoryCheckType">
        <el-select v-model="queryParams.inventoryCheckType" placeholder="请选择库存盘点类型" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="库存盘点单状态11：盘点中 22：已完成" prop="inventoryCheckStatus">
        <el-select v-model="queryParams.inventoryCheckStatus" placeholder="请选择库存盘点单状态11：盘点中 22：已完成" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="盈亏数" prop="inventoryCheckTotal">
        <el-input
          v-model="queryParams.inventoryCheckTotal"
          placeholder="请输入盈亏数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <template v-if="showMoreCondition">
      <el-form-item label="所属仓库" prop="warehouseId">
        <el-input
          v-model="queryParams.warehouseId"
          placeholder="请输入所属仓库"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属库区" prop="areaId">
        <el-input
          v-model="queryParams.areaId"
          placeholder="请输入所属库区"
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
      <el-form-item label="附件文件" prop="attachment">
        <el-input
          v-model="queryParams.attachment"
          placeholder="请输入附件文件"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    </template>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini" @click="showMoreCondition = !showMoreCondition">{{showMoreCondition ? '收起条件' : '展开条件'}}</el-button>
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
          v-hasPermi="['wms:wmsInventoryCheck:add']"
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
          v-hasPermi="['wms:wmsInventoryCheck:edit']"
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
          v-hasPermi="['wms:wmsInventoryCheck:remove']"
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
          v-hasPermi="['wms:wmsInventoryCheck:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsInventoryCheckList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="库存盘点单号，系统自动生成" align="center" prop="inventoryCheckNo" v-if="columns[0].visible"/>
      <el-table-column label="库存盘点类型" align="center" prop="inventoryCheckType" v-if="columns[1].visible"/>
      <el-table-column label="库存盘点单状态11：盘点中 22：已完成" align="center" prop="inventoryCheckStatus" v-if="columns[2].visible"/>
      <el-table-column label="盈亏数" align="center" prop="inventoryCheckTotal" v-if="columns[3].visible"/>
      <el-table-column label="审核状态" align="center" prop="checkStatus" v-if="columns[4].visible"/>
      <el-table-column label="审核人" align="center" prop="checkUserId" v-if="columns[5].visible"/>
      <el-table-column label="审核时间" align="center" prop="checkTime" width="180" v-if="columns[6].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.checkTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属仓库" align="center" prop="warehouseId" v-if="columns[7].visible"/>
      <el-table-column label="所属库区" align="center" prop="areaId" v-if="columns[8].visible"/>
      <el-table-column label="货架" align="center" prop="rackId" v-if="columns[9].visible"/>
      <el-table-column label="附件文件" align="center" prop="attachment" v-if="columns[10].visible"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[11].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:wmsInventoryCheck:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:wmsInventoryCheck:remove']"
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

    <!-- 添加或修改库存盘点单据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="库存盘点单号，系统自动生成" prop="inventoryCheckNo">
          <el-input v-model="form.inventoryCheckNo" placeholder="请输入库存盘点单号，系统自动生成" />
        </el-form-item>
        <el-form-item label="库存盘点类型" prop="inventoryCheckType">
          <el-select v-model="form.inventoryCheckType" placeholder="请选择库存盘点类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存盘点单状态11：盘点中 22：已完成">
          <el-radio-group v-model="form.inventoryCheckStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="盈亏数" prop="inventoryCheckTotal">
          <el-input v-model="form.inventoryCheckTotal" placeholder="请输入盈亏数" />
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
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入所属仓库" />
        </el-form-item>
        <el-form-item label="所属库区" prop="areaId">
          <el-input v-model="form.areaId" placeholder="请输入所属库区" />
        </el-form-item>
        <el-form-item label="货架" prop="rackId">
          <el-input v-model="form.rackId" placeholder="请输入货架" />
        </el-form-item>
        <el-form-item label="附件文件" prop="attachment">
          <el-input v-model="form.attachment" placeholder="请输入附件文件" />
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
import { listWmsInventoryCheck, getWmsInventoryCheck, delWmsInventoryCheck, addWmsInventoryCheck, updateWmsInventoryCheck, exportWmsInventoryCheck } from "@/api/wms/inventoryCheck";

export default {
  name: "WmsInventoryCheck",
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
      // 库存盘点单据表格数据
      wmsInventoryCheckList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inventoryCheckNo: null,
        inventoryCheckType: null,
        inventoryCheckStatus: null,
        inventoryCheckTotal: null,
        checkStatus: null,
        checkUserId: null,
        checkTime: null,
        warehouseId: null,
        areaId: null,
        rackId: null,
        attachment: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "库存盘点单号，系统自动生成", visible:  true  },
            { key: 2, label: "库存盘点类型", visible:  true  },
            { key: 3, label: "库存盘点单状态11：盘点中 22：已完成", visible:  true  },
            { key: 4, label: "盈亏数", visible:  true  },
            { key: 5, label: "审核状态", visible:  true  },
            { key: 6, label: "审核人", visible:  true  },
            { key: 7, label: "审核时间", visible:  true  },
            { key: 8, label: "所属仓库", visible:  true  },
            { key: 9, label: "所属库区", visible:  true  },
            { key: 10, label: "货架", visible:  false  },
            { key: 11, label: "附件文件", visible:  false  },
            { key: 12, label: "备注", visible:  false  },
                             ],
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库存盘点单据列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsInventoryCheck(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsInventoryCheckList = content;
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
        inventoryCheckNo: null,
        inventoryCheckType: null,
        inventoryCheckStatus: 0,
        inventoryCheckTotal: null,
        checkStatus: 0,
        checkUserId: null,
        checkTime: null,
        warehouseId: null,
        areaId: null,
        rackId: null,
        attachment: null,
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
      this.title = "添加库存盘点单据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsInventoryCheck(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改库存盘点单据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsInventoryCheck(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsInventoryCheck(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库存盘点单据编号为"' + ids + '"的数据项？').then(function() {
        return delWmsInventoryCheck(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有库存盘点单据数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsInventoryCheck(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
