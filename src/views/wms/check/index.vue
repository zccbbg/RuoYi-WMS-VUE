<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item label="盘库状态" prop="checkOrderStatus">
          <el-radio-group v-model="queryParams.checkOrderStatus" @change="handleQuery">
            <el-radio-button
              :key="-2"
              :label="-2"
            >
              全部
            </el-radio-button>
            <el-radio-button
              v-for="item in wms_check_status"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="盘库单号" prop="checkOrderNo">
          <el-input
            v-model="queryParams.checkOrderNo"
            placeholder="请输入盘库单号"
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
        <el-col :span="6"><span style="font-size: large">盘库单</span></el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['wms:checkOrder:add']"
          >新增</el-button>
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['wms:checkOrder:export']"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="checkOrderList" border class="mt20"
                @expand-change="handleExpandExchange"
                :row-key="getRowKey"
                :expand-row-keys="expandedRowKeys"
                empty-text="暂无盘库单"
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
                <el-table-column label="批号" prop="inventoryDetail.batchNo" />
                <el-table-column label="生产日期" prop="inventoryDetail.productionDate">
                  <template #default="{ row }">
                    <div>{{ parseTime(row.inventoryDetail.productionDate, '{y}-{m}-{d}') }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="过期日期" prop="inventoryDetail.expirationDate">
                  <template #default="{ row }">
                    <div>{{ parseTime(row.inventoryDetail.expirationDate, '{y}-{m}-{d}') }}</div>
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
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单号" align="left" prop="checkOrderNo" />
        <el-table-column label="仓库/库区" align="left" width="200">
          <template #default="{ row }">
            <div>仓库：{{ useWmsStore().warehouseMap.get(row.warehouseId)?.warehouseName }}</div>
            <div v-if="row.areaId">库区：{{ useWmsStore().areaMap.get(row.areaId)?.areaName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="盘库状态" align="center" prop="checkOrderStatus" width="120">
          <template #default="{ row }">
            <dict-tag :options="wms_check_status" :value="row.checkOrderStatus" />
          </template>
        </el-table-column>
        <el-table-column label="盈亏数" align="right">
          <template #default="{ row }">
            <el-statistic :value="Number(row.checkOrderTotal)" :precision="0"/>
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
                :disabled="scope.row.checkOrderStatus === 0"
                :content="'盘库单【' + scope.row.checkOrderNo + '】已' + (scope.row.checkOrderStatus === 1 ? '盘库完成' : '作废') + '，无法修改！' "
              >
                <template #reference>
                  <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['wms:checkOrder:edit']" :disabled="[-1, 1].includes(scope.row.checkOrderStatus)">修改</el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="handleGoDetail(scope.row)" v-hasPermi="['wms:checkOrder:query']">{{ expandedRowKeys.includes(scope.row.id) ? '收起' : '查看' }}</el-button>
            </div>
            <div class="mt10">
              <el-popover
                placement="left"
                title="提示"
                :width="300"
                trigger="hover"
                :disabled="[-1, 0].includes(scope.row.checkOrderStatus)"
                :content="'盘库单【' + scope.row.checkOrderNo + '】已盘库完成，无法删除！' "
              >
                <template #reference>
                  <el-button link type="danger" @click="handleDelete(scope.row)" v-hasPermi="['wms:checkOrder:remove']" :disabled="scope.row.checkOrderStatus === 1">删除</el-button>
                </template>
              </el-popover>
              <el-button link type="primary" @click="handlePrint(scope.row)" v-hasPermi="['wms:checkOrder:export']">打印</el-button>
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

<script setup name="CheckOrder">
import {listCheckOrder, delCheckOrder, getCheckOrder} from "@/api/wms/checkOrder";
import {listByCheckOrderId} from "@/api/wms/checkOrderDetail";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import {useWmsStore} from "../../../store/modules/wms";
import {ElMessageBox} from "element-plus";
import checkPanel from "@/components/PrintTemplate/check-panel";

const { proxy } = getCurrentInstance();
const {wms_check_status} = proxy.useDict("wms_check_status");
const checkOrderList = ref([]);
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
    checkOrderNo: undefined,
    checkOrderStatus: -2,
  },
});

const { queryParams } = toRefs(data);

/** 查询入库单列表 */
function getList() {
  loading.value = true;
  const query = {...queryParams.value}
  if (query.checkOrderStatus === -2) {
    query.checkOrderStatus = null
  }
  listCheckOrder(query).then(response => {
    checkOrderList.value = response.rows;
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
  proxy.$router.push({ path: "/checkOrderEdit" });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('确认删除【盘库单【' + row.checkOrderNo + '】吗？').then(function() {
    loading.value = true;
    return delCheckOrder(_ids);
  }).then(() => {
    loading.value = true;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch((e) => {
    if (e === 409) {
      return ElMessageBox.alert(
        '<div>盘库单【' + row.shipmentOrderNo + '】已盘库完成，不能删除 ！</div><div>请联系管理员处理！</div>',
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
  proxy.$router.push({ path: "/checkOrderEdit",  query: { id: row.id } });
}

function handleGoDetail(row) {
  const index = expandedRowKeys.value.indexOf(row.id)
  if (index !== -1) {
    // 收起
    expandedRowKeys.value.splice(index, 1)
  } else {
    // 展开
    expandedRowKeys.value.push(row.id)
    loadCheckOrderDetail(row)
  }
}

/** 导出按钮操作 */
async function handlePrint(row) {
  const res = await getCheckOrder(row.id)
  const checkOrder = res.data
  let table = []
  if (checkOrder.details?.length) {
    table = checkOrder.details.map(detail => {
      return {
        itemName: detail.itemSku.item.itemName,
        skuName: detail.itemSku.skuName,
        areaName: useWmsStore().areaMap.get(detail.areaId)?.areaName,
        quantity: Number(detail.quantity).toFixed(0),
        profitAndLoss: Number(detail.checkQuantity - detail.quantity).toFixed(0),
        checkQuantity: Number(detail.checkQuantity).toFixed(0),
        batchNo: detail.batchNo,
        productionDate: proxy.parseTime(detail.productionDate, '{y}-{m}-{d}'),
        expirationDate: proxy.parseTime(detail.expirationDate, '{y}-{m}-{d}'),
        receiptTime: detail.receiptTime
      }
    })
  }
  const printData = {
    checkOrderNo: checkOrder.checkOrderNo,
    checkOrderStatus: proxy.selectDictLabel(wms_check_status.value, checkOrder.checkOrderStatus),
    warehouseName: useWmsStore().warehouseMap.get(checkOrder.warehouseId)?.warehouseName,
    areaName: useWmsStore().areaMap.get(checkOrder.areaId)?.areaName,
    checkOrderTotal: Number(checkOrder.checkOrderTotal).toFixed(0),
    createBy: checkOrder.createBy,
    createTime: proxy.parseTime(checkOrder.createTime, '{mm}-{dd} {hh}:{ii}'),
    updateBy: checkOrder.updateBy,
    updateTime: proxy.parseTime(checkOrder.updateTime, '{mm}-{dd} {hh}:{ii}'),
    remark: checkOrder.remark,
    table
  }
  let printTemplate = new proxy.$hiprint.PrintTemplate({template: checkPanel})
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
  loadCheckOrderDetail(value)
}

function loadCheckOrderDetail(row) {
  const index = checkOrderList.value.findIndex(it => it.id === row.id)
  detailLoading.value[index] = true
  listByCheckOrderId(row.id).then(res => {
    if (res.data?.length) {
      const details = res.data.map(it => {
        return {
          ...it,
          warehouseName: useWmsStore().warehouseMap.get(it.warehouseId)?.warehouseName,
          areaName: useWmsStore().areaMap.get(it.areaId)?.areaName
        }
      })
      checkOrderList.value[index].details = details
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
