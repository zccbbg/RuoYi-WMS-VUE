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
      <el-form-item label="编号" prop="warehouseNo">
        <el-input
          v-model="queryParams.warehouseNo"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
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
          v-hasPermi="['wms:warehouse:add']"
          >新增</el-button
        >
      </el-col>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['wms:warehouse:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="wmsWarehouseList"
      row-key="key"
      :tree-props="{ children: 'children' }" 
    >
      <el-table-column
        label="编号"
        align="left"
        prop="warehouseNo"
        v-if="columns[0].visible"
      />
      <el-table-column
        label="仓库/库区/货架"
        align="center"
        prop="warehouseName"
        v-if="columns[1].visible"
      />
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

        <template slot-scope="scope" v-if="scope.row.isParent">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleUpdate(scope.row)"
            v-hasPermi="['wms:warehouse:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:warehouse:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改仓库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="108px"
        inline
        class="dialog-form-two"
      >
        <el-form-item label="编号" prop="warehouseNo">
          <el-input v-model="form.warehouseNo" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入名称" />
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
import { mapGetters } from "vuex";
import {
  listWmsWarehouse,
  getWmsWarehouse,
  delWmsWarehouse,
  addWmsWarehouse,
  updateWmsWarehouse,
  exportWmsWarehouse,
} from "@/api/wms/warehouse";

export default {
  name: "WmsWarehouse",

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
      // 仓库表格数据
      wmsWarehouseList: [],
      warehouseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseNo: null,
        warehouseName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        warehouseNo: [
          { required: true, message: "编号不能为空", trigger: "blur" },
        ],
        warehouseName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
      },
      columns: [
        { key: 1, label: "编号", visible: true },
        { key: 2, label: "名称", visible: true },
        { key: 4, label: "备注", visible: true },
      ],
    };
  },
  computed: {
    ...mapGetters(["areaList", "areaMap", "rackList", "rackMap"]),
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询仓库列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = {
        ...this.queryParams,
        pageNum: undefined,
        pageSize: undefined,
      };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listWmsWarehouse(query, pageReq).then((response) => {
        const { content, totalElements } = response;
        this.wmsWarehouseList = content;
        this.total = totalElements;
        this.loading = false;
        this.setChildren();
      });
    },
    
    setChildren(){
      let warehouseChildMap=new Map()
      let areaChildMap=new Map()

      this.rackList.forEach((rack)=>{
        let children=areaChildMap.get(rack.areaId)
        if(!children){
          children=[]
        };
        children.push({key:'rack'+rack.id,id:rack.id,warehouseName:rack.rackName,warehouseNo:rack.rackNo})
        areaChildMap.set(rack.areaId,children)
      });

      this.areaList.forEach((area)=>{
        let children=warehouseChildMap.get(area.warehouseId)
        if(!children){
          children=[]
        };
        children.push({key:'area'+area.id,id:area.id,warehouseName:area.areaName,warehouseNo:area.areaNo,children:areaChildMap.get(area.id)})
        warehouseChildMap.set(area.warehouseId,children)
      });

      this.wmsWarehouseList.forEach((warehouse)=>{
        warehouse.isParent=1;
        warehouse.key=warehouse.id
        warehouse.children=warehouseChildMap.get(warehouse.id)
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
        warehouseNo: null,
        warehouseName: null,
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
      this.title = "添加仓库";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getWmsWarehouse(id).then((response) => {
        this.form = response;
        this.open = true;
        this.title = "修改仓库";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsWarehouse(this.form).then((response) => {
              this.$store.dispatch("wms/getWarehouseList");
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsWarehouse(this.form).then((response) => {
              this.$store.dispatch("wms/getWarehouseList");
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
        .confirm('是否确认删除仓库编号为"' + ids + '"的数据项？')
        .then(function () {
          return delWmsWarehouse(ids);
        })
        .then(() => {
          this.getList();
          this.$store.dispatch("wms/getWarehouseList");
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有仓库数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportWmsWarehouse(queryParams);
        })
        .then((response) => {
          this.$download.download(response);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
