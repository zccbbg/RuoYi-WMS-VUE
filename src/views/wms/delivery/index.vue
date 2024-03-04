<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
             class="ry_form">
<!--      <el-form-item label="出库单主表Id" prop="shipmentOrderId">-->
<!--        <el-input-->
<!--          v-model.trim="queryParams.shipmentOrderId"-->
<!--          placeholder="请输入出库单主表Id"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="承运商" prop="carrierId">

        <WmsCarrierSelect v-model="queryParams.carrierId"></WmsCarrierSelect>

      </el-form-item>
      <el-form-item label="发货日期" prop="deliveryDate">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.deliveryDate"
          type="datetime"
          value-format="yyyy-MM-ddTHH:mm:ss"
          placeholder="选择发货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="快递单号" prop="trackingNo">
        <el-input
          v-model.trim="queryParams.trackingNo"
          placeholder="请输入快递单号"
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsDeliveryList" @selection-change="handleSelectionChange">
      <el-table-column label="出库单" align="center" prop="shipmentOrderId" v-if="columns[0].visible">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     @click.stop="handleView(scope.row)">{{ '查看出库单' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="承运商" align="center" prop="carrierId" :formatter="getCarrier"
                       v-if="columns[1].visible"/>
      <el-table-column label="发货日期" align="center" prop="deliveryDate" width="180" v-if="columns[2].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="快递单号" align="center" prop="trackingNo" v-if="columns[3].visible">
        <!--        https://www.kuaidi100.com/chaxun?com=[]&nu=[]-->
        <template slot-scope="scope">
          <a
            target="_blank"
            :href=" 'https://www.kuaidi100.com/chaxun?com='+getCarrier(scope.row)+'&nu='+scope.row.trackingNo">{{
              scope.row.trackingNo
            }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[4].visible"/>
    </WmsTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改发货记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="出库单主表Id" prop="shipmentOrderId">
          <el-input v-model="form.shipmentOrderId" placeholder="请输入出库单主表Id"/>
        </el-form-item>
        <el-form-item label="承运商Id" prop="carrierId">
          <el-input v-model="form.carrierId" placeholder="请输入承运商Id"/>
        </el-form-item>
        <el-form-item label="发货日期" prop="deliveryDate">
          <el-date-picker clearable size="small"
                          v-model="form.deliveryDate"
                          type="datetime"
                          value-format="yyyy-MM-ddTHH:mm:ss"
                          placeholder="选择发货日期">
          </el-date-picker>
        </el-form-item>
        1
        <el-form-item label="快递单号" prop="trackingNo">
          <el-input v-model="form.trackingNo" placeholder="请输入快递单号"/>
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
  addWmsDelivery,
  delWmsDelivery,
  exportWmsDelivery,
  getWmsDelivery,
  listWmsDelivery,
  updateWmsDelivery
} from "@/api/wms/delivery";
import {mapGetters} from "vuex";

export default {
  name: "WmsDelivery",
  computed: {
    ...mapGetters(['carrierMap']),
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
      // 发货记录表格数据
      wmsDeliveryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shipmentOrderId: null,
        carrierId: null,
        deliveryDate: null,
        trackingNo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      columns: [
        {key: 1, label: "出库单主表Id", visible: true},
        {key: 2, label: "承运商Id", visible: true},
        {key: 3, label: "发货日期", visible: true},
        {key: 4, label: "快递单号", visible: true},
        {key: 5, label: "备注", visible: true},
      ],
    };
  },
  created() {
    this.getList();
    // this.$message.warning('该功能正在开发中...')
  },
  methods: {
    //查看出库单
    handleView(row) {
      const id = row.shipmentOrderId
      this.$router.push({path: '/wms/shipmentOrder/status', query: {id}})
    },
    // 格式化承运商
    getCarrier(row, column) {
      return this.carrierMap.get(row.carrierId)
    },
    /** 查询发货记录列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsDelivery(query, pageReq).then(response => {
        const {content, totalElements} = response
        this.wmsDeliveryList = content;
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
        shipmentOrderId: null,
        carrierId: null,
        deliveryDate: null,
        trackingNo: null,
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
      this.title = "添加发货记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsDelivery(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改发货记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsDelivery(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsDelivery(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除发货记录编号为"' + ids + '"的数据项？').then(function () {
        return delWmsDelivery(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有发货记录数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsDelivery(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {
      });
    }
  }
};
</script>
