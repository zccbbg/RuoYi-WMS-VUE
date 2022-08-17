<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="出库单号，系统自动生成" prop="shipmentOrderNo">
        <el-input
          v-model="queryParams.shipmentOrderNo"
          placeholder="请输入出库单号，系统自动生成"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出库类型" prop="shipmentOrderType">
        <el-select v-model="queryParams.shipmentOrderType" placeholder="请选择出库类型" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="出库订单" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入出库订单"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          placeholder="请输入客户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出库单状态" prop="shipmentOrderStatus">
        <el-select v-model="queryParams.shipmentOrderStatus" placeholder="请选择出库单状态" clearable size="small">
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
      <template v-if="showMoreCondition">
      <el-form-item label="审核时间" prop="checkTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.checkTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择审核时间">
        </el-date-picker>
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
          v-hasPermi="['wms:wmsShipmentOrder:add']"
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
          v-hasPermi="['wms:wmsShipmentOrder:edit']"
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
          v-hasPermi="['wms:wmsShipmentOrder:remove']"
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
          v-hasPermi="['wms:wmsShipmentOrder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wmsShipmentOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="出库单号，系统自动生成" align="center" prop="shipmentOrderNo" v-if="columns[0].visible"/>
      <el-table-column label="出库类型" align="center" prop="shipmentOrderType" v-if="columns[1].visible"/>
      <el-table-column label="出库订单" align="center" prop="orderNo" v-if="columns[2].visible"/>
      <el-table-column label="客户" align="center" prop="customerId" v-if="columns[3].visible"/>
      <el-table-column label="出库单状态" align="center" prop="shipmentOrderStatus" v-if="columns[4].visible"/>
      <el-table-column label="审核状态" align="center" prop="checkStatus" v-if="columns[5].visible"/>
      <el-table-column label="审核人" align="center" prop="checkUserId" v-if="columns[6].visible"/>
      <el-table-column label="审核时间" align="center" prop="checkTime" width="180" v-if="columns[7].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.checkTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[8].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:wmsShipmentOrder:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:wmsShipmentOrder:remove']"
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

    <!-- 添加或修改出库单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="出库单号，系统自动生成" prop="shipmentOrderNo">
          <el-input v-model="form.shipmentOrderNo" placeholder="请输入出库单号，系统自动生成" />
        </el-form-item>
        <el-form-item label="出库类型" prop="shipmentOrderType">
          <el-select v-model="form.shipmentOrderType" placeholder="请选择出库类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="出库订单" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入出库订单" />
        </el-form-item>
        <el-form-item label="客户" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户" />
        </el-form-item>
        <el-form-item label="出库单状态">
          <el-radio-group v-model="form.shipmentOrderStatus">
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
                        value-format="yyyy-MM-dd HH:mm:ss"
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
import { listWmsShipmentOrder, getWmsShipmentOrder, delWmsShipmentOrder, addWmsShipmentOrder, updateWmsShipmentOrder, exportWmsShipmentOrder } from "@/api/wms/shipmentOrder";

export default {
  name: "WmsShipmentOrder",
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
      // 出库单表格数据
      wmsShipmentOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shipmentOrderNo: null,
        shipmentOrderType: null,
        orderNo: null,
        customerId: null,
        shipmentOrderStatus: null,
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
            { key: 1, label: "出库单号，系统自动生成", visible:  true  },
            { key: 2, label: "出库类型", visible:  true  },
            { key: 3, label: "出库订单", visible:  true  },
            { key: 4, label: "客户", visible:  true  },
            { key: 5, label: "出库单状态", visible:  true  },
            { key: 6, label: "审核状态", visible:  true  },
            { key: 7, label: "审核人", visible:  true  },
            { key: 8, label: "审核时间", visible:  true  },
            { key: 9, label: "备注", visible:  true  },
                             ],
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询出库单列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsShipmentOrder(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsShipmentOrderList = content;
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
        shipmentOrderNo: null,
        shipmentOrderType: null,
        orderNo: null,
        customerId: null,
        shipmentOrderStatus: 0,
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
      this.title = "添加出库单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsShipmentOrder(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改出库单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsShipmentOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsShipmentOrder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除出库单编号为"' + ids + '"的数据项？').then(function() {
        return delWmsShipmentOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有出库单数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsShipmentOrder(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
