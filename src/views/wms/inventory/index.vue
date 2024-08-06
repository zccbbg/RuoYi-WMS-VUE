<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
        <el-form-item label="类型" prop="itemId">
          <el-radio-group v-model="queryParams.type" size="medium" @change="handleSortTypeChange">
            <el-radio-button label="1">仓库</el-radio-button>
            <el-radio-button label="2">库区</el-radio-button>
            <el-radio-button label="3">商品</el-radio-button>
          </el-radio-group>
        </el-form-item>
<!--        <el-form-item label="仓库库区">-->
<!--          <WarehouseCascader v-model:value="queryParams.place" :show-all-levels="true" size="default"-->
<!--                                @keyup.enter="handleQuery"></WarehouseCascader>-->
<!--        </el-form-item>-->
        <el-form-item label="商品名称">
          <el-input v-model="queryParams.itemName" clearable placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品编号">
          <el-input v-model="queryParams.itemCode" clearable placeholder="商品编号"></el-input>
        </el-form-item>
        <el-form-item label="规格名称">
          <el-input v-model="queryParams.skuName" clearable placeholder="规格名称"></el-input>
        </el-form-item>
        <el-form-item label="规格编号">
          <el-input v-model="queryParams.skuCode" clearable placeholder="规格编号"></el-input>
        </el-form-item>
<!--        <el-form-item label="仓库库区" prop="place">-->
<!--          <WmsWarehouseCascader v-model:value="queryParams.place" :show-all-levels="true" size="default"-->
<!--                                @keyup.enter="handleQuery"></WmsWarehouseCascader>-->
<!--        </el-form-item>-->
        <el-form-item label="">
          <el-checkbox v-model="filterable" label="过滤掉库存为0的商品" size="large"
                       @change="handleChangeFilterZero"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mt20">
      <el-row :gutter="10" class="mb8" type="flex" justify="space-between">
        <el-col :span="6"><span style="font-size: large">库存看板</span></el-col>
      </el-row>
      <el-table :data="inventoryList" border :span-method="spanMethod"
                cell-class-name="my-cell" v-loading="loading">
        <template v-if="queryParams.type == 1 || queryParams.type == 2">
          <el-table-column label="仓库" prop="warehouseId">
            <template #default="{ row }">
              <div>{{ useWmsStore().warehouseMap.get(row.warehouseId)?.warehouseName }}</div>
            </template>
          </el-table-column>
          <template v-if="queryParams.type == 2">
            <el-table-column label="库区" prop="areaId">
              <template #default="{ row }">
                <div>{{ useWmsStore().areaMap.get(row.areaId)?.areaName }}</div>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="商品信息" :prop="queryParams.type == 1 ? 'warehouseIdAndItemId' : 'areaIdAndItemId'">
            <template #default="{ row }">
              <div>{{ row.item.itemName }}</div>
              <div v-if="row.item.itemCode">商品编号：{{ row.item.itemCode }}</div>
            </template>
          </el-table-column>
          <el-table-column label="规格信息" :prop="queryParams.type == 1 ? 'warehouseIdAndItemIdAndSkuId' : 'areaIdAndSkuId'">
            <template #default="{ row }">
              <div>{{ row.itemSku.skuName }}</div>
              <div v-if="row.itemSku.skuCode">规格编号：{{ row.itemSku.skuCode }}</div>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column label="商品信息" prop="itemId">
            <template #default="{ row }">
              <div>{{ row.item.itemName }}</div>
              <div v-if="row.item.itemCode">商品编号：{{ row.item.itemCode }}</div>
            </template>
          </el-table-column>
          <el-table-column label="规格信息" prop="skuId">
            <template #default="{ row }">
              <div>{{ row.itemSku.skuName }}</div>
              <div v-if="row.itemSku.skuCode">规格编号：{{ row.itemSku.skuCode }}</div>
<!--              <div :class="Number(calcSubtotal(scope.row)) < 0 ? 'text-danger' : ''">总库存：{{-->
<!--                  calcSubtotal(scope.row)-->
<!--                }}-->
<!--              </div>-->
            </template>
          </el-table-column>
          <el-table-column label="仓库" prop="itemIdAndSkuIdAndWarehouseId">
            <template #default="{row}">
              <div>{{ useWmsStore().warehouseMap.get(row.warehouseId)?.warehouseName }}</div>
<!--              <div>-->
<!--                <span :class="Number(calcSubTotalInWarehouse(row)) < Number(row.inventoryWarning) ? 'text-danger' : ''"-->
<!--                >库存：{{ calcSubTotalInWarehouse(row) }}</span-->
<!--                >-->
<!--                <el-popover placement="top-start" :width="200" :icon="InfoFilled" icon-color="red"-->
<!--                            title="库存不足，小于商品规格库存预警值">-->
<!--                  <template #reference>-->
<!--                    <el-icon v-if="Number(calcSubTotalInWarehouse(row)) < Number(row.inventoryWarning)"-->
<!--                             style="cursor: pointer;margin-left: 5px"-->
<!--                    >-->
<!--                      <QuestionFilled color="red"-->
<!--                      />-->
<!--                    </el-icon>-->
<!--                  </template>-->
<!--                </el-popover>-->
<!--              </div>-->
            </template>
          </el-table-column>
          <el-table-column label="所属库区" prop="areaName">
            <template #default="{ row }">
              <div>{{ useWmsStore().areaMap.get(row.areaId)?.areaName }}</div>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="库存" prop="quantity" align="right">
          <template #default="{ row }">
            <el-statistic :value="Number(row.quantity)" :precision="0"/>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum"
                    v-model:limit="queryParams.pageSize" @pagination="getList"/>
      </el-row>
    </el-card>
  </div>
</template>

<script setup name="Inventory">
import {
  listInventoryBoard
} from '@/api/wms/inventory';
import {computed, getCurrentInstance, onMounted, reactive, ref} from 'vue';
import {ElForm} from 'element-plus';
import {getRowspanMethod} from "@/utils/getRowSpanMethod";
// import {InfoFilled} from "@element-plus/icons";
import {useWmsStore} from '@/store/modules/wms'
// import WarehouseCascader from "@/views/components/WarehouseCascader.vue";

const {proxy} = getCurrentInstance();
const spanMethod = computed(() => getRowspanMethod(inventoryList.value, rowSpanArray.value))

const inventoryList = ref([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const rowSpanArray = ref(['warehouseId', 'warehouseIdAndItemId', 'warehouseIdAndSkuId'])
const queryFormRef = ref(ElForm);
const inventoryFormRef = ref(ElForm);

const filterable = ref(false)

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  skuId: undefined,
  warehouseId: undefined,
  areaId: undefined,
  itemName: undefined,
  itemCode: undefined,
  skuName: undefined,
  skuCode: undefined,
  type: 1,
  minQuantity: undefined
})

/** 查询库存列表 */
const getList = async () => {
  const query = {...queryParams.value}
  if (filterable.value) {
    query.minQuantity = 1
  } else {
    query.minQuantity = undefined
  }
  loading.value = true;
  const res = await listInventoryBoard(queryParams.value);
  inventoryList.value = res.rows;
  inventoryList.value.forEach(it => {
    if (query.type == 1) {
      it.warehouseIdAndItemId = it.warehouseId + '-' + it.itemSku.itemId
      it.warehouseIdAndItemIdAndSkuId = it.warehouseId + '-' + it.itemSku.itemId + '-' + it.itemSku.id
    } else if (query.type == 2) {
      it.areaIdAndItemId = it.areaId + '-' + it.itemSku.itemId
      it.areaIdAndSkuId = it.areaId + '-' + it.itemSku.id
    } else if (query.type == 3) {
      it.itemId = it.itemSku.itemId
    }
  })
  console.info("list:", inventoryList.value)
  total.value = res.total;
  loading.value = false;
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
}
const calcSubtotal = (row) => {
  const tempList = inventoryList.value.filter(it => it.itemId === row.itemId)
  let sum = 0
  tempList.forEach(it => {
    sum += Number(it.quantity)
  })
  return sum
}

const calcSubTotalInWarehouse = (row) => {
  const tempList = inventoryList.value.filter(it => (it.itemId + '-' + it.warehouseId) === (row.itemId + '-' + row.warehouseId))
  let sum = 0
  tempList.forEach(it => {
    sum += Number(it.quantity)
  })
  return sum
}

const handleSortTypeChange = (e) => {
  if (e == 1) {
    rowSpanArray.value = ['warehouseId', 'warehouseIdAndItemId', 'warehouseIdAndItemIdAndSkuId']
  } else if (e == 2) {
    rowSpanArray.value = ['warehouseId', 'areaId', 'areaIdAndItemId', 'areaIdAndSkuId']
  } else if (e == 3) {
    rowSpanArray.value = ['itemId', 'skuId']
  }
  queryParams.value.pageNum = 1;
  getList()
}

const handleChangeFilterZero = (e) => {
  queryParams.value.pageNum = 1;
  getList()
}

onMounted(() => {
  getList();
});
</script>
<style>
.el-table .my-cell {
  vertical-align: top
}
.el-statistic__content {
  font-size: 14px;
}
</style>
