<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="编号" prop="carrierNo">
        <el-input
          v-model.trim="queryParams.carrierNo"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="carrierNameLike">
        <el-input
          v-model.trim="queryParams.carrierNameLike"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model.trim="queryParams.address"
          placeholder="请输入地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model.trim="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="座机号" prop="tel">
        <el-input
          v-model.trim="queryParams.tel"
          placeholder="请输入座机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input
          v-model.trim="queryParams.contact"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="级别" prop="level">
        <el-select v-model="queryParams.level" placeholder="请选择级别" clearable size="small" @change="handleQuery">
              <el-option
                  v-for="dict in dict.type.wms_carrier_level"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
        </el-select>
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="Email" prop="email">
        <el-input
          v-model.trim="queryParams.email"
          placeholder="请输入Email"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['wms:carrier:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wms:carrier:edit']"
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
          v-hasPermi="['wms:carrier:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['wms:carrier:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="wmsCarrierList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="carrierNo" v-if="columns[0].visible"/>
      <el-table-column label="名称" align="center" prop="carrierName" v-if="columns[1].visible"/>
      <el-table-column label="地址" align="center" prop="address" v-if="columns[2].visible"/>
      <el-table-column label="手机号" align="center" prop="mobile" v-if="columns[3].visible"/>
      <el-table-column label="座机号" align="center" prop="tel" v-if="columns[4].visible"/>
      <el-table-column label="联系人" align="center" prop="contact" v-if="columns[5].visible"/>
      <el-table-column label="级别" align="center" prop="level" v-if="columns[6].visible"/>
      <el-table-column label="Email" align="center" prop="email" v-if="columns[7].visible"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[8].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleUpdate(scope.row)"
            v-hasPermi="['wms:carrier:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:carrier:remove']"
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

    <!-- 添加或修改承运商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="编号" prop="carrierNo">
          <el-input v-model="form.carrierNo" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="名称" prop="carrierName">
          <el-input v-model="form.carrierName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="座机号" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入座机号" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择级别">
            <el-option
                  v-for="dict in dict.type.wms_carrier_level"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
          </el-select>
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
  </div>
</template>

<script>
import { listWmsCarrier, getWmsCarrier, delWmsCarrier, addWmsCarrier, updateWmsCarrier, exportWmsCarrier } from "@/api/wms/carrier";
import WmsTable from "@/components/WmsTable/index.vue";

export default {
    name: "WmsCarrier",
    dicts: ["wms_carrier_level"],
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
            // 承运商表格数据
            wmsCarrierList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                carrierNo: null,
                carrierNameLike: null,
                address: null,
                mobile: null,
                tel: null,
                contact: null,
                level: null,
                email: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                carrierNo: [
                    { required: true, message: "编号不能为空", trigger: "blur" }
                ],
                carrierName: [
                    { required: true, message: "名称不能为空", trigger: "blur" }
                ],
            },
            columns: [
                { key: 1, label: "编号", visible: true },
                { key: 2, label: "名称", visible: true },
                { key: 3, label: "地址", visible: true },
                { key: 4, label: "手机号", visible: true },
                { key: 5, label: "座机号", visible: true },
                { key: 6, label: "联系人", visible: true },
                { key: 7, label: "级别", visible: true },
                { key: 8, label: "Email", visible: true },
                { key: 9, label: "备注", visible: true },
            ],
            showMoreCondition: false
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询承运商列表 */
        getList() {
            this.loading = true;
            const { pageNum, pageSize } = this.queryParams;
            const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
            const pageReq = { page: pageNum - 1, size: pageSize };
            listWmsCarrier(query, pageReq).then(response => {
                const { content, totalElements } = response;
                this.wmsCarrierList = content;
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
                carrierNo: null,
                carrierName: null,
                address: null,
                mobile: null,
                tel: null,
                contact: null,
                level: null,
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
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加承运商";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getWmsCarrier(id).then(response => {
                this.form = response;
                this.open = true;
                this.title = "修改承运商";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateWmsCarrier(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                            this.$store.dispatch('wms/getCarrier')
                        });
                    }
                    else {
                        addWmsCarrier(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                            this.$store.dispatch('wms/getCarrier')
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal.confirm("是否确认删除承运商编号为\"" + ids + "\"的数据项？").then(function () {
                return delWmsCarrier(ids);
            }).then(() => {
                this.getList();
                this.$store.dispatch('wms/getCarrier')
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$modal.confirm("是否确认导出所有承运商数据项？").then(() => {
                this.exportLoading = true;
                return exportWmsCarrier(queryParams);
            }).then(response => {
                this.$download.download(response);
                this.exportLoading = false;
            }).catch(() => { });
        }
    },
    components: { WmsTable }
};
</script>
