<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="98px">
        <el-form-item label="移库状态" prop="movementOrderStatus">
          <el-radio-group v-model="queryParams.movementOrderStatus" @change="handleQuery">
            <el-radio-button
              :key="-2"
              :label="-2"
            >
              全部
            </el-radio-button>
            <el-radio-button
              v-for="item in wms_movement_status"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="移库单号" prop="movementOrderNo">
          <el-input
            v-model="queryParams.movementOrderNo"
            placeholder="请输入移库单号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="源仓库库区">
          <WarehouseCascader v-model:value="queryParams.sourcePlace" :show-all-levels="true" size="default" @keyup.enter="handleQuery"></WarehouseCascader>
        </el-form-item>
        <el-form-item label="目标仓库库区">
          <WarehouseCascader v-model:value="queryParams.targetPlace" :show-all-levels="true" size="default" @keyup.enter="handleQuery"></WarehouseCascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt20">

      <el-row :gutter="10" class="mb8" type="flex" justify="space-between">
        <el-col :span="6"><span style="font-size: large">移库单</span></el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['wms:movementOrder:add']"
          >新增</el-button>
          <el-button
            type="warning"
            plain
            icon="Download"
            @click=""
            v-hasPermi="['wms:movementOrder:export']"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="movementOrderList" border class="mt20"
                @expand-change="handleExpandExchange"
                :row-key="getRowKey"
                :expand-row-keys="expandedRowKeys"
                empty-text="暂无移库单"
                cell-class-name="vertical-top-cell"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div style="padding: 0 50px 20px 50px">
              <h3>商品明细</h3>
              <el-table :data="props.row.details" v-loading="detailLoading[props.$index]" empty-text="暂无商品明细">
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
                <el-table-column label="源库区" prop="sourceAreaName"/>
                <el-table-column label="目标库区" prop="targetAreaName"/>
                <el-table-column label="数量" prop="quantity" align="right">
                  <template #default="{ row }">
                    <el-statistic :value="Number(row.quantity)" :precision="0"/>
                  </template>
                </el-table-column>
                <el-table-column label="批号" prop="batchNo" />
                <el-table-column label="生产日期" prop="inventoryDetail.productionDate">
                  <template #default="{ row }">
                    <div v-if="row.productionDate">{{ parseTime(row.productionDate, '{y}-{m}-{d}') }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="过期时间" prop="inventoryDetail.expirationDate">
                  <template #default="{ row }">
                    <div v-if="row.expirationDate">{{ parseTime(row.expirationDate, '{y}-{m}-{d}') }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单号" align="left" prop="movementOrderNo" />
        <el-table-column label="源仓库/源库区" align="left" width="260">
          <template #default="{ row }">
            <div>源仓库：{{ useWmsStore().warehouseMap.get(row.sourceWarehouseId)?.warehouseName }}</div>
            <div v-if="row.sourceAreaId">源库区：{{ useWmsStore().areaMap.get(row.sourceAreaId)?.areaName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="目标仓库/目标库区" align="left" width="260">
          <template #default="{ row }">
            <div>目标仓库：{{ useWmsStore().warehouseMap.get(row.targetWarehouseId)?.warehouseName }}</div>
            <div v-if="row.targetAreaId">目标库区：{{ useWmsStore().areaMap.get(row.targetAreaId)?.areaName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="移库状态" align="center" prop="movementOrderStatus" width="120">
          <template #default="{ row }">
            <dict-tag :options="wms_movement_status" :value="row.movementOrderStatus" />
          </template>
        </el-table-column>
        <el-table-column label="数量" align="left">
          <template #default="{ row }">
            <div class="flex-space-between">
              <span>数量：</span>
              <el-statistic :value="Number(row.totalQuantity)" :precision="0"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建/操作" align="left">
          <template #default="{ row }">
            <div>创建：{{ row.createBy }}</div>
            <div v-if="row.updateBy">操作：{{ row.updateBy }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间/操作时间" align="left" width="200">
          <template #default="{ row }">
            <div>创建：{{ parseTime(row.createTime, '{mm}-{dd} {hh}:{ii}') }}</div>
            <div>操作：{{ parseTime(row.updateTime, '{mm}-{dd} {hh}:{ii}') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作" align="right" class-name="small-padding fixed-width" width="120">
          <template #default="scope">
            <div>
              <el-popover
                placement="left"
                title="提示"
                :width="300"
                trigger="hover"
                :disabled="scope.row.movementOrderStatus === 0"
                :content="'移库单【' + scope.row.movementOrderNo + '】已' + (scope.row.movementOrderStatus === 1 ? '移库' : '作废') + '，无法修改！' "
              >
                <template #reference>
                  <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['wms:movementOrder:edit']" :disabled="[-1, 1].includes(scope.row.movementOrderStatus)">修改</el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="handleGoDetail(scope.row)" v-hasPermi="['wms:movementOrder:query']">{{ expandedRowKeys.includes(scope.row.id) ? '收起' : '查看' }}</el-button>
            </div>
            <div class="mt10">
              <el-popover
                placement="left"
                title="提示"
                :width="300"
                trigger="hover"
                :disabled="[-1, 0].includes(scope.row.movementOrderStatus)"
                :content="'移库单【' + scope.row.movementOrderNo + '】已移库，无法删除！' "
              >
                <template #reference>
                  <el-button link type="danger" @click="handleDelete(scope.row)" v-hasPermi="['wms:movementOrder:remove']" :disabled="scope.row.movementOrderStatus === 1">删除</el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="handlePrint(scope.row)" v-hasPermi="['wms:movementOrder:export']">打印</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script setup name="MovementOrder">
import {listMovementOrder, delMovementOrder, getMovementOrder} from "@/api/wms/movementOrder";
import {listByMovementOrderId} from "@/api/wms/movementOrderDetail";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import {useWmsStore} from "../../../store/modules/wms";
import {ElMessageBox} from "element-plus";
import WarehouseCascader from "@/views/components/WarehouseCascader.vue";
import movementPanel from "@/components/PrintTemplate/movement-panel";

const { proxy } = getCurrentInstance();
const { wms_movement_status } = proxy.useDict("wms_movement_status");
const movementOrderList = ref([]);
const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref([]);
const total = ref(0);
const title = ref("");
// 当前展开集合
const expandedRowKeys = ref([])
// 商品明细table的loading状态集合
const detailLoading = ref([])
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    movementOrderNo: undefined,
    movementOrderStatus: -2,
  },
});

const { queryParams } = toRefs(data);

/** 查询入库单列表 */
function getList() {
  loading.value = true;
  const query = {...queryParams.value}
  if (query.movementOrderStatus === -2) {
    query.movementOrderStatus = null
  }
  if (query.sourcePlace?.length) {
    query.sourceWarehouseId = query.sourcePlace[0]
    query.sourceAreaId = query.sourcePlace[1]
  }
  if (query.targetPlace?.length) {
    query.targetWarehouseId = query.targetPlace[0]
    query.targetAreaId = query.targetPlace[1]
  }
  listMovementOrder(query).then(response => {
    movementOrderList.value = response.rows;
    total.value = response.total;
    for (let i = 0; i < total; i++) {
      detailLoading.value.push(false)
    }
    expandedRowKeys.value = []
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增按钮操作 */
function handleAdd() {
  proxy.$router.push({ path: "/movementOrderEdit" });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('确认删除移库单【' + row.movementOrderNo + '】吗？').then(function() {
    loading.value = true;
    return delMovementOrder(_ids);
  }).then(() => {
    loading.value = true;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch((e) => {
    if (e === 409) {
      return ElMessageBox.alert(
        '<div>移库单【' + row.movementOrderNo + '】已移库，不能删除 ！</div><div>请联系管理员处理！</div>',
        '系统提示',
        {
          dangerouslyUseHTMLString: true,
        }
      )
    }
  }).finally(() => {
    loading.value = false;
  });
}

function handleUpdate(row) {
  proxy.$router.push({ path: "/movementOrderEdit",  query: { id: row.id } });
}

function handleGoDetail(row) {
  const index = expandedRowKeys.value.indexOf(row.id)
  if (index !== -1) {
    // 收起
    expandedRowKeys.value.splice(index, 1)
  } else {
    // 展开
    expandedRowKeys.value.push(row.id)
    loadMovementOrderDetail(row)
  }
}

/** 导出按钮操作 */
async function handlePrint(row) {
  const res = await getMovementOrder(row.id)
  const movementOrder = res.data
  let table = []
  if (movementOrder.details?.length) {
    table = movementOrder.details.map(detail => {
      return {
        itemName: detail.itemSku.item.itemName,
        skuName: detail.itemSku.skuName,
        sourceAreaName: useWmsStore().areaMap.get(detail.sourceAreaId)?.areaName,
        targetAreaName: useWmsStore().areaMap.get(detail.targetAreaId)?.areaName,
        quantity: Number(detail.quantity).toFixed(0),
        batchNo: detail.batchNo,
        productionDate: proxy.parseTime(detail.productionDate, '{y}-{m}-{d}'),
        expirationDate: proxy.parseTime(detail.expirationDate, '{y}-{m}-{d}')
      }
    })
  }
  const printData = {
    movementOrderNo: movementOrder.movementOrderNo,
    movementOrderStatus: proxy.selectDictLabel(wms_movement_status.value, movementOrder.movementOrderStatus),
    sourceWarehouseName: useWmsStore().warehouseMap.get(movementOrder.sourceWarehouseId)?.warehouseName,
    sourceAreaName: useWmsStore().areaMap.get(movementOrder.sourceAreaId)?.areaName,
    targetWarehouseName: useWmsStore().warehouseMap.get(movementOrder.targetWarehouseId)?.warehouseName,
    targetAreaName: useWmsStore().areaMap.get(movementOrder.targetAreaId)?.areaName,
    totalQuantity: Number(movementOrder.totalQuantity).toFixed(0),
    createBy: movementOrder.createBy,
    createTime: proxy.parseTime(movementOrder.createTime, '{mm}-{dd} {hh}:{ii}'),
    updateBy: movementOrder.updateBy,
    updateTime: proxy.parseTime(movementOrder.updateTime, '{mm}-{dd} {hh}:{ii}'),
    remark: movementOrder.remark,
    table
  }
  let printTemplate = new proxy.$hiprint.PrintTemplate({template: movementPanel})
  printTemplate.print(printData, {}, {
    styleHandler: () => {
      let css = '<link href="https://cyl-press.oss-cn-shenzhen.aliyuncs.com/print-lock.css" media="print" rel="stylesheet">';
      console.info("css:", css)
      return css
    }
  })
}


function handleExpandExchange(value, expandedRows) {
  if (!ifExpand(expandedRows)) {
    return
  }
  expandedRowKeys.value = expandedRows.map(it => it.id)
  loadMovementOrderDetail(value)
}

function loadMovementOrderDetail(row) {
  const index = movementOrderList.value.findIndex(it => it.id === row.id)
  detailLoading.value[index] = true
  listByMovementOrderId(row.id).then(res => {
    if (res.data?.length) {
      const details = res.data.map(it => {
        return {
          ...it,
          sourceWarehouseName: useWmsStore().warehouseMap.get(it.sourceWarehouseId)?.warehouseName,
          sourceAreaName: useWmsStore().areaMap.get(it.sourceAreaId)?.areaName,
          targetWarehouseName: useWmsStore().warehouseMap.get(it.targetWarehouseId)?.warehouseName,
          targetAreaName: useWmsStore().areaMap.get(it.targetAreaId)?.areaName
        }
      })
      movementOrderList.value[index].details = details
    }
  }).finally(() => {
    detailLoading.value[index] = false
  })
}

function ifExpand(expandedRows) {
  if (expandedRows.length < expandedRowKeys.value.length) {
    expandedRowKeys.value = expandedRows.map(it => it.id)
    return false;
  }
  return true
}

function getRowKey(row) {
  return row.id
}
getList();
</script>
<style lang="scss">
.el-statistic__content {
  font-size: 14px;
}
.el-table .vertical-top-cell {
  vertical-align: top
}
</style>
