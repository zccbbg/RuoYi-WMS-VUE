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

      <el-table v-loading="loading" :data="receiptOrderList" border class="mt20">
        <el-table-column label="单号/订单号" align="left">
          <template #default="{ row }">
            <div>单&nbsp;&nbsp;&nbsp;&nbsp;号：{{ row.receiptOrderNo }}</div>
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
        <el-table-column label="入库状态" align="left" prop="receiptOrderStatus">
          <template #default="{ row }">
            <dict-tag :options="wms_receipt_status" :value="row.receiptOrderStatus" />
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
            <div>创建：{{ row.createTime }}</div>
            <div v-if="row.updateTime">操作：{{ row.updateTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作" align="right" class-name="small-padding fixed-width" width="150">
          <template #default="scope">
            <div>
              <el-button link type="primary" icon="View" @click="" v-hasPermi="['wms:receiptOrder:query']">查看</el-button>
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wms:receiptOrder:edit']">修改</el-button>
            </div>
            <div class="mt10">
              <el-button link type="primary" icon="Download" @click="handleUpdate(scope.row)" v-hasPermi="['wms:receiptOrder:export']">打印</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wms:receiptOrder:remove']">删除</el-button>
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
const { proxy } = getCurrentInstance();
const { wms_receipt_status, wms_receipt_type } = proxy.useDict("wms_receipt_status", "wms_receipt_type");

const receiptOrderList = ref([]);
const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref([]);
const total = ref(0);
const title = ref("");

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
  proxy.$router.push({ path: "/basic/receiptOrderEdit" });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除入库单号为"' + row.receiptOrderNo + '"的数据项？').then(function() {
    loading.value = true;
    return delReceiptOrder(_ids);
  }).then(() => {
    loading.value = true;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  }).finally(() => {
    loading.value = false;
  });
}

function handleUpdate(row) {
  proxy.$router.push({ path: "/basic/receiptOrderEdit",  query: { id: row.id } });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wms/receiptOrder/export', {
    ...queryParams.value
  }, `receiptOrder_${new Date().getTime()}.xlsx`)
}

getList();
</script>
