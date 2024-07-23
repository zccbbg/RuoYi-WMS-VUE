<template>
  <div class="app-container">
    <div v-show="show">
      <el-form class="ry_form" v-show="showSearch" :inline="true" label-width="100px" :model="queryParams" ref="queryForm"
               size="medium">
        <el-form-item label="类型" prop="panelType">
          <DictRadio v-model="queryParams.panelType" :radioData="dict.type.wms_inventory_panel_type" size="small"
                     @change="handleQuery"></DictRadio>
        </el-form-item>
        <el-form-item label="物料" prop="itemId">
          <item-select v-model="queryParams.itemId"></item-select>
        </el-form-item>
        <el-form-item label="仓库" prop="rackId">
          <wms-warehouse-cascader v-model="queryParams.place" :checkStrictly=true></wms-warehouse-cascader>
        </el-form-item>
        <el-form-item label="库存" prop="quantity">
          <number-range v-model="queryParams.quantityRange"></number-range>
        </el-form-item>
        <el-form-item class="flex_one tr">
          <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row class="mb8" :gutter="10">
        <!--      <el-col :span="1.5">-->
        <!--        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"-->
        <!--                   @click="handleExport"-->
        <!--                   v-hasPermi="['wms:item:export']">导出-->
        <!--        </el-button>-->
        <!--      </el-col>-->
        <right-toolbar :columns="columns" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <component :is="currentComponent" v-loading="loading" @update="getList"  :table-data="wmsInventoryList"></component>
      <pagination v-show="total&gt;0" :limit.sync="pageReq.size" :page.sync="pageReq.page" :total="total"
                  @pagination="getList"></pagination>
    </div>
    <SeeAdsComponent ref="seeAdsComponentRef" v-if="!show" @confirmOk="confirmOk"/>


  </div>
</template>

<script>
import {
  listWmsInventory,
  exportWmsInventory
} from '@/api/wms/inventory'
import NumberRange from '@/components/NumberRange'
import ItemSelect from '@/components/ItemSelect'
import PanelByItem from "@/views/wms/inventory/component/PanelByItem.vue";
import PanelByItemType from "@/views/wms/inventory/component/PanelByItemType.vue";
import PanelByWarehouse from "@/views/wms/inventory/component/PanelByWarehouse.vue";
import PanelByArea from "@/views/wms/inventory/component/PanelByArea.vue";
import { isStarRepo } from "@/utils/is-star-plugin";
import {mapGetters} from 'vuex'
import SeeAdsComponent from '@/components/SeeAdsComponent.vue'

export default {
  name: 'WmsInventory',
  components: { SeeAdsComponent, PanelByArea, PanelByWarehouse, PanelByItemType, PanelByItem, ItemSelect, NumberRange},
  dicts: ['wms_inventory_panel_type'],
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
      // 库存表格数据
      wmsInventoryList: [],
      // 查询参数
      queryParams: {
        itemId: null,
        place: null,
        quantityRange: [],
        panelType: 5
      },
      pageReq: {
        page: 1,
        size: 10
      },
      // 表单参数
      form: {},
      columns: false,
      panelType: 5
    }
  },
  async created() {
    this.$nextTick(()=>{
      this.$refs.seeAdsComponentRef.show()
    })
  },
  computed: {
    ...mapGetters(['userId']),
    currentComponent() {
      let type = parseInt(this.panelType)
      switch (type) {
        case 5:
          return 'panel-by-warehouse';
        case 10:
          return 'panel-by-area';
        case 20:
          return 'panel-by-item-type';
        default:
          return '';
      }
    }
  },
  methods: {
    async confirmOk(success){
      if (success) {
       this.show = true;
       this.getList()
      }
    },
    /** 查询库存列表 */
    getList() {
      this.loading = true
      const {place, quantityRange, itemId, panelType} = this.queryParams;
      this.panelType = panelType;
      const [warehouseId, areaId, rackId] = place || [];
      const [quantityStart, quantityEnd] = quantityRange || [];
      const query = {warehouseId, areaId, rackId, itemId, quantityStart, quantityEnd, panelType}
      const pageReq = {...this.pageReq}
      pageReq.page -= 1;
      listWmsInventory(query, pageReq).then(response => {
        const {content, totalElements} = response
        this.wmsInventoryList = content

        if (panelType == 5 || panelType == 20) {
          // 10 库区需要考虑库区是否为空
          content.forEach(item => {
            if (!item.warehouseName) {
              item.warehouseName = "暂未分配仓库"
            }
            if (item.areaName) {
              item.warehouseName = item.warehouseName + '/' + item.areaName
            }
          })
        } else if (panelType == 10) {
          // 库区
          content.forEach(item => {
            if (!item.warehouseName) {
              item.warehouseName = "暂未分配仓库"
            }
            if (!item.areaName) {
              item.areaName = "暂未分配库区"
            }
          })

        }
        this.total = totalElements
        this.loading = false
      })
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        itemId: null,
        rackId: null,
        quantity: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.pageReq.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.place = null
      this.queryParams.quantityRange = null
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$modal.confirm('是否确认导出所有库存数据项？').then(() => {
        this.exportLoading = true
        return exportWmsInventory(queryParams)
      }).then(response => {
        this.$download.download(response)
        this.exportLoading = false
      }).catch(() => {
      })
    }
  }
}
</script>
