<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
             class="ry_form">

      <el-form-item label="物料类型名称" prop="typeNameLike">
        <el-input
          v-model="queryParams.typeNameLike"
          placeholder="请输入物料类型名称"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wms:itemType:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>


    <el-table
      v-loading="loading"
      :data="wmsItemTypeList"
      row-key="itemTypeId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="物料类型名称" align="center" prop="typeName" width="260" v-if="columns[2].visible"/>
      <el-table-column label="排序" align="center" prop="orderNum" width="200"/>

      <el-table-column prop="status" label="状态"  width="100" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:itemType:edit']"
          >修改
          </el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:wmsItemType:add']"
          >新增
          </el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:itemType:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改物料类型表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="dialog-form-two">

        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="所属类别" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer"
                          placeholder="选择所属类别"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型名称" prop="typeName">
              <el-input v-model="form.typeName" placeholder="请输入类型名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
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
  addWmsItemType,
  delWmsItemType,
  exportWmsItemType,
  getWmsItemType, itemTypeTreeselect,
  listWmsItemTypeNoPage,
  updateWmsItemType
} from "@/api/wms/itemType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "WmsItemType",
  dicts: ['sys_normal_disable'],
  components: {Treeselect},
  data() {
    return {
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 部门树选项
      deptOptions: [],
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
      // 物料类型表表格数据
      wmsItemTypeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: null,
        ancestors: null,
        typeNameLike: null,
        orderNum: undefined,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        typeName: [
          {required: true, message: "请输入类型名称", trigger: "blur"},
        ]
      },
      columns: [
        {key: 1, label: "父物料类型id", visible: true},
        {key: 2, label: "祖级列表", visible: true},
        {key: 3, label: "物料类型名称", visible: true},
        {key: 4, label: "显示顺序", visible: true},
        {key: 5, label: "物料类型状态（0正常 1停用）", visible: true},
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 转换物料类型数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.itemTypeId,
        label: node.typeName,
        children: node.children
      };
    },
    /** 查询物料类型表列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsItemTypeNoPage(query).then(response => {
        this.wmsItemTypeList = this.handleTree(response.data, "itemTypeId");
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
        itemTypeId: null,
        parentId: null,
        ancestors: null,
        typeName: null,
        orderNum: undefined,
        status: "0",
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
      this.ids = selection.map(item => item.itemTypeId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.open = true;
      this.title = "添加物料类型表";
      if (row != undefined) {
        this.form.parentId = row.itemTypeId;
      }
      listWmsItemTypeNoPage().then(response => {
        this.deptOptions = this.handleTree(response.data, "itemTypeId");
      });

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const itemTypeId = row.itemTypeId || this.ids
      getWmsItemType(itemTypeId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改物料类型表";
      });
      listWmsItemTypeNoPage().then(response => {
        this.deptOptions = this.handleTree(response.data, "itemTypeId");
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.itemTypeId != null) {
            updateWmsItemType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsItemType(this.form).then(response => {
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
      const itemTypeIds = row.itemTypeId || this.ids;
      this.$modal.confirm('是否确认删除物料类型表编号为"' + itemTypeIds + '"的数据项？').then(function () {
        return delWmsItemType(itemTypeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有物料类型表数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsItemType(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {
      });
    }
  }
};
</script>
