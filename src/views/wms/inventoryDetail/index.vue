<template>
  <div class="app-container">
    <el-card>

      <el-form :model="queryParams" :inline="true" label-width="108px" style="display:flex;justify-content: space-between;flex-wrap: wrap">
        <el-form-item label-width="90px" label="仓库" prop="warehouseId" class="col4">
          <el-select v-model="queryParams.warehouseId" placeholder="请选择仓库" @change="handleChangeWarehouse"
                     filterable clearable style="width:100%;">
            <el-option v-for="item in useWmsStore().warehouseList" :key="item.id" :label="item.warehouseName"
                       :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label-width="90px" label="库区" prop="areaId" class="col4">
          <el-select v-model="queryParams.areaId" placeholder="请选择库区" :disabled="!queryParams.warehouseId || queryParams.type == 1" clearable
                     filterable style="width:100%;">
            <el-option v-for="item in useWmsStore().areaList.filter(it => it.warehouseId === queryParams.warehouseId)"
                       :key="item.id" :label="item.areaName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item class="col4" label-width="90px" label="商品名称">
          <el-input v-model="queryParams.itemName" clearable placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item class="col4" label-width="90px" label="商品编号">
          <el-input class="w200" v-model="queryParams.itemCode" clearable placeholder="商品编号"></el-input>
        </el-form-item>
        <el-form-item class="col4" label-width="90px" label="规格名称">
          <el-input class="w200" v-model="queryParams.skuName" clearable placeholder="规格名称"></el-input>
        </el-form-item>
        <el-form-item class="col4" label-width="90px" label="规格编号">
          <el-input class="w200" v-model="queryParams.barcode" clearable placeholder="规格编号"></el-input>
        </el-form-item>
        <el-form-item class="col4" label-width="90px" label="批号">
          <el-input class="w200" v-model="queryParams.batchNo" clearable placeholder="批号"></el-input>
        </el-form-item>
        <el-form-item class="col4" label-width="90px" label="过期" prop="daysToExpires">
          <el-select v-model="queryParams.daysToExpires" clearable style="width:100%;">
            <el-option label="30天内" :value="30">30天内</el-option>
            <el-option label="60天内" :value="60">60天内</el-option>
            <el-option label="90天内" :value="90">90天内</el-option>
            <el-option label="120天内" :value="120">120天内</el-option>
            <el-option label="180天内" :value="180">180天内</el-option>
            <el-option label="365天内" :value="365">365天内</el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="col4" label-width="90px" label="入库日期" prop="createTimeRange">
          <el-date-picker
            v-model="queryParams.createTimeRange"
            type="daterange"
            range-separator="至"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD"
            :default-time="defaultTime"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clickQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
          </template>
        </el-table-column>
        <el-table-column label="规格信息" prop="areaIdAndSkuId">
          <template #default="{ row }">
            <div>{{ row.itemSku.skuName }}</div>
            <div v-if="row.itemSku.skuCode">规格编号：{{ row.itemSku.skuCode }}</div>
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
import {ElForm} from "element-plus";

const spanMethod = computed(() => getRowspanMethod(inventoryDetailList.value, rowSpanArray.value))
const queryType = ref("warehouse");
const inventoryDetailList = ref([]);
const loading = ref(false);
const rowSpanArray = ref(['warehouseId', 'areaId', 'areaIdAndItemId', 'areaIdAndSkuId'])
const queryParams = ref({
  itemName: '',
  itemCode: '',
  skuName: '',
  skuCode: '',
  areaId: undefined,
  warehouseId: undefined,
  batchNo: '',
  daysToExpires: undefined
});
const total = ref(0);
const pageReq = reactive({
  page: 1,
  size: 10,
});

const handleChangeWarehouse = () => {
  queryParams.value.areaId = undefined
}

onMounted(() => {
  getList();
})



const getList = () => {
  const queryCopy = {...queryParams}
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
<style scoped lang="scss">
.col4 {
  width: calc(24% - 1rem);
}
</style>
