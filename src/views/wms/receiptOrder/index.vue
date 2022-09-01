<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="入库状态" prop="receiptOrderStatus">
        <el-radio-group v-model="queryParams.receiptOrderStatus" @change="handleQuery" size="small">
          <el-radio-button v-for="dict in dict.type.wms_receipt_status"
                :key="dict.value"
                :label="dict.value">{{dict.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="入库类型" prop="receiptOrderType">
        <el-radio-group v-model="queryParams.receiptOrderType" @change="handleQuery" size="small">
          <el-radio-button v-for="dict in dict.type.wms_receipt_type"
                :key="dict.value"
                :label="dict.value">{{dict.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      </br>
      <el-form-item label="入库单号" prop="receiptOrderNo">
        <el-input
          v-model="queryParams.receiptOrderNo"
          placeholder="请输入入库单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <WmsSupplierSelect v-model="queryParams.supplierId" size="small"/>
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
          @click="handleAdd()"
          v-hasPermi="['wms:wmsReceiptOrder:add']"
        >创建入库单</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wms:wmsReceiptOrder:edit']"
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
          v-hasPermi="['wms:wmsReceiptOrder:remove']"
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
          v-hasPermi="['wms:wmsReceiptOrder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsReceiptOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="入库单号" align="center" prop="receiptOrderNo" v-if="columns[0].visible"/>
      <el-table-column label="入库类型" align="center" prop="receiptOrderType" v-if="columns[1].visible"/>
      <el-table-column label="供应商" align="center" prop="supplierId" v-if="columns[2].visible"/>
      <el-table-column label="订单号" align="center" prop="orderNo" v-if="columns[3].visible"/>
      <el-table-column label="入库状态" align="center" prop="receiptOrderStatus" v-if="columns[4].visible"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[5].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleUpdate(scope.row)"
            v-hasPermi="['wms:wmsReceiptOrder:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="handleDelete(scope.row)"
            v-hasPermi="['wms:wmsReceiptOrder:remove']"
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
  </div>
</template>

<script>
import { listWmsReceiptOrder, getWmsReceiptOrder, delWmsReceiptOrder, exportWmsReceiptOrder } from "@/api/wms/receiptOrder";

export default {
  name: "WmsReceiptOrder",
  dicts: ['wms_receipt_type','wms_receipt_status'],
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
      // 入库单表格数据
      wmsReceiptOrderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receiptOrderNo: null,
        receiptOrderType: null,
        supplierId: null,
        orderNo: null,
        receiptOrderStatus: null,
      },
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "入库单号", visible:  true  },
            { key: 2, label: "入库类型", visible:  true  },
            { key: 3, label: "供应商", visible:  true  },
            { key: 4, label: "订单号", visible:  true  },
            { key: 5, label: "入库状态", visible:  true  },
            { key: 6, label: "备注", visible:  true  },
                             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询入库单列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsReceiptOrder(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsReceiptOrderList = content;
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({path: "/wms/receiptOrder/edit"});
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      this.$router.push({path: "/wms/receiptOrder/edit", query: {id}});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除入库单编号为"' + ids + '"的数据项？').then(function() {
        return delWmsReceiptOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有入库单数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsReceiptOrder(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
