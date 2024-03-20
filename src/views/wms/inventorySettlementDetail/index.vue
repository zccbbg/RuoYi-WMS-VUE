<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
             class="ry_form">
      <el-form-item label="结算单id" prop="settlementId">
        <el-input
          v-model="queryParams.settlementId"
          placeholder="请输入结算单id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算类型,1:月结，2:年结" prop="settlementType">
        <el-select v-model="queryParams.settlementType" placeholder="请选择结算类型,1:月结，2:年结" clearable
                   size="small">
          <el-option label="请选择字典生成" value=""/>
        </el-select>
      </el-form-item>
      <el-form-item label="物料id" prop="itemId">
        <el-input
          v-model="queryParams.itemId"
          placeholder="请输入物料id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编号" prop="itemNo">
        <el-input
          v-model="queryParams.itemNo"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库id" prop="warehouseId">
        <el-input
          v-model="queryParams.warehouseId"
          placeholder="请输入仓库id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库编号" prop="warehouseNo">
        <el-input
          v-model="queryParams.warehouseNo"
          placeholder="请输入仓库编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <template v-if="showMoreCondition">
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input
            v-model="queryParams.warehouseName"
            placeholder="请输入仓库名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="库区id" prop="areaId">
          <el-input
            v-model="queryParams.areaId"
            placeholder="请输入库区id"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="库区编号" prop="areaNo">
          <el-input
            v-model="queryParams.areaNo"
            placeholder="请输入库区编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="库区名称" prop="areaName">
          <el-input
            v-model="queryParams.areaName"
            placeholder="请输入库区名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="上期结存" prop="previousBalance">
          <el-input
            v-model="queryParams.previousBalance"
            placeholder="请输入上期结存"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="本期入库" prop="currentEnter">
          <el-input
            v-model="queryParams.currentEnter"
            placeholder="请输入本期入库"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="本期出库" prop="currentOut">
          <el-input
            v-model="queryParams.currentOut"
            placeholder="请输入本期出库"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="本期盘点" prop="currentCheck">
          <el-input
            v-model="queryParams.currentCheck"
            placeholder="请输入本期盘点"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="本期结存" prop="currentBalance">
          <el-input
            v-model="queryParams.currentBalance"
            placeholder="请输入本期结存"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </template>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini"
                   @click="showMoreCondition = !showMoreCondition">{{ showMoreCondition ? '收起条件' : '展开条件' }}
        </el-button>
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
          v-hasPermi="['wms:inventorySettlementDetail:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wms:inventorySettlementDetail:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wms:inventorySettlementDetail:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['wms:inventorySettlementDetail:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsInventorySettlementDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="结算单id" align="center" prop="settlementId" v-if="columns[0].visible"/>
      <el-table-column label="结算类型,1:月结，2:年结" align="center" prop="settlementType" v-if="columns[1].visible"/>
      <el-table-column label="物料id" align="center" prop="itemId" v-if="columns[2].visible"/>
      <el-table-column label="编号" align="center" prop="itemNo" v-if="columns[3].visible"/>
      <el-table-column label="名称" align="center" prop="itemName" v-if="columns[4].visible"/>
      <el-table-column label="仓库id" align="center" prop="warehouseId" v-if="columns[5].visible"/>
      <el-table-column label="仓库编号" align="center" prop="warehouseNo" v-if="columns[6].visible"/>
      <el-table-column label="仓库名称" align="center" prop="warehouseName" v-if="columns[7].visible"/>
      <el-table-column label="库区id" align="center" prop="areaId" v-if="columns[8].visible"/>
      <el-table-column label="库区编号" align="center" prop="areaNo" v-if="columns[9].visible"/>
      <el-table-column label="库区名称" align="center" prop="areaName" v-if="columns[10].visible"/>
      <el-table-column label="上期结存" align="center" prop="previousBalance" v-if="columns[11].visible"/>
      <el-table-column label="本期入库" align="center" prop="currentEnter" v-if="columns[12].visible"/>
      <el-table-column label="本期出库" align="center" prop="currentOut" v-if="columns[13].visible"/>
      <el-table-column label="本期盘点" align="center" prop="currentCheck" v-if="columns[14].visible"/>
      <el-table-column label="本期结存" align="center" prop="currentBalance" v-if="columns[15].visible"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[16].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:inventorySettlementDetail:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:inventorySettlementDetail:remove']"
          >删除
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

    <!-- 添加或修改库存结算明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="结算单id" prop="settlementId">
          <el-input v-model="form.settlementId" placeholder="请输入结算单id"/>
        </el-form-item>
        <el-form-item label="结算类型,1:月结，2:年结" prop="settlementType">
          <el-select v-model="form.settlementType" placeholder="请选择结算类型,1:月结，2:年结">
            <el-option label="请选择字典生成" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item label="物料id" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料id"/>
        </el-form-item>
        <el-form-item label="编号" prop="itemNo">
          <el-input v-model="form.itemNo" placeholder="请输入编号"/>
        </el-form-item>
        <el-form-item label="名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="仓库id" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入仓库id"/>
        </el-form-item>
        <el-form-item label="仓库编号" prop="warehouseNo">
          <el-input v-model="form.warehouseNo" placeholder="请输入仓库编号"/>
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入仓库名称"/>
        </el-form-item>
        <el-form-item label="库区id" prop="areaId">
          <el-input v-model="form.areaId" placeholder="请输入库区id"/>
        </el-form-item>
        <el-form-item label="库区编号" prop="areaNo">
          <el-input v-model="form.areaNo" placeholder="请输入库区编号"/>
        </el-form-item>
        <el-form-item label="库区名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入库区名称"/>
        </el-form-item>
        <el-form-item label="上期结存" prop="previousBalance">
          <el-input v-model="form.previousBalance" placeholder="请输入上期结存"/>
        </el-form-item>
        <el-form-item label="本期入库" prop="currentEnter">
          <el-input v-model="form.currentEnter" placeholder="请输入本期入库"/>
        </el-form-item>
        <el-form-item label="本期出库" prop="currentOut">
          <el-input v-model="form.currentOut" placeholder="请输入本期出库"/>
        </el-form-item>
        <el-form-item label="本期盘点" prop="currentCheck">
          <el-input v-model="form.currentCheck" placeholder="请输入本期盘点"/>
        </el-form-item>
        <el-form-item label="本期结存" prop="currentBalance">
          <el-input v-model="form.currentBalance" placeholder="请输入本期结存"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
import {
  listWmsInventorySettlementDetail,
  getWmsInventorySettlementDetail,
  delWmsInventorySettlementDetail,
  addWmsInventorySettlementDetail,
  updateWmsInventorySettlementDetail,
  exportWmsInventorySettlementDetail
} from "@/api/wms/inventorySettlementDetail";

export default {
  name: "WmsInventorySettlementDetail",
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
      // 库存结算明细表格数据
      wmsInventorySettlementDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        settlementId: null,
        settlementType: null,
        itemId: null,
        itemNo: null,
        itemName: null,
        warehouseId: null,
        warehouseNo: null,
        warehouseName: null,
        areaId: null,
        areaNo: null,
        areaName: null,
        previousBalance: null,
        currentEnter: null,
        currentOut: null,
        currentCheck: null,
        currentBalance: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        settlementId: [
          {required: true, message: "结算单id不能为空", trigger: "blur"}
        ],
        itemId: [
          {required: true, message: "物料id不能为空", trigger: "blur"}
        ],
        itemNo: [
          {required: true, message: "编号不能为空", trigger: "blur"}
        ],
        itemName: [
          {required: true, message: "名称不能为空", trigger: "blur"}
        ],
        warehouseId: [
          {required: true, message: "仓库id不能为空", trigger: "blur"}
        ],
        warehouseNo: [
          {required: true, message: "仓库编号不能为空", trigger: "blur"}
        ],
        warehouseName: [
          {required: true, message: "仓库名称不能为空", trigger: "blur"}
        ],
        areaId: [
          {required: true, message: "库区id不能为空", trigger: "blur"}
        ],
        areaNo: [
          {required: true, message: "库区编号不能为空", trigger: "blur"}
        ],
        areaName: [
          {required: true, message: "库区名称不能为空", trigger: "blur"}
        ],
      },
      columns: [
        {key: 1, label: "结算单id", visible: true},
        {key: 2, label: "结算类型,1:月结，2:年结", visible: true},
        {key: 3, label: "物料id", visible: true},
        {key: 4, label: "编号", visible: true},
        {key: 5, label: "名称", visible: true},
        {key: 6, label: "仓库id", visible: true},
        {key: 7, label: "仓库编号", visible: true},
        {key: 8, label: "仓库名称", visible: true},
        {key: 9, label: "库区id", visible: true},
        {key: 10, label: "库区编号", visible: false},
        {key: 11, label: "库区名称", visible: false},
        {key: 12, label: "上期结存", visible: false},
        {key: 13, label: "本期入库", visible: false},
        {key: 14, label: "本期出库", visible: false},
        {key: 15, label: "本期盘点", visible: false},
        {key: 16, label: "本期结存", visible: false},
        {key: 18, label: "备注", visible: false},
      ],
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库存结算明细列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsInventorySettlementDetail(query, pageReq).then(response => {
        const {content, totalElements} = response
        this.wmsInventorySettlementDetailList = content;
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
        settlementId: null,
        settlementType: null,
        itemId: null,
        itemNo: null,
        itemName: null,
        warehouseId: null,
        warehouseNo: null,
        warehouseName: null,
        areaId: null,
        areaNo: null,
        areaName: null,
        previousBalance: null,
        currentEnter: null,
        currentOut: null,
        currentCheck: null,
        currentBalance: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加库存结算明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsInventorySettlementDetail(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改库存结算明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsInventorySettlementDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsInventorySettlementDetail(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库存结算明细编号为"' + ids + '"的数据项？').then(function () {
        return delWmsInventorySettlementDetail(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有库存结算明细数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsInventorySettlementDetail(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {
      });
    }
  }
};
</script>
