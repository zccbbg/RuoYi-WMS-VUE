<template>
  <div class="app-container">
    <el-form class="ry_form" v-show="showSearch" :inline="true" label-width="100px" :model="queryParams" ref="queryForm"
             size="medium">
      <el-form-item label="操作类型" prop="formType">
        <in-out-type-select v-model="queryParams.formType" size="small"></in-out-type-select>
      </el-form-item>
      <el-form-item label="物料" prop="itemId">
        <item-select v-model="queryParams.itemId" clearable="clearable" placeholder="请输入物料ID"
                     size="small"></item-select>
      </el-form-item>
      <el-form-item label="仓库" prop="rackId">
        <wms-warehouse-cascader v-model="queryParams.warehouseArr" size="small" :checkStrictly=true></wms-warehouse-cascader>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb8" :gutter="10">
      <el-col :span="1.5">
        <el-button v-hasPermi="['wms:inventoryHistory:export']" icon="el-icon-download" :loading="exportLoading"
                   plain="plain" size="mini" type="warning" @click="handleExport">导出
        </el-button>
      </el-col>
      <right-toolbar :columns="columns" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <WmsTable v-loading="loading" :data="wmsInventoryHistoryList" @selection-change="handleSelectionChange">
      <el-table-column v-if="columns[1].visible" align="center" label="操作类型" prop="formType">
        <template v-slot="{ row }"><span>{{ row.formType ? opTypeMap[row.formType] : row.formType }}</span></template>
      </el-table-column>
      <el-table-column v-if="columns[2].visible" align="center" label="物料名称" prop="itemName"></el-table-column>
      <el-table-column align="center" label="物料编号" prop="itemNo"></el-table-column>
      <el-table-column v-if="columns[3].visible" align="center" label="仓库" prop="rackId">
        <template v-slot="{ row }"><span>{{ row.warehouseName }}</span><span
          v-if="row.areaName">/{{ row.areaName }}</span></template>
      </el-table-column>
      <el-table-column v-if="columns[4].visible" align="center" label="库存变化" prop="quantity"></el-table-column>
      <el-table-column v-if="columns[4].visible" align="center" label="操作时间" prop="createTime"></el-table-column>
      <el-table-column v-if="columns[5].visible" align="center" label="备注" prop="remark"></el-table-column>
    </WmsTable>
    <pagination v-show="total&gt;0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total"
                @pagination="getList"></pagination>
    <!-- 添加或修改库存记录对话框-->
    <el-dialog append-to-body="append-to-body" :title="title" :visible.sync="open" width="50%">
      <el-form class="dialog-form-two" inline="inline" label-width="108px" :model="form" ref="form" :rules="rules">
        <el-form-item label="操作id" prop="formId">
          <el-input v-model="form.formId" placeholder="请输入操作id"></el-input>
        </el-form-item>
        <el-form-item label="操作类型" prop="formType">
          <el-select v-model="form.formType" placeholder="请选择操作类型">
            <el-option label="请选择字典生成" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料ID" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料ID"></el-input>
        </el-form-item>
        <el-form-item label="货架id" prop="rackId">
          <el-input v-model="form.rackId" placeholder="请输入货架id"></el-input>
        </el-form-item>
        <el-form-item label="库存变化" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入库存变化"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWmsInventoryHistory, getWmsInventoryHistory, delWmsInventoryHistory, addWmsInventoryHistory, updateWmsInventoryHistory, exportWmsInventoryHistory } from "@/api/wms/inventoryHistory";
import ItemSelect from '@/components/ItemSelect'
import InOutTypeSelect from '@/components/InOutTypeSelect'
import { mapGetters } from 'vuex'

export default {
  name: "WmsInventoryHistory",
  components: { InOutTypeSelect, ItemSelect },
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
      // 库存记录表格数据
      wmsInventoryHistoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        formId: null,
        formType: null,
        itemId: null,
        warehouseArr: null,
        quantity: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "操作id（出库、入库、库存移动表单id）", visible:  true  },
            { key: 2, label: "操作类型", visible:  true  },
            { key: 3, label: "物料ID", visible:  true  },
            { key: 4, label: "货架id", visible:  true  },
            { key: 5, label: "库存变化", visible:  true  },
            { key: 6, label: "备注", visible:  true  },
                             ],
    };
  },
  computed: {
    ...mapGetters(['opTypeMap'])
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库存记录列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize, warehouseArr} = this.queryParams;
      const [warehouseId, areaId, rackId] = warehouseArr || [];
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined, warehouseId, areaId, rackId};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsInventoryHistory(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsInventoryHistoryList = content;
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
        formId: null,
        formType: null,
        itemId: null,
        rackId: null,
        quantity: null,
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
      this.queryParams.warehouseArr = null
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
      this.title = "添加库存记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWmsInventoryHistory(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改库存记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsInventoryHistory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsInventoryHistory(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库存记录编号为"' + ids + '"的数据项？').then(function() {
        return delWmsInventoryHistory(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有库存记录数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsInventoryHistory(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
