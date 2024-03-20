<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
      size="medium"
      class="ry_form"
    >
      <el-form-item label="结算单号" prop="inventorySettlementNo">
        <el-input
          v-model="queryParams.inventorySettlementNo"
          placeholder="请输入结算单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算状态" prop="inventorySettlementStatus">
        <DictRadio
          v-model="queryParams.inventorySettlementStatus"
          @change="handleQuery"
          size="small"
          :radioData="dict.type.wms_settlement_status"
          :showAll="'all'"
        />
      </el-form-item>
      <!--      <el-form-item label="结算类型" prop="settlementType">
              <DictRadio
                v-model="queryParams.settlementType"
                @change="handleQuery"
                size="small"
                :radioData="dict.type.wms_settlement_type"
                :showAll="'all'"
              />
            </el-form-item>-->

      <el-form-item class="flex_one tr">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
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
          v-hasPermi="['wms:inventorySettlement:add']"
        >新增结算单
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['wms:inventorySettlement:export']"
        >导出
        </el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
    </el-row>

    <WmsTable
      v-loading="loading"
      :data="wmsInventorySettlementList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="结算单号"
        align="center"
        prop="inventorySettlementNo"
        v-if="columns[3].visible"
      />
      <el-table-column
        label="结算周期"
        align="center"
        v-if="columns[0].visible"
      >
        <template slot-scope="scope">
          <span>{{ formatInventorySettlementPeriod(scope.row) }}</span>
        </template>

      </el-table-column>
      <el-table-column label="结算状态" align="center" prop="inventorySettlementStatus" v-if="columns[0].visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_settlement_status" :value="scope.row.inventorySettlementStatus"/>
        </template>
      </el-table-column>
      <!--      <el-table-column
              label="结算类型"
              align="center"
              prop="settlementType"
              v-if="columns[1].visible"
            />-->
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        v-if="columns[2].visible"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleView(scope.row)"
            v-hasPermi="['wms:inventorySettlement:edit']"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="11 === scope.row.inventorySettlementStatus"
            v-hasPermi="['wms:inventorySettlement:edit']"
          >继续结算
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="11 === scope.row.inventorySettlementStatus"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:inventorySettlement:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import {
  listWmsInventorySettlement,
  delWmsInventorySettlement,
  exportWmsInventorySettlement,
} from "@/api/wms/inventorySettlement";
import moment from "moment";

export default {
  name: "WmsInventorySettlement",
  dicts: ["wms_settlement_status", "wms_settlement_type"],
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
      // 库存结算单表格数据
      wmsInventorySettlementList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inventorySettlementStatus: null,
        settlementType: null,
        inventorySettlementNo: null,
      },
      // 表单参数
      form: {},
      columns: [
        {key: 9, label: "结算单号", visible: true},
        {key: 1, label: "结算状态", visible: true},
        {key: 2, label: "结算类型", visible: true},
        {key: 4, label: "备注", visible: true},
      ],
    };
  },
  created() {
    const {settlementType} = this.$route.query;
    if (Number(settlementType) === 1 || Number(settlementType) === 2) {
      this.queryParams.settlementType = settlementType
      this.getList();
    } else {
      this.$router.push({path: this.redirect || "/"}).catch(() => {
      });
    }
  },
  methods: {
    formatInventorySettlementPeriod(row) {
      if (row.inventorySettlementStartTime) {
        return moment(row.inventorySettlementStartTime).format('YYYY-MM-DD') + "-" +
          moment(row.inventorySettlementEndTime).format('YYYY-MM-DD')
      }
      return ''
    },
    /** 查询库存结算单列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {
        ...this.queryParams,
        pageNum: undefined,
        pageSize: undefined,
      };
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsInventorySettlement(query, pageReq).then((response) => {
        const {content, totalElements} = response;
        this.wmsInventorySettlementList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        inventorySettlementStatus: 0,
        settlementType: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        inventorySettlementNo: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 查看按钮操作 */
    handleView(row) {
      const id = row.id || this.ids
      this.$router.push({path: 'inventorySettlement/status', query: {id}})
    },
    /** 新增按钮操作 */
    handleAdd() {
      const settlementType = this.queryParams.settlementType
      this.$router.push({path: "inventorySettlement/edit", query: {settlementType}});
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      this.$router.push({path: 'inventorySettlement/edit', query: {id}})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除库存结算单编号为"' + ids + '"的数据项？')
        .then(function () {
          return delWmsInventorySettlement(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有库存结算单数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportWmsInventorySettlement(queryParams);
        })
        .then((response) => {
          this.$download.download(response);
          this.exportLoading = false;
        })
        .catch(() => {
        });
    },
  },
};
</script>
