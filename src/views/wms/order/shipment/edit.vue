<template>
  <div>
    <div class="receipt-order-edit-wrapper app-container" style="margin-bottom: 60px" v-loading="loading">
      <el-card header="出库单基本信息">
        <el-form label-width="108px" :model="form" ref="shipmentForm" :rules="rules">
          <el-row :gutter="24">
            <el-col :span="11">
              <el-form-item label="出库单号" prop="shipmentOrderNo">
                <el-input class="w200" v-model="form.shipmentOrderNo" placeholder="出库单号"
                          :disabled="form.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库" prop="warehouseId">
                <el-select v-model="form.warehouseId" placeholder="请选择仓库" @change="handleChangeWarehouse"
                           filterable>
                  <el-option v-for="item in useWmsStore().warehouseList" :key="item.id" :label="item.warehouseName"
                             :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="11">
              <el-form-item label="出库类型" prop="shipmentOrderType">
                <el-radio-group v-model="form.shipmentOrderType">
                  <el-radio-button
                    v-for="item in wms_shipment_type"
                    :key="item.value"
                    :label="item.value"
                  >{{ item.label }}
                  </el-radio-button
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户" prop="merchantId">
                <el-select v-model="form.merchantId" placeholder="请选择客户" clearable filterable>
                  <el-option v-for="item in useWmsStore().merchantList" :key="item.id" :label="item.merchantName"
                             :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单号" prop="orderNo">
                <el-input v-model="form.orderNo" placeholder="请输入订单号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="11">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="form.remark"
                  placeholder="备注...100个字符以内"
                  rows="4"
                  maxlength="100"
                  type="textarea"
                  show-word-limit="show-word-limit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div style="display: flex;align-items: start">
                <el-form-item label="金额" prop="receivableAmount">
                  <el-input-number v-model="form.receivableAmount" :precision="2" :min="0"></el-input-number>
                </el-form-item>
                <el-button link type="primary" @click="handleAutoCalc" class="ml20" style="line-height: 32px">自动计算
                </el-button>
              </div>
            </el-col>
            <el-col :span="6">
              <el-form-item label="数量" prop="totalQuantity">
                <el-input-number v-model="form.totalQuantity" :controls="false" :precision="0"
                                 :disabled="true"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card header="商品明细" class="mt10">
        <div class="receipt-order-content">
          <div class="flex-space-between mb8">
            <div>
              <span>一物一码/SN模式：</span>
              <el-switch
                :before-change="goSaasTip"
                class="mr10 ml10"
                inline-prompt
                size="large"
                v-model="mode"
                :active-value="true"
                :inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
              />
            </div>
            <el-popover
              placement="left"
              title="提示"
              :width="200"
              trigger="hover"
              :disabled="form.warehouseId"
              content="请先选择仓库！"
            >
              <template #reference>
                <el-button type="primary" plain="plain" size="default" @click="showAddItem" icon="Plus"
                           :disabled="!form.warehouseId">添加商品
                </el-button>
              </template>
            </el-popover>
          </div>
          <el-table :data="form.details" border empty-text="暂无商品明细">
            <el-table-column label="商品信息" prop="itemSku.itemName">
              <template #default="{ row }">
                <div>{{
                    row.itemSku.item.itemName + (row.itemSku.item.itemCode ? ('(' + row.itemSku.item.itemCode + ')') : '')
                  }}
                </div>
                <div v-if="row.itemSku.item.itemBrand">
                  品牌：{{ useWmsStore().itemBrandMap.get(row.itemSku.item.itemBrand).brandName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="规格信息">
              <template #default="{ row }">
                <div>{{ row.itemSku.skuName }}</div>
                <div v-if="row.itemSku.barcode">条码：{{row.itemSku.barcode}}</div>
              </template>
            </el-table-column>
            <el-table-column label="批号" prop="batchNo" />
            <el-table-column label="生产日期" prop="productionDate">
              <template #default="{ row }">
                <div v-if="row.productionDate">{{ row.productionDate.substring(0, 10) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="过期日期" prop="expirationDate">
              <template #default="{ row }">
                <div v-if="row.expirationDate">{{ row.expirationDate.substring(0, 10) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="剩余库存" prop="remainQuantity" align="right" width="150">
              <template #default="{ row }">
                <el-statistic :value="Number(row.remainQuantity)" :precision="0"/>
              </template>
            </el-table-column>
            <el-table-column label="出库数量" prop="quantity" width="180">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  placeholder="出库数量"
                  :min="1"
                  :precision="0"
                  :max="scope.row.remainQuantity"
                  @change="handleChangeQuantity"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="价格" prop="amount" width="180">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.amount"
                  placeholder="价格"
                  :precision="2"
                  :min="0"
                  :max="2147483647"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="right" fixed="right">
              <template #default="scope">
                <el-button icon="Delete" type="danger" plain size="small"
                           @click="handleDeleteDetail(scope.row, scope.$index)" link>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <InventoryDetailSelect
        ref="inventorySelectRef"
        :model-value="inventorySelectShow"
        @handleOkClick="handleOkClick"
        @handleCancelClick="inventorySelectShow = false"
        :size="'90%'"
        :select-warehouse-disable="false"
        :select-area-disable="!!form?.areaId"
        :warehouse-id="form.warehouseId"
        :area-id="form.areaId"
        :selected-inventory="selectedInventory"
      />
    </div>
    <div class="footer-global">
      <div class="btn-box">
        <div>
          <el-button @click="doShipment" type="primary" class="ml10">完成出库</el-button>
          <el-button @click="updateToInvalid" type="danger" v-if="form.id">作废</el-button>
        </div>
        <div>
          <el-button @click="save" type="primary">暂存</el-button>
          <el-button @click="cancel" class="mr10">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="ShipmentOrderEdit">
import {computed, getCurrentInstance, onMounted, reactive, ref, toRef, toRefs, watch} from "vue";
import {addShipmentOrder, getShipmentOrder, updateShipmentOrder, shipment} from "@/api/wms/shipmentOrder";
import {delShipmentOrderDetail} from "@/api/wms/shipmentOrderDetail";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRoute} from "vue-router";
import {useWmsStore} from '@/store/modules/wms'
import {numSub, generateNo} from '@/utils/ruoyi'
import InventoryDetailSelect from "@/views/components/InventoryDetailSelect.vue";

const {proxy} = getCurrentInstance();
const {wms_shipment_type} = proxy.useDict("wms_shipment_type");

const loading = ref(false)
const initFormData = {
  id: undefined,
  shipmentOrderNo: undefined,
  shipmentOrderType: "2",
  merchantId: undefined,
  orderNo: undefined,
  receivableAmount: undefined,
  shipmentOrderStatus: 0,
  remark: undefined,
  warehouseId: undefined,
  areaId: undefined,
  totalQuantity: 0,
  details: [],
}
const inventorySelectRef = ref(null)
const selectedInventory = ref([])
const data = reactive({
  form: {...initFormData},
  rules: {
    shipmentOrderNo: [
      {required: true, message: "出库单号不能为空", trigger: "blur"}
    ],
    shipmentOrderType: [
      {required: true, message: "出库类型不能为空", trigger: "change"}
    ],
    warehouseId: [
      {required: true, message: "请选择仓库", trigger: ['blur', 'change']}
    ],
  }
});
const {form, rules} = toRefs(data);
const cancel = async () => {
  await proxy?.$modal.confirm('确认取消编辑出库单吗？');
  close()
}
const close = () => {
  const obj = {path: "/shipmentOrder"};
  proxy?.$tab.closeOpenPage(obj);
}
const inventorySelectShow = ref(false)

// 选择商品 start
const showAddItem = () => {
  inventorySelectRef.value.getList()
  inventorySelectShow.value = true
}
// 选择成功
const handleOkClick = (item) => {
  inventorySelectShow.value = false
  selectedInventory.value = [...item]
  item.forEach(it => {
    if (!form.value.details.find(detail => detail.inventoryDetailId === it.id)) {
      form.value.details.push(
        {
          itemSku: {
            ...it.itemSku,
            item: it.item
          },
          skuId: it.skuId,
          amount: undefined,
          quantity: undefined,
          remainQuantity: it.remainQuantity,
          batchNo: it.batchNo,
          productionDate: it.productionDate,
          expirationDate: it.expirationDate,
          warehouseId: form.value.warehouseId,
          areaId: form.value.areaId ?? it.areaId,
          inventoryDetailId: it.id,
          areaName: useWmsStore().areaMap.get(form.value.areaId ?? it.areaId)?.areaName
        })
    }
  })
}

const getPlaceAndSkuKey = (row) => {
  return row.warehouseId + '_' + row.areaId + '_' + row.skuId
}
// 选择商品 end

// 初始化receipt-order-form ref
const shipmentForm = ref()

const save = async () => {
  await proxy?.$modal.confirm('确认暂存出库单吗？');
  doSave()
}

const doSave = (shipmentOrderStatus = 0) => {
  //验证shipmentForm表单
  shipmentForm.value?.validate((valid) => {
    // 校验
    if (!valid) {
      return ElMessage.error('请填写必填项')
    }
    let details = []
    if (form.value.details?.length) {
      const invalidQuantityList = form.value.details.filter(it => !it.quantity)
      if (invalidQuantityList?.length) {
        return ElMessage.error('请选择数量')
      }
      // 构建参数
      details = form.value.details.map(it => {
        return {
          id: it.id,
          receiptOrderId: form.value.id,
          skuId: it.skuId,
          amount: it.amount,
          quantity: it.quantity,
          batchNo: it.batchNo,
          productionDate: it.productionDate,
          expirationDate: it.expirationDate,
          inventoryDetailId: it.inventoryDetailId,
          warehouseId: form.value.warehouseId,
          areaId: it.areaId
        }
      })
    }


    //('提交前校验',form.value)
    const params = {
      id: form.value.id,
      shipmentOrderNo: form.value.shipmentOrderNo,
      shipmentOrderType: form.value.shipmentOrderType,
      shipmentOrderStatus,
      merchantId: form.value.merchantId,
      orderNo: form.value.orderNo,
      remark: form.value.remark,
      receivableAmount: form.value.receivableAmount,
      totalQuantity: form.value.totalQuantity,
      warehouseId: form.value.warehouseId,
      areaId: form.value.areaId,
      details: details
    }
    if (params.id) {
      updateShipmentOrder(params).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg)
          close()
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else {
      addShipmentOrder(params).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg)
          close()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}


const updateToInvalid = async () => {
  await proxy?.$modal.confirm('确认作废出库单吗？');
  doSave(-1)
}

const doShipment = async () => {
  await proxy?.$modal.confirm('确认出库吗？');
  shipmentForm.value?.validate((valid) => {
    // 校验
    if (!valid) {
      return ElMessage.error('请填写必填项')
    }
    if (!form.value.details?.length) {
      return ElMessage.error('请选择商品')
    }
    const invalidQuantityList = form.value.details.filter(it => !it.quantity)
    if (invalidQuantityList?.length) {
      return ElMessage.error('请选择出库数量')
    }
    // 构建参数
    const details = form.value.details.map(it => {
      return {
        id: it.id,
        receiptOrderId: form.value.id,
        skuId: it.skuId,
        amount: it.amount,
        quantity: it.quantity,
        batchNo: it.batchNo,
        productionDate: it.productionDate,
        expirationDate: it.expirationDate,
        inventoryDetailId: it.inventoryDetailId,
        warehouseId: form.value.warehouseId,
        areaId: it.areaId
      }
    })

    //('提交前校验',form.value)
    const params = {
      id: form.value.id,
      shipmentOrderNo: form.value.shipmentOrderNo,
      shipmentOrderType: form.value.shipmentOrderType,
      merchantId: form.value.merchantId,
      orderNo: form.value.orderNo,
      remark: form.value.remark,
      receivableAmount: form.value.receivableAmount,
      totalQuantity: form.value.totalQuantity,
      warehouseId: form.value.warehouseId,
      areaId: form.value.areaId,
      details: details
    }
    loading.value = true
    shipment(params).then((res) => {
      if (res.code === 200) {
        ElMessage.success('出库成功')
        close()
      } else {
        ElMessage.error(res.msg)
      }
    }).finally(()=>{
      loading.value = false
    })
  })
}

const route = useRoute();
onMounted(() => {
  const id = route.query && route.query.id;
  if (id) {
    loadDetail(id)
  } else {
    form.value.shipmentOrderNo = 'CK' + generateNo()
  }
})


// 获取入库单详情
const loadDetail = (id) => {
  loading.value = true
  getShipmentOrder(id).then((response) => {
    if (response.data.details?.length) {
      response.data.details.forEach(detail => {
        detail.areaName = useWmsStore().areaMap.get(detail.areaId)?.areaName
      })
      selectedInventory.value = response.data.details.map(it => {
        return {
          id: it.inventoryDetailId,
          areaId: it.areaId
        }
      })
    }
    form.value = {...response.data}
    inventorySelectRef.value.setWarehouseIdAndAreaId(form.value.warehouseId, form.value.areaId)
    Promise.resolve();
  }).then(() => {
  }).finally(() => {
    loading.value = false
  })
}

const handleChangeWarehouse = (e) => {
  form.value.areaId = undefined
  form.value.details = []
  inventorySelectRef.value.setWarehouseIdAndAreaId(form.value.warehouseId, form.value.areaId)
}

const handleChangeArea = (e) => {
  inventorySelectRef.value.setWarehouseIdAndAreaId(form.value.warehouseId, form.value.areaId)
  form.value.details = form.value.details.filter(it => it.areaId === e)
  selectedInventory.value = selectedInventory.value.filter(selected => selected.areaId === e)
}

const handleChangeQuantity = () => {
  let sum = 0
  form.value.details.forEach(it => {
    if (it.quantity) {
      sum += Number(it.quantity)
    }
  })
  form.value.totalQuantity = sum
}

const handleAutoCalc = () => {
  let sum = undefined
  form.value.details.forEach(it => {
    if (it.amount >= 0) {
      if (!sum) {
        sum = 0
      }
      sum = numSub(sum, -Number(it.amount))
    }
  })
  form.value.receivableAmount = sum
}

const handleDeleteDetail = (row, index) => {
  if (row.id) {
    proxy.$modal.confirm('确认删除本条商品明细吗？如确认会立即执行！').then(function () {
      return delShipmentOrderDetail(row.id);
    }).then(() => {
      form.value.details.splice(index, 1)
      proxy.$modal.msgSuccess("删除成功");
    })
  } else {
    form.value.details.splice(index, 1)
    const indexOfSelected = selectedInventory.value.findIndex(it => it.id === row.inventoryDetailId)
    selectedInventory.value.splice(indexOfSelected, 1)
  }
}
const goSaasTip = () => {
  ElMessageBox.alert('一物一码/SN模式请去Saas版本体验！', '系统提示', {
    confirmButtonText: '确定'
  })
  return false
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.module";

.btn-box {
  width: calc(100% - #{$base-sidebar-width});
  display: flex;
  align-items: center;
  justify-content: space-between;
  float: right;
}

.el-statistic__content {
  font-size: 14px;
}
</style>
