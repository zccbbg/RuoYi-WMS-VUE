<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item label="出库状态" prop="shipmentOrderStatus">
          <el-radio-group v-model="queryParams.shipmentOrderStatus" @change="handleQuery">
            <el-radio-button
              :key="-2"
              :label="-2"
            >
              全部
            </el-radio-button>
            <el-radio-button
              v-for="item in wms_shipment_status"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出库类型" prop="shipmentOrderType">
          <el-radio-group v-model="queryParams.shipmentOrderType" @change="handleQuery">
            <el-radio-button
              :key="-1"
              :label="-1"
            >
              全部
            </el-radio-button>
            <el-radio-button
              v-for="item in wms_shipment_type"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出库单号" prop="shipmentOrderNo">
          <el-input
            v-model="queryParams.shipmentOrderNo"
            placeholder="请输入出库单号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="订单号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            placeholder="请输入订单号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt20">

      <el-row :gutter="10" class="mb8" type="flex" justify="space-between">
        <el-col :span="6"><span style="font-size: large">出库单</span></el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['wms:shipmentOrder:add']"
          >新增</el-button>
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['wms:shipmentOrder:export']"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="shipmentOrderList" border class="mt20"
                @expand-change="handleExpandExchange"
                :row-key="getRowKey"
                :expand-row-keys="expandedRowKeys"
                empty-text="暂无出库单"
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
                <el-table-column label="库区" prop="areaName"/>
                <el-table-column label="数量" prop="quantity" align="right">
                  <template #default="{ row }">
                    <el-statistic :value="Number(row.quantity)"/>
                  </template>
                </el-table-column>
                <el-table-column label="价格(元)" align="right">
                  <template #default="{ row }">
                    <el-statistic :precision="2" :value="Number(row.amount).toFixed(2)"/>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单号/订单号" align="left">
          <template #default="{ row }">
            <div>单&nbsp;&nbsp;&nbsp;&nbsp;号：{{ row.shipmentOrderNo }}</div>
            <div v-if="row.orderNo">订单号：{{ row.orderNo }}</div>
          </template>
        </el-table-column>
        <el-table-column label="出库类型" align="left" prop="shipmentOrderType">
          <template #default="{ row }">
            <dict-tag :options="wms_shipment_type" :value="row.shipmentOrderType" />
          </template>
        </el-table-column>
        <el-table-column label="客户" align="left" prop="merchantId">
          <template #default="{ row }">
            <div>{{ useWmsStore().merchantMap.get(row.merchantId)?.merchantName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="仓库/库区" align="left" width="200">
          <template #default="{ row }">
            <div>仓库：{{ useWmsStore().warehouseMap.get(row.warehouseId)?.warehouseName }}</div>
            <div v-if="row.areaId">库区：{{ useWmsStore().areaMap.get(row.areaId)?.areaName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="出库状态" align="center" prop="shipmentOrderStatus" width="120">
          <template #default="{ row }">
            <dict-tag :options="wms_shipment_status" :value="row.shipmentOrderStatus" />
          </template>
        </el-table-column>
        <el-table-column label="数量/金额(元)" align="left">
          <template #default="{ row }">
            <div class="flex-space-between">
              <span>数量：</span>
              <span>{{ Number(row.totalQuantity).toFixed(0) }}</span>
            </div>
            <div class="flex-space-between" v-if="row.receivableAmount || row.receivableAmount === 0">
              <span>金额：</span>
              <span>{{ row.receivableAmount }}</span>
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
                :disabled="scope.row.shipmentOrderStatus === 0"
                :content="'出库单【' + scope.row.shipmentOrderNo + '】已' + (scope.row.shipmentOrderStatus === 1 ? '出库' : '作废') + '，无法修改！' "
              >
                <template #reference>
                  <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['wms:shipmentOrder:edit']" :disabled="[-1, 1].includes(scope.row.shipmentOrderStatus)">修改</el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="handleGoDetail(scope.row)" v-hasPermi="['wms:shipmentOrder:query']">{{ expandedRowKeys.includes(scope.row.id) ? '收起' : '查看' }}</el-button>
            </div>
            <div class="mt10">
              <el-popover
                placement="left"
                title="提示"
                :width="300"
                trigger="hover"
                :disabled="[-1, 0].includes(scope.row.shipmentOrderStatus)"
                :content="'出库单【' + scope.row.shipmentOrderNo + '】已出库，无法删除！' "
              >
                <template #reference>
                  <el-button link type="danger" @click="handleDelete(scope.row)" v-hasPermi="['wms:shipmentOrder:remove']" :disabled="scope.row.shipmentOrderStatus === 1">删除</el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="handlePrint(scope.row)" v-hasPermi="['wms:shipmentOrder:export']">打印</el-button>
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

<script setup name="ShipmentOrder">
import {listShipmentOrder, delShipmentOrder, getShipmentOrder} from "@/api/wms/shipmentOrder";
import {listByShipmentOrderId} from "@/api/wms/shipmentOrderDetail";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import {useWmsStore} from "../../../store/modules/wms";
import {ElMessageBox} from "element-plus";
import shipmentPanel from "@/components/PrintTemplate/shipment-panel";

const { proxy } = getCurrentInstance();
const { wms_shipment_status, wms_shipment_type} = proxy.useDict("wms_shipment_status", "wms_shipment_type");
const shipmentOrderList = ref([]);
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
    shipmentOrderNo: undefined,
    shipmentOrderType: -1,
    merchantId: undefined,
    orderNo: undefined,
    receivableAmount: undefined,
    shipmentOrderStatus: -2,
  },
});

const { queryParams } = toRefs(data);

/** 查询入库单列表 */
function getList() {
  loading.value = true;
  const query = {...queryParams.value}
  if (query.shipmentOrderStatus === -2) {
    query.shipmentOrderStatus = null
  }
  if (query.shipmentOrderType === -1) {
    query.shipmentOrderType = null
  }
  listShipmentOrder(query).then(response => {
    shipmentOrderList.value = response.rows;
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
  proxy.$router.push({ path: "/shipmentOrderEdit" });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('确认删除出库单【' + row.shipmentOrderNo + '】吗？').then(function() {
    loading.value = true;
    return delShipmentOrder(_ids);
  }).then(() => {
    loading.value = true;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch((e) => {
    if (e === 409) {
      return ElMessageBox.alert(
        '<div>出库单【' + row.shipmentOrderNo + '】已出库，不能删除 ！</div><div>请联系管理员处理！</div>',
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
  proxy.$router.push({ path: "/shipmentOrderEdit",  query: { id: row.id } });
}

function handleGoDetail(row) {
  const index = expandedRowKeys.value.indexOf(row.id)
  if (index !== -1) {
    // 收起
    expandedRowKeys.value.splice(index, 1)
  } else {
    // 展开
    expandedRowKeys.value.push(row.id)
    loadShipmentOrderDetail(row)
  }
}

/** 导出按钮操作 */
async function handlePrint(row) {
  const res = await getShipmentOrder(row.id)
  const shipmentOrder = res.data
  let table = []
  if (shipmentOrder.details?.length) {
    table = shipmentOrder.details.map(detail => {
      return {
        itemName: detail.itemSku.item.itemName,
        skuName: detail.itemSku.skuName,
        areaName: useWmsStore().areaMap.get(detail.areaId)?.areaName,
        quantity: Number(detail.quantity).toFixed(0),
        amount: detail.amount
      }
    })
  }
  const printData = {
    shipmentOrderNo: shipmentOrder.shipmentOrderNo,
    shipmentOrderType: proxy.selectDictLabel(wms_shipment_type.value, shipmentOrder.shipmentOrderType),
    shipmentOrderStatus: proxy.selectDictLabel(wms_shipment_status.value, shipmentOrder.shipmentOrderStatus),
    merchantName: useWmsStore().merchantMap.get(shipmentOrder.merchantId)?.merchantName,
    orderNo: shipmentOrder.orderNo,
    warehouseName: useWmsStore().warehouseMap.get(shipmentOrder.warehouseId)?.warehouseName,
    areaName: useWmsStore().areaMap.get(shipmentOrder.areaId)?.areaName,
    totalQuantity: Number(shipmentOrder.totalQuantity).toFixed(0),
    receivableAmount: ((shipmentOrder.receivableAmount || shipmentOrder.receivableAmount === 0) ? (shipmentOrder.receivableAmount + '元') : ''),
    createBy: shipmentOrder.createBy,
    createTime: proxy.parseTime(shipmentOrder.createTime, '{mm}-{dd} {hh}:{ii}'),
    updateBy: shipmentOrder.updateBy,
    updateTime: proxy.parseTime(shipmentOrder.updateTime, '{mm}-{dd} {hh}:{ii}'),
    remark: shipmentOrder.remark,
    table
  }
  let printTemplate = new proxy.$hiprint.PrintTemplate({template: shipmentPanel})
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
  loadShipmentOrderDetail(value)
}

function loadShipmentOrderDetail(row) {
  const index = shipmentOrderList.value.findIndex(it => it.id === row.id)
  detailLoading.value[index] = true
  listByShipmentOrderId(row.id).then(res => {
    if (res.data?.length) {
      const details = res.data.map(it => {
        return {
          ...it,
          warehouseName: useWmsStore().warehouseMap.get(it.warehouseId)?.warehouseName,
          areaName: useWmsStore().areaMap.get(it.areaId)?.areaName
        }
      })
      shipmentOrderList.value[index].details = details
    }
  }).finally(() => {
    detailLoading.value[index] = false
  })
}

function ifExpand(expandedRows) {
  if (expandedRows.length < expandedRowKeys.value.length) {
    expandedRowKeys.value = expandedRows.map(it => it.id)
    console.info("close")
    return false;
  }
  console.info("open")
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
</style>
