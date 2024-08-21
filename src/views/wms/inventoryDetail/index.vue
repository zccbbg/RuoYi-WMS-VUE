<template>
  <div class="app-container">
    <el-card class="mt20">
    <div class="mb8 flex-space-between">
      <div style="font-size: large">库存明细</div>
    </div>
    <el-table :data="inventoryDetailList" border :span-method="spanMethod"
              cell-class-name="vertical-top-cell" v-loading="loading" empty-text="暂无库存">
      <template v-if="queryType === 'warehouse'">
        <el-table-column label="仓库" prop="warehouseId">
          <template #default="{ row }">
            <div>{{ useWmsStore().warehouseMap.get(row.warehouseId)?.warehouseName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="库区" prop="areaId">
          <template #default="{ row }">
            <div>{{ useWmsStore().areaMap.get(row.areaId)?.areaName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" prop="areaIdAndItemId">
          <template #default="{ row }">
            <div>{{ row.item.itemName }}</div>
            <div v-if="row.item.itemCode">商品编号：{{ row.item.itemCode }}</div>
            <div>{{ row.item.id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="规格信息" prop="areaIdAndSkuId">
          <template #default="{ row }">
            <div>{{ row.itemSku.skuName }}</div>
            <div v-if="row.itemSku.skuCode">规格编号：{{ row.itemSku.skuCode }}</div>
            <div>{{ row.itemSku.id }}</div>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="入库日期" align="left" prop="createTime" width="140">
        <template #default="{ row }">
          <div>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="quantity" align="right">
        <template #default="{ row }">
          <el-statistic :value="Number(row.quantity)" :precision="0"/>
        </template>
      </el-table-column>
      <el-table-column label="批号" align="left" prop="batchNo"/>
      <el-table-column label="生产日期/过期日期" align="left" width="180">
        <template #default="{ row }">
          <div v-if="row.productionDate">生产日期：{{ parseTime(row.productionDate, '{y}-{m}-{d}') }}</div>
          <div v-if="row.expirationDate">过期日期：{{ parseTime(row.expirationDate, '{y}-{m}-{d}') }}</div>
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
  </el-card>
  </div>
</template>
<script setup name="InventoryDetail">
import {useWmsStore} from "@/store/modules/wms";
import {computed, onMounted, reactive, ref} from "vue";
import {listInventoryDetail} from "@/api/wms/inventoryDetail";
import {getRowspanMethod} from "@/utils/getRowSpanMethod";

const spanMethod = computed(() => getRowspanMethod(inventoryDetailList.value, rowSpanArray.value))
const queryType = ref("warehouse");
const inventoryDetailList = ref([]);
const loading = ref(false);
const rowSpanArray = ref(['warehouseId', 'areaId', 'areaIdAndItemId', 'areaIdAndSkuId'])
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
const total = ref(0);
const pageReq = reactive({
  page: 1,
  size: 10,
});

onMounted(() => {
  getList();
})

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
    inventoryDetailList.value = res.rows;
    total.value = res.total;
    inventoryDetailList.value.forEach(it => {
      if (queryType.value == "warehouse") {
        it.areaIdAndItemId = it.areaId + '-' + it.item.id
        it.areaIdAndSkuId = it.areaId + '-' + it.itemSku.id
      } else if (queryType.value == "item") {
        it.itemId = it.itemSku.itemId
      }
    })
    console.info("list:", inventoryDetailList.value)
  }).finally(() => loading.value = false);
}
</script>
