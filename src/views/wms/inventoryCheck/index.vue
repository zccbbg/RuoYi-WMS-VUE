<template>
  <div class="app-container">
    <div v-show="show">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
               class="ry_form">
        <el-form-item label="库存盘点单号" prop="inventoryCheckNo">
          <el-input
            v-model="queryParams.inventoryCheckNo"
            placeholder="请输入库存盘点单号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="盘点状态" prop="inventoryCheckStatus">

          <DictRadio v-model="queryParams.inventoryCheckStatus" @change="handleQuery" size="small"
                     :radioData="dict.type.wms_check_status" :showAll="'all'"/>

        </el-form-item>

        <el-form-item label="所属仓库" prop="warehouseId">
          <wms-warehouse-cascader v-model="queryParams.warehouseArr" size="small" :checkStrictly=true></wms-warehouse-cascader>
        </el-form-item>

        <el-form-item class="flex_one tr">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini"
                     @click="showMoreCondition = !showMoreCondition">{{ showMoreCondition ? '收起条件' : '展开条件' }}
          </el-button>
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
            v-hasPermi="['wms:inventoryCheck:add']"
          >新增盘点单
          </el-button>
        </el-col>

        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
            v-hasPermi="['wms:inventoryCheck:export']"
          >导出
          </el-button>
        </el-col> -->
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
      </el-row>

      <WmsTable v-loading="loading" :data="wmsInventoryCheckList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="库存盘点单号" align="center" prop="inventoryCheckNo"
                         v-if="columns[0].visible"/>
        <!--      <el-table-column label="库存盘点类型" align="center" prop="inventoryCheckType" v-if="columns[1].visible"/>-->

        <el-table-column label="盈亏数" align="center" prop="inventoryCheckTotal" v-if="columns[3].visible"/>
        <!--      <el-table-column label="审核状态" align="center" prop="checkStatus" v-if="columns[4].visible"/>
              <el-table-column label="审核人" align="center" prop="checkUserId" v-if="columns[5].visible"/>
              <el-table-column label="审核时间" align="center" prop="checkTime" width="180" v-if="columns[6].visible">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.checkTime, '') }}</span>
                </template>
              </el-table-column>-->
        <!--      <el-table-column label="所属仓库" align="center" prop="warehouseId" v-if="columns[7].visible"/>
              <el-table-column label="所属库区" align="center" prop="areaId" v-if="columns[8].visible"/>-->
        <el-table-column label="所属仓库" align="center" prop="rackId" v-if="columns[4].visible">
          <template v-slot="{ row }"><span>{{ row.warehouseName }}</span><span
            v-if="row.areaName">/{{ row.areaName }}</span><span v-if="row.rackName">/{{ row.rackName }}</span></template>
        </el-table-column>
        <el-table-column label="库存盘点单状态" align="center" prop="inventoryCheckStatus" v-if="columns[2].visible">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_check_status" :value="scope.row.inventoryCheckStatus"/>
          </template>

        </el-table-column>

        <el-table-column label="备注" align="center" prop="remark" v-if="columns[11].visible"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleView(scope.row)"
              v-hasPermi="['wms:inventoryCheck:edit']"
            >查看
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.inventoryCheckStatus == '11'"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['wms:inventoryCheck:edit']"
            >继续盘点
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-if="scope.row.inventoryCheckStatus == '11'"
              @click="handleDelete(scope.row)"
              v-hasPermi="['wms:inventoryCheck:remove']"
            >删除
            </el-button>
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
    <SeeAdsComponent ref="seeAdsComponentRef" v-if="!show" @confirmOk="confirmOk"/>

  </div>
</template>

<script>
import {
  addWmsInventoryCheck,
  delWmsInventoryCheck,
  exportWmsInventoryCheck,
  listWmsInventoryCheck,
  updateWmsInventoryCheck
} from "@/api/wms/inventoryCheck";
import {randomId} from "@/utils/RandomUtils";
import { mapGetters } from 'vuex'
import { isStarRepo } from '@/utils/is-star-plugin'
import SeeAdsComponent from '@/components/SeeAdsComponent.vue'

export default {
  name: "WmsInventoryCheck",
  dicts: ["wms_check_status"],
  components: {SeeAdsComponent},
  computed: {
    ...mapGetters(['userId', 'warehouseMap', 'areaMap']),
  },
  data() {
    return {
      show: false,
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
      // 库存盘点单据表格数据
      wmsInventoryCheckList: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inventoryCheckNo: null,
        inventoryCheckType: null,
        inventoryCheckStatus: null,
        inventoryCheckTotal: null,
        checkStatus: null,
        checkUserId: null,
        checkTime: null,
        warehouseId: null,
        areaId: null,
        rackId: null,
        attachment: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      columns: [
        {key: 1, label: "库存盘点单号，系统自动生成", visible: true},
        {key: 2, label: "库存盘点类型", visible: true},
        {key: 3, label: "库存盘点单状态", visible: true},
        {key: 4, label: "盈亏数", visible: true},
        {key: 5, label: "审核状态", visible: true},
        {key: 6, label: "审核人", visible: true},
        {key: 7, label: "审核时间", visible: true},
        {key: 8, label: "所属仓库", visible: true},
        {key: 9, label: "所属库区", visible: true},
        {key: 10, label: "货架", visible: false},
        {key: 11, label: "附件文件", visible: false},
        {key: 12, label: "备注", visible: false},
      ],
      showMoreCondition: false
    };
  },
  async created() {
    this.$nextTick(()=>{
      this.$refs.seeAdsComponentRef.show()
    })
  },
  methods: {
    async confirmOk(success){
      if (success) {
        const res = await isStarRepo('zccbbg','wms-ruoyi',this.userId,'http://wms.ichengle.top/inventoryCheck','Wms-Ruoyi-仓库库存管理','https://gitee.com/zccbbg/wms-ruoyi')
        this.show = res;
        if (res) {
          this.getList()
        }
      }
    },
    /** 查询库存盘点单据列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize, warehouseArr} = this.queryParams;
      const [warehouseId, areaId, rackId] = warehouseArr || [];
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined, warehouseId, areaId, rackId};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsInventoryCheck(query, pageReq).then(response => {
        const {content, totalElements} = response
        this.wmsInventoryCheckList = content;
        this.wmsInventoryCheckList.forEach(it => {
          it.warehouseName = this.warehouseMap.get(it.warehouseId)
          it.areaName = this.areaMap.get(it.areaId)
        })
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        inventoryCheckNo: 'IV-' + randomId(),
        inventoryCheckType: null,
        inventoryCheckStatus: 0,
        inventoryCheckTotal: null,
        checkStatus: 0,
        checkUserId: null,
        checkTime: null,
        warehouseId: null,
        areaId: null,
        rackId: null,
        attachment: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({path: '/check/edit'})
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      this.$router.push({path: '/check/edit', query: {id}})
    },
    /** 查看按钮操作 */
    handleView(row) {
      const id = row.id || this.ids
      this.$router.push({path: '/check/status', query: {id}})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const {warehouseArr} = this.form
          const [warehouseId, areaId, rackId] = warehouseArr || [];
          this.form.warehouseId = warehouseId
          this.form.areaId = areaId
          this.form.rackId = rackId

          if (this.form.id != null) {
            updateWmsInventoryCheck(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsInventoryCheck(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库存盘点单据编号为"' + ids + '"的数据项？').then(function () {
        return delWmsInventoryCheck(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有库存盘点单据数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsInventoryCheck(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {
      });
    }
  }
};
</script>
