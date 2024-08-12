<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item label="入库状态" prop="receiptOrderStatus">
          <el-radio-group v-model="queryParams.receiptOrderStatus" @change="handleQuery">
            <el-radio-button
              :key="-2"
              :label="-2"
            >
              全部
            </el-radio-button>
            <el-radio-button
              v-for="item in wms_receipt_status"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入库类型" prop="receiptOrderStatus">
          <el-radio-group v-model="queryParams.receiptOrderType" @change="handleQuery">
            <el-radio-button
              :key="-1"
              :label="-1"
            >
              全部
            </el-radio-button>
            <el-radio-button
              v-for="item in wms_receipt_type"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入库单号" prop="receiptOrderNo">
          <el-input
            v-model="queryParams.receiptOrderNo"
            placeholder="请输入入库单号"
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
        <el-col :span="6"><span style="font-size: large">入库单</span></el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['wms:receiptOrder:add']"
          >新增</el-button>
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['wms:receiptOrder:export']"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="receiptOrderList" border class="mt20"
                @expand-change="handleExpandExchange"
                :row-key="getRowKey"
                :expand-row-keys="expandedRowKeys"
                empty-text="暂无入库单"
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
                <el-table-column label="库区" prop="areaName"/>
                <el-table-column label="数量" prop="quantity" align="right">
                  <template #default="{ row }">
                    <el-statistic :value="Number(row.quantity)" :precision="0"/>
                  </template>
                </el-table-column>
                <el-table-column label="价格(元)" align="right">
                  <template #default="{ row }">
                    <el-statistic :precision="2" :value="Number(row.amount)"/>
                  </template>
                </el-table-column>
                <el-table-column label="批号" prop="batchNo" />
                <el-table-column label="生产日期" prop="productionDate">
                  <template #default="{ row }">
                    <div>{{ parseTime(row.productionDate, '{y}-{m}-{d}') }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="过期时间" prop="expirationDate">
                  <template #default="{ row }">
                    <div>{{ parseTime(row.expirationDate, '{y}-{m}-{d}') }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单号/订单号" align="left">
          <template #default="{ row }">
            <div>单号：{{ row.receiptOrderNo }}</div>
            <div v-if="row.orderNo">订单号：{{ row.orderNo }}</div>
          </template>
        </el-table-column>
        <el-table-column label="入库类型" align="left" prop="receiptOrderType">
          <template #default="{ row }">
            <dict-tag :options="wms_receipt_type" :value="row.receiptOrderType" />
          </template>
        </el-table-column>
        <el-table-column label="供应商" align="left" prop="merchantId">
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
        <el-table-column label="入库状态" align="center" prop="receiptOrderStatus" width="120">
          <template #default="{ row }">
            <dict-tag :options="wms_receipt_status" :value="row.receiptOrderStatus" />
          </template>
        </el-table-column>
        <el-table-column label="数量/金额(元)" align="left">
          <template #default="{ row }">
            <div class="flex-space-between">
              <span>数量：</span>
              <el-statistic :value="Number(row.totalQuantity)" :precision="0"/>
            </div>
            <div class="flex-space-between" v-if="row.payableAmount || row.payableAmount === 0">
              <span>金额：</span>
              <el-statistic :value="Number(row.payableAmount)" :precision="2"/>
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
                :disabled="scope.row.receiptOrderStatus === 0"
                :content="'入库单【' + scope.row.receiptOrderNo + '】已' + (scope.row.receiptOrderStatus === 1 ? '入库' : '作废') + '，无法修改！' "
              >
                <template #reference>
                  <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['wms:receiptOrder:edit']" :disabled="[-1, 1].includes(scope.row.receiptOrderStatus)">修改</el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="handleGoDetail(scope.row)" v-hasPermi="['wms:receiptOrder:query']">{{ expandedRowKeys.includes(scope.row.id) ? '收起' : '查看' }}</el-button>
            </div>
            <div class="mt10">
              <el-popover
                placement="left"
                title="提示"
                :width="300"
                trigger="hover"
                :disabled="[-1, 0].includes(scope.row.receiptOrderStatus)"
                :content="'入库单【' + scope.row.receiptOrderNo + '】已入库，无法删除！' "
              >
                <template #reference>
                  <el-button link type="danger" @click="handleDelete(scope.row)" v-hasPermi="['wms:receiptOrder:remove']" :disabled="scope.row.receiptOrderStatus === 1">删除</el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="handlePrint(scope.row)" v-hasPermi="['wms:receiptOrder:export']">打印</el-button>
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

<script setup name="ReceiptOrder">
import { listReceiptOrder, getReceiptOrder, delReceiptOrder, addReceiptOrder, updateReceiptOrder } from "@/api/wms/receiptOrder";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import {useWmsStore} from "../../../store/modules/wms";
import {listByReceiptOrderId} from "@/api/wms/receiptOrderDetail";
import {ElMessageBox} from "element-plus";
import receiptPanel from "@/components/PrintTemplate/receipt-panel";

const { proxy } = getCurrentInstance();
const { wms_receipt_status, wms_receipt_type } = proxy.useDict("wms_receipt_status", "wms_receipt_type");
const receiptOrderList = ref([]);
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
    receiptOrderNo: undefined,
    receiptOrderType: -1,
    merchantId: undefined,
    orderNo: undefined,
    payableAmount: undefined,
    receiptOrderStatus: -2,
  },
});

const { queryParams } = toRefs(data);

/** 查询入库单列表 */
function getList() {
  loading.value = true;
  const query = {...queryParams.value}
  if (query.receiptOrderStatus === -2) {
    query.receiptOrderStatus = null
  }
  if (query.receiptOrderType === -1) {
    query.receiptOrderType = null
  }
  listReceiptOrder(query).then(response => {
    receiptOrderList.value = response.rows;
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
  proxy.$router.push({ path: "/receiptOrderEdit" });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('确认删除入库单【' + row.receiptOrderNo + '】吗？').then(function() {
    loading.value = true;
    return delReceiptOrder(_ids);
  }).then(() => {
    loading.value = true;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch((e) => {
    if (e === 409) {
      return ElMessageBox.alert(
        '<div>入库单【' + row.receiptOrderNo + '】已入库，不能删除 ！</div><div>请联系管理员处理！</div>',
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
  proxy.$router.push({ path: "/receiptOrderEdit",  query: { id: row.id } });
}

function handleGoDetail(row) {
  const index = expandedRowKeys.value.indexOf(row.id)
  if (index !== -1) {
    // 收起
    expandedRowKeys.value.splice(index, 1)
  } else {
    // 展开
    expandedRowKeys.value.push(row.id)
    loadReceiptOrderDetail(row)
  }
}

/** 导出按钮操作 */
async function handlePrint(row) {
  const res = await getReceiptOrder(row.id)
  const receiptOrder = res.data
  let table = []
  if (receiptOrder.details?.length) {
    table = receiptOrder.details.map(detail => {
      return {
        itemName: detail.itemSku.item.itemName,
        skuName: detail.itemSku.skuName,
        areaName: useWmsStore().areaMap.get(detail.areaId)?.areaName,
        batchNo: detail.batchNo,
        productionDate: proxy.parseTime(detail.productionDate, '{y}-{m}-{d}'),
        expirationDate: proxy.parseTime(detail.expirationDate, '{y}-{m}-{d}'),
        quantity: Number(detail.quantity).toFixed(0),
        amount: detail.amount
      }
    })
  }
  const printData = {
    receiptOrderNo: receiptOrder.receiptOrderNo,
    receiptOrderType: proxy.selectDictLabel(wms_receipt_type.value, receiptOrder.receiptOrderType),
    receiptOrderStatus: proxy.selectDictLabel(wms_receipt_status.value, receiptOrder.receiptOrderStatus),
    merchantName: useWmsStore().merchantMap.get(receiptOrder.merchantId)?.merchantName,
    orderNo: receiptOrder.orderNo,
    warehouseName: useWmsStore().warehouseMap.get(receiptOrder.warehouseId)?.warehouseName,
    areaName: useWmsStore().areaMap.get(receiptOrder.areaId)?.areaName,
    totalQuantity: Number(receiptOrder.totalQuantity).toFixed(0),
    payableAmount: ((receiptOrder.payableAmount || receiptOrder.payableAmount === 0) ? (receiptOrder.payableAmount + '元') : ''),
    createBy: receiptOrder.createBy,
    createTime: proxy.parseTime(receiptOrder.createTime, '{mm}-{dd} {hh}:{ii}'),
    updateBy: receiptOrder.updateBy,
    updateTime: proxy.parseTime(receiptOrder.updateTime, '{mm}-{dd} {hh}:{ii}'),
    remark: receiptOrder.remark,
    table
  }
  let printTemplate = new proxy.$hiprint.PrintTemplate({template: receiptPanel})
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
  loadReceiptOrderDetail(value)
}

function loadReceiptOrderDetail(row) {
  const index = receiptOrderList.value.findIndex(it => it.id === row.id)
  detailLoading.value[index] = true
  listByReceiptOrderId(row.id).then(res => {
    if (res.data?.length) {
      const details = res.data.map(it => {
        return {
          ...it,
          warehouseName: useWmsStore().warehouseMap.get(it.warehouseId)?.warehouseName,
          areaName: useWmsStore().areaMap.get(it.areaId)?.areaName
        }
      })
      receiptOrderList.value[index].details = details
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
.el-table .vertical-top-cell {
  vertical-align: top
}
</style>
