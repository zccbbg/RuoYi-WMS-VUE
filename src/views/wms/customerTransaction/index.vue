<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="交易编号" prop="transactionCode">
        <el-input v-model.trim="queryParams.transactionCode" placeholder="请输入交易编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="交易类型" prop="transactionType">
        <DictRadio v-model="queryParams.transactionType" @change="handleQuery" size="small"
          :radioData="dict.type.wms_customer_transaction_type" :showAll="'all'" />
      </el-form-item>
      <el-form-item label="创建时间" prop="Time">
        <el-date-picker v-model="queryParams.Time" type="datetimerange" :picker-options="pickerOptions"
          range-separator="至" size="small" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" align="right"
          @change="handleChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <WmsTable v-loading="loading" :data="wmsCustomerTransactionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="交易编号" align="center" prop="transactionCode" v-if="columns[0].visible" />
      <el-table-column label="用户" align="center" prop="customerId" v-if="columns[1].visible">
        <template slot-scope="scope">
          {{ getCustomerName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="交易类型" align="center" prop="transactionType" v-if="columns[2].visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_customer_transaction_type" :value="scope.row.transactionType" />
        </template>
      </el-table-column>
      <el-table-column label="交易金额" align="center" prop="transactionAmount" v-if="columns[3].visible" >
        <template slot-scope="scope">
          <span style="color:red">{{scope.row.transactionType==11 ? "-":"+"}} {{scope.row.transactionAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="上期余额" align="center" prop="previousBalance" v-if="columns[4].visible" />
      <el-table-column label="当前余额" align="center" prop="currentBalance" v-if="columns[5].visible" />
      <el-table-column label="出库单号" align="center" prop="shipmentOrderId" v-if="columns[6].visible" />
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[7].visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[8].visible" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="columns[9].visible">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:wmsCustomerTransaction:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['wms:wmsCustomerTransaction:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改客户账户流水对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="交易编号" prop="transactionCode">
          <el-input v-model="form.transactionCode" placeholder="请输入交易编号" />
        </el-form-item>
        <el-form-item label="用户编号" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入用户编号" />
        </el-form-item>
        <el-form-item label="交易类型" prop="transactionType">
          <el-select v-model="form.transactionType" placeholder="请选择交易类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
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
        <el-form-item label="出库单号" prop="shipmentOrderId">
          <el-input v-model="form.shipmentOrderId" placeholder="请输入出库单号" />
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
import { listWmsCustomerTransaction, getWmsCustomerTransaction, delWmsCustomerTransaction, addWmsCustomerTransaction, updateWmsCustomerTransaction, exportWmsCustomerTransaction } from "@/api/wms/customerTransaction";
import { mapGetters } from "vuex";

export default {
  name: "WmsCustomerTransaction",
  dicts: ["wms_customer_transaction_type"],
  computed: {
    ...mapGetters(['customerMap']),
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
      // 客户账户流水表格数据
      wmsCustomerTransactionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        transactionCode: null,
        customerId: null,
        transactionType: null,
        transactionAmount: null,
        previousBalance: null,
        currentBalance: null,
        shipmentOrderId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        transactionCode: [
          { required: true, message: "交易编号不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "用户编号不能为空", trigger: "blur" }
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
        { key: 2, label: "用户编号", visible: true },
        { key: 3, label: "交易类型", visible: true },
        { key: 4, label: "交易金额", visible: true },
        { key: 5, label: "上期余额", visible: true },
        { key: 6, label: "当前余额", visible: true },
        { key: 7, label: "出库单号", visible: false },
        { key: 8, label: "备注", visible: true },
        { key: 9, label: "创建时间", visible: true },
        { key: 10, label: "操作", visible: false },
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
      customerId: null
    };
  },
  created() {
    const {id} = this.$route.query
    if (id) {
      this.customerId = id
      this.getList(id)
    }
  },
  methods: {
    getCustomerName(row) {
      return this.customerMap.get(Number(row.customerId))
    },
    /** 查询客户账户流水列表 */
    getList() {
      if (this.queryParams.Time){
        this.queryParams.startTime = this.queryParams.Time[0]
        this.queryParams.endTime = this.queryParams.Time[1]
      }
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined,customerId:this.customerId };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listWmsCustomerTransaction(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsCustomerTransactionList = content;
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
        customerId: null,
        transactionType: null,
        transactionAmount: null,
        previousBalance: null,
        currentBalance: null,
        shipmentOrderId: null,
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
      this.title = "添加客户账户流水";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsCustomerTransaction(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改客户账户流水";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsCustomerTransaction(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsCustomerTransaction(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除客户账户流水编号为"' + ids + '"的数据项？').then(function () {
        return delWmsCustomerTransaction(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有客户账户流水数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsCustomerTransaction(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    },
    handleChange(value) {
      if (!value) {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    }
  }
};
</script>
