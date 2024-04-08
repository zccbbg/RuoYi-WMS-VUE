<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="编号" prop="itemNo">
        <el-input v-model="queryParams.itemNo" placeholder="请输入编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="名称" prop="itemNameLike">
        <el-input v-model="queryParams.itemNameLike" placeholder="请输入名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="itemType">
        <treeselect v-model="queryParams.itemType" style="max-width: 180px" :options="deptOptions" :show-count="true"
          placeholder="请选择分类" />
      </el-form-item>
      <el-form-item label="单位类别" prop="unit">
        <el-input v-model="queryParams.unit" placeholder="请输入单位类别" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="仓库" prop="rackId">
        <wms-warehouse-cascader v-model="queryParams.place" :checkStrictly=true></wms-warehouse-cascader>
      </el-form-item>
      <template v-if="showMoreCondition">
        <el-form-item label="安全库存" prop="quantity">
          <el-input v-model="queryParams.quantity" placeholder="请输入安全库存" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="有效期" prop="expiryDate">
          <el-date-picker clearable size="small" v-model="queryParams.expiryDate" type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择有效期">
          </el-date-picker>
        </el-form-item>
      </template>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini"
          @click="showMoreCondition = !showMoreCondition">{{ showMoreCondition ? "收起条件" : "展开条件" }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['wms:item:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading" @click="handleExport"
          v-hasPermi="['wms:item:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsItemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="itemNo" v-if="columns[0].visible" />
      <el-table-column label="名称" align="center" prop="itemName" v-if="columns[1].visible" />
      <el-table-column label="分类" align="center" prop="itemTypeName" v-if="columns[2].visible" />
      <el-table-column label="单位类别" align="center" prop="unit" v-if="columns[3].visible" />
      <el-table-column label="所属仓库" align="center" prop="warehouseName" v-if="columns[6].visible" />
      <el-table-column label="所属库区" align="center" prop="areaName" v-if="columns[5].visible" />
      <el-table-column label="所属货架" align="center" prop="rackName" v-if="columns[4].visible" />
      <el-table-column label="安全库存" align="center" prop="quantity" v-if="columns[7].visible" />
      <el-table-column label="有效期" align="center" prop="expiryDate" width="180" v-if="columns[8].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expiryDate, "") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[9].visible" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click.stop="handleUpdate(scope.row)"
            v-hasPermi="['wms:item:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['wms:item:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改物料对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="98px" class="dialog-form-two">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="编号" prop="itemNo">
              <el-input v-model="form.itemNo" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="itemName">
              <el-input v-model="form.itemName" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="仓库/库区" prop="place">
              <WmsWarehouseCascader v-model="form.place" size="small"></WmsWarehouseCascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位类别" prop="unit">
              <el-input v-model="form.unit" placeholder="请输入单位类别" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="分类" prop="itemType">
              <treeselect v-model="form.itemType" :options="deptOptions" :show-count="true" placeholder="请选择分类" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全库存" prop="quantity">
              <el-input v-model="form.quantity" placeholder="请输入安全库存" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="有效期" prop="expiryDate">
              <el-date-picker clearable size="small" v-model="form.expiryDate" type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择有效期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
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
  listWmsItem,
  getWmsItem,
  delWmsItem,
  addWmsItem,
  updateWmsItem,
  exportWmsItem,
} from "@/api/wms/item";
import { mapGetters } from "vuex";
import Treeselect from "@riophae/vue-treeselect";
import { itemTypeTreeselect } from "@/api/wms/itemType";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "WmsItem",
  components: { Treeselect },
  dicts: ["wms_item_type"],
  computed: {
    ...mapGetters(['warehouseMap', 'warehouseList', 'areaList', 'areaMap', 'rackList', 'rackMap']),
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 部门树选项
      deptOptions: [],
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
      // 物料表格数据
      wmsItemList: [],
      // 货架表格数据
      rackListByArea: [],
      // 库区表格数据
      areaListByWarehouse: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemNo: null,
        itemNameLike: null,
        itemType: null,
        unit: null,
        rackId: null,
        areaId: null,
        warehouseId: null,
        quantity: null,
        expiryDate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemNo: [{ required: true, message: "编号不能为空", trigger: "blur" }],
        itemName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],

      },
      columns: [
        { key: 1, label: "编号", visible: true },
        { key: 2, label: "名称", visible: true },
        { key: 3, label: "分类", visible: true },
        { key: 4, label: "单位类别", visible: true },
        { key: 5, label: "所属货架", visible: false },
        { key: 6, label: "所属库区", visible: true },
        { key: 7, label: "所属仓库", visible: true },
        { key: 8, label: "安全库存", visible: true },
        { key: 9, label: "有效期", visible: true },
        { key: 11, label: "备注", visible: false },
      ],
      showMoreCondition: false,
    };
  },
  created() {
    this.getList();
    itemTypeTreeselect().then(response => {
      this.deptOptions = response.data
    });
  },
  methods: {
    /** 查询物料列表 */
    getList() {
      this.loading = true;
      const { place, pageNum, pageSize } = this.queryParams;
      const [warehouseId, areaId, rackId] = place || [];
      const query = {
        ...this.queryParams,
        warehouseId: warehouseId,
        areaId: areaId,
        rackId: rackId,
        pageNum: undefined,
        pageSize: undefined,
      };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listWmsItem(query, pageReq).then((response) => {
        const { content, totalElements } = response;
        content.forEach((item) => {
          item.warehouseName = this.warehouseMap.get(item.warehouseId);
        });
        content.forEach((item) => {
          item.areaName = this.areaMap.get(item.areaId);
        });
        content.forEach((item) => {
          item.rackName = this.rackMap.get(item.rackId);
        });
        this.wmsItemList = content;
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
        itemNo: null,
        itemName: null,
        itemType: null,
        unit: null,
        rackId: null,
        areaId: null,
        warehouseId: null,
        quantity: null,
        expiryDate: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加物料";
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      await getWmsItem(id).then((response) => {
        this.form = response;
        this.open = true;
        this.title = "修改物料";
      });
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.place) {
            this.form.warehouseId = this.form.place[0]
            this.form.areaId = this.form.place[1]
            this.form.rackId = this.form.place[2]

          }
          if (this.form.id != null) {
            updateWmsItem(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsItem(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除物料编号为"' + ids + '"的数据项？')
        .then(function () {
          return delWmsItem(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有物料数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportWmsItem(queryParams);
        })
        .then((response) => {
          this.$download.download(response);
          this.exportLoading = false;
        })
        .catch(() => { });
    },
  },
};
</script>
