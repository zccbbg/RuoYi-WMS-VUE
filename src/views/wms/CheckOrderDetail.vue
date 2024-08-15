<template>
  <el-drawer :model-value="show" :title="'盘库单【' + checkOrderNo + '】的商品明细'" @close="handleCancelClick" :size="size" :close-on-click-modal="false"
             append-to-body>
    <div class="flex-space-between">
      <div></div>
      <el-checkbox v-model="queryParams.haveProfitAndLoss" label="只查看有盈亏数的" @change="handleQuery"/>
    </div>
    <el-table :data="list" border empty-text="暂无商品明细" v-loading="loading" ref="inventorySelectFormRef"
              cell-class-name="my-cell" class="mt20">
      <el-table-column label="商品名称">
        <template #default="{ row }">
          <div>{{ row?.itemSku?.item?.itemName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="规格名称">
        <template #default="{ row }">
          <div>{{ row?.itemSku?.skuName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="库区" prop="areaName"/>
      <el-table-column label="批号" prop="batchNo"/>
      <el-table-column label="生产日期/过期日期" width="180">
        <template #default="{ row }">
          <div v-if="row.productionDate">生产日期：{{ parseTime(row.productionDate, '{y}-{m}-{d}') }}</div>
          <div v-if="row.expirationDate">过期日期：{{ parseTime(row.expirationDate, '{y}-{m}-{d}') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="入库日期" prop="receiptTime" width="120">
        <template #default="{ row }">
          <div>{{ parseTime(row.receiptTime, '{y}-{m}-{d}') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账面库存" prop="quantity" align="right">
        <template #default="{ row }">
          <el-statistic :value="Number(row.quantity)" :precision="0"/>
        </template>
      </el-table-column>
      <el-table-column label="盈亏数" align="right">
        <template #default="{ row }">
          <el-statistic :value="Number(row.checkQuantity) - Number(row.quantity)" :precision="0"/>
        </template>
      </el-table-column>
      <el-table-column label="实际库存" prop="checkQuantity" align="right">
        <template #default="{ row }">
          <el-statistic :value="Number(row.checkQuantity)" :precision="0"/>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <pagination
        v-show="total>0"
        :total="total"
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNum"
        @pagination="getList"
        class="mr10"
      />
    </el-row>
  </el-drawer>

</template>

<script setup>
import {useWmsStore} from "@/store/modules/wms";
import {computed, reactive, ref} from "vue";
import {listCheckOrderDetail} from "@/api/wms/checkOrderDetail";

const list = ref([]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: '80%'
  },
  checkOrderNo: {
    type: String,
    default: ''
  }
})
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  checkOrderId: null,
  haveProfitAndLoss: false,
});
const total = ref(0)
const loading = ref(false)
const show = computed(() => {
  return props.modelValue;
})
const emit = defineEmits(["handleCancelClick"]);

function setCheckOrderId(checkOrderId) {
  queryParams.value.checkOrderId = checkOrderId
}

defineExpose({
  handleQuery,
  setCheckOrderId
})
function handleCancelClick() {
  emit('handleCancelClick');
}



function getList() {
  loading.value = true;
  const query = {...queryParams.value}
  listCheckOrderDetail(query).then(response => {
    list.value = response.rows;
    list.value.forEach(it => it.areaName = useWmsStore().areaMap.get(it.areaId)?.areaName)
    total.value = response.total;
  }).finally(() => loading.value = false);
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
</script>

<style lang="scss">
.el-table .my-cell {
  vertical-align: top
}

.el-statistic__content {
  font-size: 14px;
}
</style>
