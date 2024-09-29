<template>
  <el-drawer :model-value="show" :title="'盘库单【' + orderNo + '】的商品明细'" @close="handleCancelClick" :size="size" :close-on-click-modal="false"
             append-to-body>
    <div class="flex-space-between">
      <div></div>
      <el-checkbox v-model="queryParams.haveProfitAndLoss" label="只查看有盈亏数的" @change="handleQuery"/>
    </div>
    <el-table :data="list" border empty-text="暂无商品明细" v-loading="loading" ref="inventorySelectFormRef"
              cell-class-name="my-cell" class="mt20">
      <el-table-column label="商品名称">
        <template #default="{ row }">
          <div>{{ row?.item?.itemName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="规格名称">
        <template #default="{ row }">
          <div>{{ row?.itemSku?.skuName }}</div>
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
  orderNo: {
    type: String,
    default: ''
  }
})
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  orderId: null,
  haveProfitAndLoss: false,
});
const total = ref(0)
const loading = ref(false)
const show = computed(() => {
  return props.modelValue;
})
const emit = defineEmits(["handleCancelClick"]);

function setCheckOrderId(orderId) {
  queryParams.value.orderId = orderId
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
