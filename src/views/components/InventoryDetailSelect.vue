<template>
  <el-drawer :model-value="show" title="选择库存" @close="handleCancelClick" :size="size" :close-on-click-modal="false"
             append-to-body>
    <el-form :inline="true" label-width="108px">
      <el-form-item label="商品名称">
        <el-input v-model="query.itemName" clearable placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品编号">
        <el-input class="w200" v-model="query.itemCode" clearable placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item label="库区">
        <el-select v-model="query.areaId" placeholder="请选择库区" :disabled="selectAreaDisable"
                   clearable filterable @change="">
          <el-option v-for="item in useWmsStore().areaList.filter(it => it.warehouseId === query.warehouseId)"
                     :key="item.id" :label="item.areaName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="规格名称">
        <el-input class="w200" v-model="query.skuName" clearable placeholder="规格名称"></el-input>
      </el-form-item>
      <el-form-item label="规格编号">
        <el-input class="w200" v-model="query.barcode" clearable placeholder="规格编号"></el-input>
      </el-form-item>
      <el-form-item label="批号">
        <el-input class="w200" v-model="query.batchNo" clearable placeholder="批号"></el-input>
      </el-form-item>
      <el-form-item label="入库日期" prop="createTimeRange">
        <el-date-picker
          v-model="query.createTimeRange"
          type="daterange"
          range-separator="至"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD"
          :default-time="defaultTime"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="多少天内过期" prop="daysToExpires">
        <el-select v-model="query.daysToExpires" clearable>
          <el-option label="30天内" :value="30">30天内</el-option>
          <el-option label="60天内" :value="60">60天内</el-option>
          <el-option label="90天内" :value="90">90天内</el-option>
          <el-option label="120天内" :value="120">120天内</el-option>
          <el-option label="180天内" :value="180">180天内</el-option>
          <el-option label="365天内" :value="365">365天内</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" @selection-change="handleSelectionChange" border :row-key="getRowKey" empty-text="暂无库存"
              v-loading="loading" ref="inventorySelectFormRef" cell-class-name="my-cell" class="mt20">
      <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="judgeSelectable"/>
      <el-table-column label="库区" prop="areaName"/>
      <el-table-column label="商品信息" prop="itemId">
        <template #default="{ row }">
          <div>{{ row.item.itemName }}</div>
          <div v-if="row.item.itemCode">编号：{{ row.item.itemCode }}</div>
          <div v-if="row.item.itemBrand">品牌：{{ useWmsStore().itemBrandMap.get(row.item.itemBrand).brandName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="规格信息">
        <template #default="{ row }">
          <div>{{ row.itemSku.skuName }}</div>
          <div v-if="row.itemSku.skuCode">编号：{{ row.itemSku.skuCode }}</div>
          <div v-if="row.itemSku.barcode">条码：{{ row.itemSku.barcode }}</div>
        </template>
      </el-table-column>
      <el-table-column label="批号" align="left" prop="batchNo"/>
      <el-table-column label="生产日期/过期日期" align="left" width="180">
        <template #default="{ row }">
          <div v-if="row.productionDate">生产日期：{{ parseTime(row.productionDate, '{y}-{m}-{d}') }}</div>
          <div v-if="row.expirationDate">过期日期：{{ parseTime(row.expirationDate, '{y}-{m}-{d}') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="入库日期" align="left" prop="createTime" width="140">
        <template #default="{ row }">
          <div>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="剩余库存" prop="remainQuantity" align="right">
        <template #default="{ row }">
          <el-statistic :value="Number(row.remainQuantity)" :precision="0"/>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination
        v-show="total>0"
        :total="total"
        v-model:limit="pageReq.size"
        v-model:page="pageReq.page"
        @pagination="getList"
        class="mr10"
      />
    </el-row>

    <template v-slot:footer>
      <div style="width: 100%;display: flex;justify-content: space-between">
        <span>
        </span>
        <span>
          <el-button @click="handleCancelClick">取消</el-button>
          <el-button type="primary" @click="handleOkClick">确认</el-button>
      </span>
      </div>
    </template>
  </el-drawer>
</template>
<script setup name="InventoryDetailSelect">
import {computed, getCurrentInstance, onMounted, reactive, ref} from 'vue';
import {ElForm} from "element-plus";
import {useRouter} from "vue-router";
import {useWmsStore} from '@/store/modules/wms'
import {listInventoryDetail} from "@/api/wms/inventoryDetail";
const {proxy} = getCurrentInstance()
const defaultTime = reactive([new Date(0,0,0,0,0,0), new Date(0,0,0,23,59,59)])

const router = useRouter()
const loading = ref(false)
const query = reactive({
  itemName: '',
  itemCode: '',
  skuName: '',
  skuCode: '',
  minQuantity: 1,
  areaId: null,
  warehouseId: null,
  batchNo: '',
  daysToExpires: null
});
const selectInventoryVoCheck = ref([])
const inventorySelectFormRef = ref(null)
const total = ref(0);
const pageReq = reactive({
  page: 1,
  size: 10,
});
const selectAreaDisable = ref(false)
const list = ref([]);


const loadAll = () => {
  pageReq.page = 1
  getList()
};
const getRowKey = (row) => {
  return row.id;
}
const getList = () => {
  const queryCopy = {...query}
  if (queryCopy.createTimeRange) {
    queryCopy.createStartTime = queryCopy.createTimeRange[0]
    queryCopy.createEndTime = queryCopy.createTimeRange[1]
  }
  const data = {
    ...queryCopy,
    pageNum: pageReq.page,
    pageSize: pageReq.size
  }
  loading.value = true
  listInventoryDetail(data).then((res) => {
    const content = [...res.rows];
    list.value = content.map((item) => (
      {
        ...item,
        warehouseName: useWmsStore().warehouseMap.get(item.warehouseId)?.warehouseName,
        areaName: useWmsStore().areaMap.get(item.areaId)?.areaName
      }
    ));
    total.value = res.total;
  }).then(() => toggleSelection()).finally(() => loading.value = false);
}

const clickQuery = () => {
  pageReq.page = 1;
  loadAll();
};

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: '30%'
  },
  selectedInventory: {
    type: Array,
    default: []
  }
})

const show = computed(() => {
  return props.modelValue;
})

const emit = defineEmits(["handleCancelClick", 'handleOkClick']);

function handleCancelClick() {
  emit('handleCancelClick');
  clearSelected()
}

function handleOkClick() {
  emit('handleOkClick', selectInventoryVoCheck.value);
  clearSelected()
}

/** 多选框选中数据 */
const handleSelectionChange = (selection) => {
  selectInventoryVoCheck.value = selection
}

const toggleSelection = () => {
  props.selectedInventory.forEach(selected => {
    const index = list.value.findIndex(it => selected.id === it.id)
    if (index !== -1) {
      inventorySelectFormRef.value.toggleRowSelection(list.value[index], true)
    }
  })
}

function clearSelected() {
  inventorySelectFormRef.value.clearSelection()
}

const getVolumeText = (row) => {
  if ((row.length || row.length === 0) && (row.width || row.width === 0) && (row.height || row.height === 0)) {
    return row.length + ' * ' + row.width + ' * ' + row.height
  }
  return ((row.length || row.length === 0) ? ('长：' + row.length) : '')
    + ((row.width || row.width === 0) ? (' 宽：' + row.width) : '')
    + ((row.height || row.height === 0) ? (' 高：' + row.height) : '')
}

const setWarehouseIdAndAreaId = (warehouseId = null, areaId = null) => {
  query.warehouseId = warehouseId
  query.areaId = areaId
  if (areaId) {
    selectAreaDisable.value = true
  } else {
    selectAreaDisable.value = false
  }
}

const judgeSelectable = (row) => {
  if (props.selectedInventory.find(selected => selected.id === row.id)) {
    return false;
  }
  return true
}

const getPlaceAndSkuKey = (row) => {
  return row.warehouseId + '_' + row.areaId + '_' + row.skuId
}

defineExpose({
  setWarehouseIdAndAreaId,
  getList
})
onMounted(() => {
  loadAll();
})
</script>
<style lang="scss">
.el-table .my-cell {
  vertical-align: top
}

.el-statistic__content {
  font-size: 14px;
}
</style>

