<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="交易编号" prop="transactionCode">
        <el-input v-model="queryParams.transactionCode" placeholder="请输入交易编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="交易类型" prop="transactionType">
        <DictRadio v-model="queryParams.transactionType" @change="handleQuery" size="small"
                   :radioData="dict.type.wms_supplier_transaction_type" :showAll="'all'"/>
      </el-form-item>
      <el-form-item label="创建时间" prop="Time">
        <el-date-picker
          v-model="queryParams.Time"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          size="small"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          align="right"
          @change="handleChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <WmsTable v-loading="loading" :data="wmsSupplierTransactionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="交易编号" align="center" prop="transactionCode" v-if="columns[0].visible" />
      <el-table-column label="供应商" align="center" prop="supplierId" v-if="columns[1].visible">
        <template slot-scope="scope">
          {{ getSupplierName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="交易类型" align="center" prop="transactionType" v-if="columns[2].visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_supplier_transaction_type" :value="scope.row.transactionType" />
        </template>
      </el-table-column>
      <el-table-column label="交易金额" align="center" prop="transactionAmount" v-if="columns[3].visible">
        <template slot-scope="scope">
          <span style="color:red">{{scope.row.transactionType==11 ? "-":"+"}} {{scope.row.transactionAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="上期余额" align="center" prop="previousBalance" v-if="columns[4].visible" />
      <el-table-column label="当前余额" align="center" prop="currentBalance" v-if="columns[5].visible" />
      <el-table-column label="入库单号" align="center" prop="receiptOrderId" v-if="columns[6].visible" />
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[7].visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[8].visible" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="columns[9].visible">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:wmsSupplierTransaction:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['wms:wmsSupplierTransaction:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改供应商账户流水对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="交易编号" prop="transactionCode">
          <el-input v-model="form.transactionCode" placeholder="请输入交易编号" />
        </el-form-item>
        <el-form-item label="供应商编号" prop="supplierId">
          <el-input v-model="form.supplierId" placeholder="请输入供应商编号" />
        </el-form-item>
        <el-form-item label="交易类型" prop="transactionType">
          <el-radio-group v-model="form.transactionType">
            <el-radio
              v-for="dict in dict.type.wms_supplier_transaction_type"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="交易金额" prop="transactionAmount">
          <el-input v-model="form.transactionAmount" placeholder="请输入交易金额" />
        </el-form-item>
        <el-form-item label="上期余额" prop="previousBalance">
          <el-input v-model="form.previousBalance" placeholder="请输入上期余额" />
        </el-form-item>
        <el-form-item label="当前余额" prop="currentBalance">
          <el-input v-model="form.currentBalance" placeholder="请输入当前余额" />
        </el-form-item>
        <el-form-item label="入库单号" prop="receiptOrderId">
          <el-input v-model="form.receiptOrderId" placeholder="请输入入库单号" />
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
import { listWmsSupplierTransaction, getWmsSupplierTransaction, delWmsSupplierTransaction, addWmsSupplierTransaction, updateWmsSupplierTransaction, exportWmsSupplierTransaction } from "@/api/wms/supplierTransaction";
import { mapGetters } from "vuex";

export default {
  name: "WmsSupplierTransaction",
  dicts: ["wms_supplier_transaction_type"],
  computed: {
    ...mapGetters(['supplierMap']),
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
      // 供应商账户流水表格数据
      wmsSupplierTransactionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        transactionCode: null,
        supplierId: null,
        transactionType: null,
        transactionAmount: null,
        previousBalance: null,
        currentBalance: null,
        receiptOrderId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        transactionCode: [
          { required: true, message: "交易编号不能为空", trigger: "blur" }
        ],
        supplierId: [
          { required: true, message: "供应商编号不能为空", trigger: "blur" }
        ],
        transactionType: [
          { required: true, message: "交易类型  1：结款  2：应付 不能为空", trigger: "change" }
        ],
        transactionAmount: [
          { required: true, message: "交易金额不能为空", trigger: "blur" }
        ],
        previousBalance: [
          { required: true, message: "上期余额不能为空", trigger: "blur" }
        ],
        currentBalance: [
          { required: true, message: "当前余额不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      },
      columns: [
        { key: 1, label: "交易编号", visible: true },
        { key: 2, label: "供应商编号", visible: true },
        { key: 3, label: "交易类型  1：结款  2：应付 ", visible: true },
        { key: 4, label: "交易金额", visible: true },
        { key: 5, label: "上期余额", visible: true },
        { key: 6, label: "当前余额", visible: true },
        { key: 7, label: "入库单号", visible: false },
        { key: 8, label: "备注", visible: true },
        { key: 8, label: "创建时间", visible: true },
        { key: 9, label: "操作", visible: false },

      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      supplierId: null
    };
  },
  created() {
    const {id} = this.$route.query
    if (id) {
      this.supplierId = id
      this.getList(id)
    }
  },
  methods: {
    cellStyle(row,column,rowIndex,columnIndex){//根据报警级别显示颜色
      return 'color:red'
    },
    getSupplierName(row) {
      return this.supplierMap.get(Number(row.supplierId))
    },
    /** 查询供应商账户流水列表 */
    getList() {
      if (this.queryParams.Time){
        this.queryParams.startTime = this.queryParams.Time[0]
        this.queryParams.endTime = this.queryParams.Time[1]
      }
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined,supplierId:this.supplierId};
      const pageReq = { page: pageNum - 1, size: pageSize };
      listWmsSupplierTransaction(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsSupplierTransactionList = content;
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
        transactionCode: null,
        supplierId: null,
        transactionType: null,
        transactionAmount: null,
        previousBalance: null,
        currentBalance: null,
        receiptOrderId: null,
        remark: null,
        createTime: null,
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
      this.title = "添加供应商账户流水";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsSupplierTransaction(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改供应商账户流水";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsSupplierTransaction(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsSupplierTransaction(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除供应商账户流水编号为"' + ids + '"的数据项？').then(function () {
        return delWmsSupplierTransaction(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有供应商账户流水数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsSupplierTransaction(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    },
    handleChange(value){
      if(!value){
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    }
  }
};
</script>
