<template>
  <el-drawer :model-value="show" title="选择库存" @close="handleCancelClick" :size="size" :close-on-click-modal="false"
             append-to-body>
    <el-form :inline="true" label-width="68px">
      <el-form-item label="商品名称">
        <el-input v-model="query.itemName" clearable placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品编号">
        <el-input class="w200" v-model="query.itemCode" clearable placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item label="规格名称">
        <el-input class="w200" v-model="query.skuName" clearable placeholder="规格名称"></el-input>
      </el-form-item>
      <el-form-item label="规格编号">
        <el-input class="w200" v-model="query.barcode" clearable placeholder="规格编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadAll">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" @selection-change="handleSelectionChange" border :row-key="getRowKey" empty-text="暂无库存"
              v-loading="loading" ref="inventorySelectFormRef" cell-class-name="my-cell" class="mt20">
      <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="judgeSelectable"/>
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
      <el-table-column label="剩余库存" prop="quantity" align="right">
        <template #default="{ row }">
          <el-statistic :value="Number(row.quantity)" :precision="0"/>
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
<script setup name="InventorySelect">
import {computed, getCurrentInstance, nextTick, onMounted, reactive, ref, watch} from 'vue';
import {ElForm} from "element-plus";
import {getRowspanMethod} from "@/utils/getRowSpanMethod";
import {useRouter} from "vue-router";
import {useWmsStore} from '@/store/modules/wms'
import {listInventory} from "@/api/wms/inventory";
import {getWarehouseAndSkuKey} from "@/utils/wmsUtil";

const {proxy} = getCurrentInstance()

const spanMethod = computed(() => getRowspanMethod(list.value, ['itemId']))
const router = useRouter()
const loading = ref(false)
const deptOptions = ref([]);
const query = reactive({
  itemName: '',
  itemCode: '',
  skuName: '',
  skuCode: '',
  minQuantity: 1,
  areaId: null,
  warehouseId: null
});
const selectInventoryVoCheck = ref([])
const inventorySelectFormRef = ref(null)
const total = ref(0);
const pageReq = reactive({
  page: 1,
  size: 10,
});
const list = ref([]);
const rightList = ref([]);
const rightListKeySet = computed(() => {
  const set = new Set();
  rightList.value.forEach((it) => set.add(it.id));
  return set
});

const editableList = computed(() => {
  return list.value.filter((it) => !rightListKeySet.value.has(it.id));
});

const loadAll = () => {
  pageReq.page = 1
  getList()
};
const getRowKey = (row) => {
  return row.id;
}
const getList = () => {
  const data = {
    ...query,
    pageNum: pageReq.page,
    pageSize: pageReq.size
  }
  loading.value = true
  listInventory(data).then((res) => {
    const content = [...res.rows];
    list.value = content.map((item) => (
      {
        ...item,
        warehouseName: useWmsStore().warehouseMap.get(item.warehouseId)?.warehouseName
      }
    ));
    total.value = res.total;
  }).then(() => toggleSelection()).finally(() => loading.value = false);
}

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
    const index = list.value.findIndex(it => getWarehouseAndSkuKey(selected) === getWarehouseAndSkuKey(it))
    if (index !== -1) {
      inventorySelectFormRef.value.toggleRowSelection(list.value[index], true)
    }
  })
}

function clearSelected() {
  inventorySelectFormRef.value.clearSelection()
}

const judgeSelectable = (row) => {
  if (props.selectedInventory.find(selected => getWarehouseAndSkuKey(selected) === getWarehouseAndSkuKey(row))) {
    return false;
  }
  return true
}

const setWarehouseId = (warehouseId = null) => {
  query.warehouseId = warehouseId
}

defineExpose({
  setWarehouseId,
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

