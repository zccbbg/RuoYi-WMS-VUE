<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="出库状态" prop="shipmentOrderStatus">
        <DictRadio v-model="queryParams.shipmentOrderStatus" @change="handleQuery" size="small" :radioData="dict.type.wms_shipment_status" :showAll="'all'"/>
      </el-form-item>
      <el-form-item label="出库类型" prop="shipmentOrderType">
        <DictRadio v-model="queryParams.shipmentOrderType" @change="handleQuery" size="small" :radioData="dict.type.wms_shipment_type" :showAll="'all'"/>
      </el-form-item>
      </br>
      <el-form-item label="出库单号" prop="shipmentOrderNo">
        <el-input
          v-model="queryParams.shipmentOrderNo"
          placeholder="请输入出库单号"
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
      <el-form-item label="客户" prop="customerId">
        <WmsCustomerSelect v-model="queryParams.customerId" size="small"/>
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
          v-hasPermi="['wms:shipmentOrder:add']"
        >创建出库单</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsShipmentOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="出库单号" align="center" prop="shipmentOrderNo" v-if="columns[0].visible"/>
      <el-table-column label="出库类型" align="center" v-if="columns[1].visible">
        <template slot-scope="scope">
          <el-tag size="medium" effect="plain" :type="getShipmentOrderTypeTag(scope.row)">{{getShipmentOrderType(scope.row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="center" :formatter="getCustomer" v-if="columns[2].visible"/>
      <el-table-column label="订单号" align="center" prop="orderNo" v-if="columns[3].visible"/>
      <el-table-column label="出库状态" align="center" v-if="columns[4].visible">
        <template slot-scope="scope">
          <el-tag size="medium" effect="plain" :type="getShipmentOrderStatusTag(scope.row)">{{getShipmentOrderStatus(scope.row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[5].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="{ row }">
          <el-button
            v-if="11 === row.shipmentOrderStatus"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleUpdate(row)"
            v-hasPermi="['wms:shipmentOrder:edit']"
          >修改</el-button>
          <el-button
            v-if="11 === row.shipmentOrderStatus"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="handleDelete(row)"
            v-hasPermi="['wms:shipmentOrder:remove']"
          >删除</el-button>
          <el-button
            v-if="row.detailCount"
            size="mini"
            type="text"
            icon="el-icon-truck"
            @click.stop="handleStatus(row)"
            v-hasPermi="['wms:shipmentOrder:status']"
          >发货/出库</el-button>
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
import { listWmsShipmentOrder, delWmsShipmentOrder, exportWmsShipmentOrder } from "@/api/wms/shipmentOrder";
import { mapGetters } from 'vuex';

export default {
  name: "wmsShipmentOrder",
  dicts: ['wms_shipment_type','wms_shipment_status'],
  computed:{
    ...mapGetters(['customerMap']),
    shipmentTypeMap(){
      let obj = this.dict.type.wms_shipment_type.map( item=> [item.value, item.label])
      let map= new Map(obj)
      return map
    },
    shipmentStatusMap(){
      let obj = this.dict.type.wms_shipment_status.map( item=> [item.value, item.label])
      let map= new Map(obj)
      return map
    }
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
      // 出库单表格数据
      wmsShipmentOrderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shipmentOrderNo: null,
        shipmentOrderType: null,
        customerId: null,
        orderNo: null,
        shipmentOrderStatus: null,
      },
      // 表单校验
      rules: {
      },
      columns: [
        { key: 1, label: "出库单号", visible:  true  },
        { key: 2, label: "出库类型", visible:  true  },
        { key: 3, label: "供应商", visible:  true  },
        { key: 4, label: "订单号", visible:  true  },
        { key: 5, label: "出库状态", visible:  true  },
        { key: 6, label: "备注", visible:  true  },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getShipmentOrderTypeTag(row){
      switch (row.shipmentOrderType){
        case 1:
          return "success";
        case 2:
          return "warning";
        case 3:
          return "danger";
      }
    },
    getShipmentOrderStatusTag(row){
      switch (row.shipmentOrderStatus){
        case 11:
          return "info";
        case 12:
          return "warning";
        case 14:
          return "danger";
        case 13:
          return "success";
      }
    },
    getShipmentOrderType(row){
      return this.shipmentTypeMap.get(row.shipmentOrderType+"")
    },
    getShipmentOrderStatus(row){
      return this.shipmentStatusMap.get(row.shipmentOrderStatus+"")
    },
    getCustomer(row, column){
      return this.customerMap.get(row.customerId)
    },
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
      this.$router.push({path: "/wms/shipmentOrder/edit"});
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      this.$router.push({path: "/wms/shipmentOrder/edit", query: {id}});
    },
    handleStatus(row) {
      const id = row.id || this.ids
      this.$router.push({path: "/wms/shipmentOrder/status", query: {id}});
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
