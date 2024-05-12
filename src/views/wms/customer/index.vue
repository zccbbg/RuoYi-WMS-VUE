<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="编号" prop="customerNo">
        <el-input v-model.trim="queryParams.customerNo" placeholder="请输入编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="名称" prop="customerNameLike">
        <el-input v-model.trim="queryParams.customerNameLike" placeholder="请输入名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model.trim="queryParams.address" placeholder="请输入地址" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model.trim="queryParams.mobile" placeholder="请输入手机号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="座机号" prop="tel">
        <el-input v-model.trim="queryParams.tel" placeholder="请输入座机号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系人" prop="customerPerson">
        <el-input v-model.trim="queryParams.customerPerson" placeholder="请输入联系人" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="级别" prop="customerLevel">
        <el-input v-model.trim="queryParams.customerLevel" placeholder="请输入级别" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <template v-if="showMoreCondition">
        <el-form-item label="Email" prop="email">
          <el-input v-model.trim="queryParams.email" placeholder="请输入Email" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
      </template>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini"
          @click="showMoreCondition = !showMoreCondition">{{ showMoreCondition ? '收起条件' : '展开条件' }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['wms:customer:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsCustomerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="customerNo" v-if="columns[0].visible" />
      <el-table-column label="名称" align="center" prop="customerName" v-if="columns[1].visible" />
      <el-table-column label="应收款" align="center" class-name="small-padding fixed-width" v-if="columns[2].visible">
        <template slot-scope="scope">
          <p> {{ scope.row.receivableAmount }}</p>
          <el-button size="mini" type="text" @click="handleEnter(scope.row)">+应收
          </el-button>
          <el-button size="mini" type="text" @click="handleExit(scope.row)">-结款
          </el-button>
          <el-button size="mini" type="text" @click="handleDetail(scope.row)">查看流水
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" prop="address" v-if="columns[3].visible" />
      <el-table-column label="手机号" align="center" prop="mobile" v-if="columns[4].visible" />
      <el-table-column label="座机号" align="center" prop="tel" v-if="columns[5].visible" />
      <el-table-column label="联系人" align="center" prop="customerPerson" v-if="columns[6].visible" />
      <el-table-column label="级别" align="center" prop="customerLevel" v-if="columns[7].visible" />
      <el-table-column label="Email" align="center" prop="email" v-if="columns[8].visible" />
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[9].visible" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="columns[10].visible">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:customer:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['wms:customer:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改客户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="编号" prop="customerNo">
          <el-input v-model="form.customerNo" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入银行卡号" />
        </el-form-item>
        <el-form-item label="座机号" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入座机号" />
        </el-form-item>
        <el-form-item label="联系人" prop="customerPerson">
          <el-input v-model="form.customerPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="级别" prop="customerLevel">
          <el-input v-model="form.customerLevel" placeholder="请输入级别" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="请输入Email" />
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

    <!-- 应付款 新增/结账 对话框 -->
    <el-dialog :title="duePayForm.title" :visible.sync="duePayForm.open" width="500px" append-to-body>
      <el-form ref="duePayForm" :model="duePayForm.form" :rules="duePayForm.rules" label-width="108px">

        <el-form-item label="金额" prop="transactionAmount">
          <el-input-number v-model="duePayForm.form.transactionAmount" :precision="2" :min="0"
            label="请输入金额"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="duePayForm.form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDuePayForm">确 定</el-button>
        <el-button @click="cancelDuePayForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWmsCustomer, getWmsCustomer, delWmsCustomer, addWmsCustomer, updateWmsCustomer, exportWmsCustomer } from "@/api/wms/customer";
import {randomId} from "@/utils/RandomUtils";
import {addWmsCustomerTransaction} from "@/api/wms/customerTransaction";

/* 银行卡校验 */
var isbankAccount = (rule, value, callback) => {
  const strBin =
    "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
  if (!value) {
    return callback(new Error("收款账户不能为空"));
  } else if (!Number.isInteger(+value)) {
    callback(new Error("银行卡号必须全为数字"));
  } else if (value.trim().length < 12 || value.trim().length > 19) {
    callback(new Error("银行卡号长度必须在12到19之间"));
  } else if (strBin.indexOf(value.substring(0, 2)) === -1) {
    callback(new Error("银行卡号开头6位不符合规范"));
  } else {
    callback();
  }
};

export default {
  name: "WmsCustomer",
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
      // 客户表格数据
      wmsCustomerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerNo: null,
        customerNameLike: null,
        address: null,
        mobile: null,
        tel: null,
        customerPerson: null,
        customerLevel: null,
        email: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        customerNo: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        customerName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        // bankAccount: [{ validator: isbankAccount, trigger: "blur" },]
      },
      columns: [
        { key: 1, label: "编号", visible: true },
        { key: 2, label: "名称", visible: true },
        { key: 3, label: "应收款", visible: true },
        { key: 4, label: "地址", visible: false },
        { key: 5, label: "手机号", visible: false },
        { key: 6, label: "座机号", visible: false },
        { key: 7, label: "联系人", visible: true },
        { key: 8, label: "级别", visible: true },
        { key: 9, label: "Email", visible: false },
        { key: 10, label: "备注", visible: true },
        { key: 11, label: "操作", visible: true },
      ],
      showMoreCondition: false,
      duePayForm: {
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        form: {}
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询客户列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listWmsCustomer(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsCustomerList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    /** 应付款 取消按钮 */
    cancelDuePayForm() {
      this.duePayForm.open = false
    },
    /** 应付款 提交按钮 */
    submitDuePayForm() {
      this.$refs["duePayForm"].validate(valid => {
        if (valid) {
          addWmsCustomerTransaction(this.duePayForm.form).then(res => {
            this.duePayForm.open = false
            this.$store.dispatch('wms/getSuppliers')
            this.$modal.msgSuccess("修改成功");
            this.getList();

          })

        }
      })

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
        customerNo: null,
        customerName: null,
        address: null,
        mobile: null,
        tel: null,
        customerPerson: null,
        customerLevel: null,
        email: null,
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
      this.title = "添加客户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsCustomer(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改客户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsCustomer(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.$store.dispatch('wms/getCustomer')
            });
          } else {
            addWmsCustomer(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.$store.dispatch('wms/getCustomer')
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除客户编号为"' + ids + '"的数据项？').then(function () {
        return delWmsCustomer(ids);
      }).then(() => {
        this.getList();
        this.$store.dispatch('wms/getCustomer')
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有客户数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsCustomer(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    },
    /** 查看流水 */
    handleDetail(row) {
      const id = row.id || this.ids
      this.$router.push({ path: '/relation/customerTransaction', query: { id } })
    },
    /* 新增 应付款 */
    handleEnter(row) {
      this.duePayForm.title = '新增应收款'
      this.duePayForm.open = true

      this.resetDueForm();
      this.duePayForm.form.customerId = row.id
      this.duePayForm.form.transactionType = '22'

    }, resetDueForm() {
      this.duePayForm.form = {
        transactionCode: 'TS-' + randomId(),
        transactionAmount: 0.00,
        remark: null
      }
    },
    /* 结款 */
    handleExit(row) {
      this.duePayForm.title = '结款'
      this.duePayForm.open = true

      this.resetDueForm();
      this.duePayForm.form.transactionType = '11'
      this.duePayForm.form.customerId = row.id

    },
  }
};
</script>
