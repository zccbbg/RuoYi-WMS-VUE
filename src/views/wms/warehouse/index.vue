<template>
  <div class="app-container" v-if="show">
    <el-card style="margin-bottom: 12px;">
      <div class="clearfix" style="margin-top: 10px;">
        <div style="width: 200px;margin-bottom: 10px;" class="left">
          <el-input placeholder="请输入仓库编号/名称" v-model="queryWarehouseParam" class="input-with-select"
            suffix-icon="el-icon-search" @keyup.enter.native="handleSearchWarehouse">
          </el-input>
        </div>
        <div class="left">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddWarehouse"
            v-hasPermi="['wms:warehouse:add']" style="margin: 3px 10px;">新增仓库</el-button>
        </div>
      </div>
    </el-card>
    <el-empty description="暂无仓库" v-if="wmsWarehouseList.length == 0"></el-empty>
    <el-card v-else>
      <el-tabs :tab-position="tabPosition" style="height: 600px;" @tab-click="handleTabClick" ref="leftRef">
        <el-tab-pane v-for="(it, index) in wmsWarehouseList" :label="it.warehouseName" :key="it.id">
          <div class="content-wrapper">
            <div class="clearfix">
              <div style="color:#409EFF;font-weight: bold;font-size: 15px;" class="content-margin left">基本信息</div>
              <el-link type="primary" plain size="mini" @click="handleUpdateWarehouse" v-hasPermi="['wms:warehouse:add']"
                class="left" style="margin-left: 10px;text-decoration: underline;" :underline="false">修改</el-link>
              <el-link type="danger" plain size="mini" @click="handleDeleteWarehouse" v-hasPermi="['wms:warehouse:add']"
                class="left" style="margin-left: 10px;text-decoration: underline;" :underline="false">删除</el-link>
            </div>
            <div class="content-margin info-box">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>
                    <div style="font-weight: bold;">仓库名称</div>
                    <div style="margin-top: 10px;">{{ it.warehouseName }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <div style="font-weight: bold;">仓库编号</div>
                    <div style="margin-top: 10px;">{{ it.warehouseNo }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <div style="font-weight: bold;">仓库备注</div>
                    <div style="margin-top: 10px;">{{ it.remark }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div >
          <div class="content-wrapper">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="库区信息" name="first">
                  <div class="clearfix oper_area">
                    <div class="left">
                      <el-input placeholder="请输入库区编号/名称" v-model="queryAreaParam" class="input-with-select"
                                suffix-icon="el-icon-search" @keyup.enter.native="handleSearchArea">
                      </el-input>
                    </div>
                    <div class="left" style="margin: 3px 10px;">
                      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddArea()"
                                 v-hasPermi="['wms:area:add']">新增库区</el-button>
                    </div>
                  </div>
                <el-table v-loading="loading" :data="wmsAreaList" max-height="400">
                  <el-table-column label="编号" align="center" prop="areaNo" v-if="columns[0].visible" />
                  <el-table-column label="所属仓库" align="center" prop="warehouseName" v-if="columns[2].visible" />
                  <el-table-column label="名称" align="center" prop="areaName" v-if="columns[1].visible" />
                  <el-table-column label="备注" align="center" prop="remark" v-if="columns[3].visible" />
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" icon="el-icon-edit" @click.stop="handleUpdateArea(scope.row)"
                                 v-hasPermi="['wms:area:edit']">修改</el-button>
                      <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                                 v-hasPermi="['wms:area:remove']">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加或修改仓库对话框 -->
    <el-dialog :title="title" :visible.sync="openWarehouse" width="50%" append-to-body>
      <el-form ref="warehouseForm" :model="warehouseForm" :rules="rules" label-width="108px" inline
        class="dialog-form-two">
        <el-form-item label="编号" prop="warehouseNo">
          <el-input v-model="warehouseForm.warehouseNo" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="名称" prop="warehouseName">
          <el-input v-model="warehouseForm.warehouseName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="warehouseForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWarehouseForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改库区对话框 -->
    <el-dialog :title="title" :visible.sync="openArea" width="50%" append-to-body>
      <el-form ref="areaForm" :model="areaForm" :rules="rulesArea" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="编号" prop="areaNo">
          <el-input v-model="areaForm.areaNo" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="名称" prop="areaName">
          <el-input v-model="areaForm.areaName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseId">
          <!-- <el-select v-model="form.warehouseId" placeholder="请输入货仓名称" clearable size="small">
            <el-option v-for="item in warehouseList" :key="item.id" :label="item.warehouseName" :value="item.id">
            </el-option>
          </el-select> -->
          <el-input v-model="areaForm.warehouseId" :disabled="true" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="areaForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAreaForm">确 定</el-button>
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
import {
  listWmsArea,
  getWmsArea,
  delWmsArea,
  addWmsArea,
  updateWmsArea,
  exportWmsArea,
} from "@/api/wms/area";
import { isStarRepo } from '@/utils/is-star-plugin'
export default {
  name: "WmsWarehouse",

  data() {
    return {
      show: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
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
      // 库区表格数据
      wmsAreaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openWarehouse: false,
      openArea: false,
      // 查询参数
      queryParams: {
        warehouseNo: null,
        warehouseName: null,
      },
      queryAreaParams: {
        areaNo: null,
        areaNameLike: null,
        warehouseId: null,
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      warehouseForm: {},
      areaForm: {},
      // 表单校验
      rules: {
        warehouseNo: [
          { required: true, message: "编号不能为空", trigger: "blur" },
        ],
        warehouseName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
      },
      // 表单校验
      rulesArea: {
        areaNo: [{ required: true, message: "编号不能为空", trigger: "blur" }],
        areaName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        warehouseId: [
          { required: true, message: "所属仓库不能为空", trigger: "blur" },
        ],
      },
      // columns: [
      //   { key: 1, label: "编号", visible: true },
      //   { key: 2, label: "名称", visible: true },
      //   { key: 4, label: "备注", visible: true },
      // ],
      columns: [
        { key: 1, label: "编号", visible: true },
        { key: 2, label: "名称", visible: true },
        { key: 3, label: "所属仓库", visible: false },
        { key: 4, label: "备注", visible: true },
      ],
      // tab页位置
      tabPosition: 'left',
      selectedWarehouseId: null,
      // 右侧横向tab默认选中
      activeName: 'first',
      // 查询库区参数
      queryAreaParam: null,
      queryWarehouseParam: null
    };
  },
  computed: {
    ...mapGetters(["warehouseList", "warehouseMap", "areaList", "areaMap", "rackList", "rackMap","userId"])
  },
  async created() {
    const res = await isStarRepo('zccbbg','wms-ruoyi',this.userId,'http://wms.ichengle.top/warehouse','Wms-Ruoyi-仓库库存管理','https://gitee.com/zccbbg/wms-ruoyi')
    this.show = res;
    if (res) {
      this.getList()
    }
  },
  methods: {
    /** 查询仓库列表 */
    getList() {
      this.selectedWarehouseId = null
      const query = {
        ...this.queryParams,
        pageNum: undefined,
        pageSize: undefined,
      };
      const pageReq = undefined;
      listWmsWarehouse(query, pageReq).then((response) => {
        const { content, totalElements } = response;
        this.wmsWarehouseList = content;
        this.setChildren();
        this.loadAreas()
      });
    },

    setChildren() {
      let warehouseChildMap = new Map()
      let areaChildMap = new Map()

      this.rackList.forEach((rack) => {
        let children = areaChildMap.get(rack.areaId)
        if (!children) {
          children = []
        };
        children.push({ key: 'rack' + rack.id, id: rack.id, warehouseName: rack.rackName, warehouseNo: rack.rackNo })
        areaChildMap.set(rack.areaId, children)
      });

      this.areaList.forEach((area) => {
        let children = warehouseChildMap.get(area.warehouseId)
        if (!children) {
          children = []
        };
        children.push({ key: 'area' + area.id, id: area.id, warehouseName: area.areaName, warehouseNo: area.areaNo, children: areaChildMap.get(area.id) })
        warehouseChildMap.set(area.warehouseId, children)
      });

      this.wmsWarehouseList.forEach((warehouse) => {
        warehouse.isParent = 1;
        warehouse.key = warehouse.id
        warehouse.children = warehouseChildMap.get(warehouse.id)
      })

    },


    // 取消按钮
    cancel() {
      this.openWarehouse = false;
      this.openArea = false;
      this.resetWarehouseForm();
      this.resetAreaForm();
    },
    // 表单重置
    resetWarehouseForm() {
      this.warehouseForm = {
        id: null,
        warehouseNo: null,
        warehouseName: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm("warehouseForm");
    },
    resetAreaForm() {
      this.areaForm = {
        id: null,
        areaNo: null,
        areaName: null,
        warehouseId: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm("areaForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增仓库按钮操作 */
    handleAddWarehouse() {
      this.resetWarehouseForm();
      this.openWarehouse = true;
      this.title = "添加仓库";
    },
    /** 新增库区按钮操作 */
    handleAddArea() {
      this.resetAreaForm();
      this.areaForm.warehouseId = this.selectedWarehouseId;
      this.openArea = true;
      this.title = "添加库区";
    },
    /** 修改库区按钮操作 */
    handleUpdateArea(row) {
      this.resetAreaForm();
      const id = row.id || this.ids;
      getWmsArea(id).then((response) => {
        this.areaForm = response;
        this.openArea = true;
        this.title = "修改库区";
      });
    },
    /** 修改仓库按钮操作 */
    handleUpdateWarehouse() {
      this.resetWarehouseForm();
      const id = this.selectedWarehouseId;
      getWmsWarehouse(id).then((response) => {
        this.warehouseForm = response;
        this.openWarehouse = true;
        this.title = "修改仓库";
      });
    },
    /** 提交按钮（添加仓库） */
    submitWarehouseForm() {
      this.$refs["warehouseForm"].validate((valid) => {
        if (valid) {
          if (this.warehouseForm.id != null) {
            updateWmsWarehouse(this.warehouseForm).then((response) => {
              this.$store.dispatch("wms/getWarehouseList");
              this.$modal.msgSuccess("修改成功");
              this.openWarehouse = false;
              this.getList();
            });
          } else {
            addWmsWarehouse(this.warehouseForm).then((response) => {
              this.$store.dispatch("wms/getWarehouseList");
              this.$modal.msgSuccess("新增成功");
              this.openWarehouse = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交按钮（添加库区） */
    submitAreaForm() {
      this.$refs["areaForm"].validate((valid) => {
        if (valid) {
          if (this.areaForm.id != null) {
            updateWmsArea(this.areaForm).then((response) => {
              this.$store.dispatch("wms/getAreaList");
              this.$modal.msgSuccess("修改成功");
              this.openArea = false;
              this.loadAreas();
            });
          } else {
            addWmsArea(this.areaForm).then((response) => {
              this.$store.dispatch("wms/getAreaList");
              this.$modal.msgSuccess("新增成功");
              this.openArea = false;
              this.loadAreas();
            });
          }
        }
      });
    },
    /**删除库区按钮 */
    handleDelete(row) {
      const ids = row.id;
      this.$modal
        .confirm('是否确认删除库区编号为"' + ids + '"的数据项？')
        .then(function () {
          return delWmsArea(ids);
        })
        .then(() => {
          this.loadAreas();
          this.$store.dispatch("wms/getAreaList");
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });
    },
    /**删除仓库按钮 */
    handleDeleteWarehouse() {
      const warehouseId = this.selectedWarehouseId;
      this.$modal
        .confirm('是否确认删除仓库编号为"' + warehouseId + '"的数据项？')
        .then(function () {
          return delWmsWarehouse(warehouseId)
        })
        .then(() => {
          this.getList();
          if (this.wmsWarehouseList.length != 0) {
            this.$refs.leftRef.currentName = '0'
          }
          this.$store.dispatch("wms/getWarehouseList");
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { })
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
        .catch(() => { });
    },
    /** 左侧仓库标签页选中操作 */
    handleTabClick(tab, event) {
      this.queryAreaParam = null
      this.selectedWarehouseId = this.wmsWarehouseList[tab.index].id
      this.loadAreas()
      // this.queryAreaParams.warehouseId = tab.warehouseId;
      // this.loadAreas()
    },
    /** 加载选中仓库的库区信息 */
    loadAreas() {
      this.loading = true;
      if (this.selectedWarehouseId == null) {
        if (this.wmsWarehouseList.length == 0) {
          this.wmsAreaList = [];
          return;
        }
        this.queryAreaParams.warehouseId = this.wmsWarehouseList[0].id;
        this.selectedWarehouseId = this.wmsWarehouseList[0].id;
      } else {
        this.queryAreaParams.warehouseId = this.selectedWarehouseId;
      }
      const { pageNum, pageSize } = this.queryAreaParams;
      const query = {
        ...this.queryAreaParams,
        pageNum: undefined,
        pageSize: undefined,
      };
      const pageReq = {page: 0, size: 1000};
      listWmsArea(query, pageReq).then((response) => {
        const { content, totalElements } = response;
        this.wmsAreaList = content;
        this.total = totalElements;
        this.loading = false;
      })
    },
    // 仓库搜索按钮
    handleSearchWarehouse() {
      this.queryAreaParam = null
      if (!this.queryWarehouseParam) {
        this.wmsWarehouseList = this.warehouseList;
      } else {
        this.wmsWarehouseList = this.warehouseList.filter(it => it.warehouseNo == this.queryWarehouseParam || it.warehouseName == this.queryWarehouseParam)
      }
      this.loadAreas()
    },
    // 库区搜索按钮
    handleSearchArea() {
      if (!this.queryAreaParam) {
        this.wmsAreaList = this.areaList.filter(it => it.warehouseId == this.selectedWarehouseId);
        return;
      }
      this.wmsAreaList = this.areaList.filter(it => it.warehouseId == this.selectedWarehouseId && (it.areaNo.search(this.queryAreaParam) !== -1 || it.areaName.search(this.queryAreaParam) !== -1 ));
    }
  },
};
</script>
<style>
.content-wrapper {
  /* margin-left: 20px; */
  /* width: 400px; */
  margin-bottom: 16px;
}

.content-margin {
  margin-bottom: 16px;
}

.info-box {
  /* background-color: #F7FAFC; */
  width: 500px;
  height: 60px;
  padding: 10px 10px;
}

.el-tabs__item {
  width: 200px;
}

.clearfix:after {
  content: ' ';
  display: block;
  height: 0;
  clear: both;
}

.left {
  float: left;
}

.right {
  float: right;
}

.oper_area {
  margin-bottom: 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  width: 200px;
}
</style>
