<template>
  <div>
    <div class="receipt-order-edit-wrapper app-container" style="margin-bottom: 60px" v-loading="loading">
      <el-card header="移库单基本信息">
        <el-form label-width="108px" :model="form" ref="movementForm" :rules="rules">
          <el-row :gutter="24">
            <el-col :span="11">
              <el-form-item label="移库单号" prop="movementOrderNo">
                <el-input class="w200" v-model="form.movementOrderNo" placeholder="移库单号"
                          :disabled="form.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="源仓库" prop="sourceWarehouseId">
                <el-select v-model="form.sourceWarehouseId" placeholder="请选择源仓库" @change="handleChangeSourceWarehouse"
                           filterable>
                  <el-option v-for="item in useWmsStore().warehouseList" :key="item.id" :label="item.warehouseName"
                             :value="item.id"/>
                </el-select>
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
              <el-form-item label="目标仓库" prop="targetWarehouseId">
                <el-select v-model="form.targetWarehouseId" placeholder="请选择目标仓库" @change="handleChangeTargetWarehouse"
                           filterable>
                  <el-option v-for="item in useWmsStore().warehouseList" :key="item.id" :label="item.warehouseName"
                             :value="item.id"/>
                </el-select>
              </el-form-item>
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
              :disabled="form.sourceWarehouseId && form.targetWarehouseId"
              content="请先选择源仓库和目标仓库！"
            >
              <template #reference>
                <el-button type="primary" plain="plain" size="default" @click="showAddItem" icon="Plus"
                           :disabled="!form.sourceWarehouseId || !form.targetWarehouseId">添加商品
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
                <div>{{ row.itemSku.skuName}}</div>
                <div v-if="row.itemSku.barcode">条码：{{ row.itemSku.barcode }}</div>
              </template>
            </el-table-column>
            <el-table-column label="移库数量" prop="quantity" width="180">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  placeholder="移库数量"
                  :min="1"
                  :precision="0"
                  @change="handleChangeQuantity"
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
      <InventorySelect
        ref="inventorySelectRef"
        :model-value="inventorySelectShow"
        @handleOkClick="handleOkClick"
        @handleCancelClick="inventorySelectShow = false"
        :size="'90%'"
        :select-warehouse-disable="false"
        :warehouse-id="form.sourceWarehouseId"
        :selected-inventory="selectedInventory"
      />
    </div>
    <div class="footer-global">
      <div class="btn-box">
        <div>
          <el-button @click="doMovement" type="primary" class="ml10">完成移库</el-button>
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

<script setup name="MovementOrderEdit">
import {computed, getCurrentInstance, onMounted, reactive, ref, toRef, toRefs, watch} from "vue";
import {addMovementOrder, getMovementOrder, updateMovementOrder, movement} from "@/api/wms/movementOrder";
import {delMovementOrderDetail} from "@/api/wms/movementOrderDetail";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRoute} from "vue-router";
import {useWmsStore} from '@/store/modules/wms'
import {numSub, generateNo} from '@/utils/ruoyi'
import InventorySelect from "@/views/components/InventorySelect.vue";
import {getSourceWarehouseAndSkuKey, getWarehouseAndSkuKey} from "@/utils/wmsUtil";

const {proxy} = getCurrentInstance();
const {wms_shipment_type} = proxy.useDict("wms_shipment_type");

const loading = ref(false)
const initFormData = {
  id: undefined,
  movementOrderNo: undefined,
  shipmentOrderStatus: 0,
  remark: undefined,
  sourceWarehouseId: undefined,
  targetWarehouseId: undefined,
  totalQuantity: 0,
  details: [],
}
const inventorySelectRef = ref(null)
const selectedInventory = ref([])
const data = reactive({
  form: {...initFormData},
  rules: {
    movementOrderNo: [
      {required: true, message: "出库单号不能为空", trigger: "blur"}
    ],
    sourceWarehouseId: [
      {required: true, message: "请选择源仓库", trigger: ['blur', 'change']}
    ],
    targetWarehouseId: [
      {required: true, message: "请选择目标仓库", trigger: ['blur', 'change']}
    ],
  }
});
const {form, rules} = toRefs(data);
const cancel = async () => {
  await proxy?.$modal.confirm('确认取消编辑移库单吗？');
  close()
}
const close = () => {
  const obj = {path: "/movementOrder"};
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
    if (!form.value.details.find(detail => getSourceWarehouseAndSkuKey(detail) === getWarehouseAndSkuKey(it))) {
      form.value.details.push(
        {
          itemSku: {
            ...it.itemSku,
            item: it.item
          },
          skuId: it.skuId,
          quantity: undefined,
          sourceWarehouseId: form.value.sourceWarehouseId
        })
    }
  })
}
// 选择商品 end

// 初始化receipt-order-form ref
const movementForm = ref()

const save = async () => {
  await proxy?.$modal.confirm('确认暂存移库单吗？');
  doSave()
}

const doSave = (movementOrderStatus = 0) => {
  movementForm.value?.validate((valid) => {
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
          movementOrderId: form.value.id,
          skuId: it.skuId,
          quantity: it.quantity,
          sourceWarehouseId: form.value.sourceWarehouseId,
          targetWarehouseId: form.value.targetWarehouseId,
        }
      })
    }

    const params = {
      id: form.value.id,
      movementOrderNo: form.value.movementOrderNo,
      movementOrderStatus,
      remark: form.value.remark,
      totalQuantity: form.value.totalQuantity,
      sourceWarehouseId: form.value.sourceWarehouseId,
      targetWarehouseId: form.value.targetWarehouseId,
      details: details
    }
    if (params.id) {
      updateMovementOrder(params).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg)
          close()
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else {
      addMovementOrder(params).then((res) => {
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
  await proxy?.$modal.confirm('确认作废移库单吗？');
  doSave(-1)
}

const doMovement = async () => {
  await proxy?.$modal.confirm('确认移库吗？');
  movementForm.value?.validate((valid) => {
    // 校验
    if (!valid) {
      return ElMessage.error('请填写必填项')
    }
    if (!form.value.details?.length) {
      return ElMessage.error('请选择商品')
    }
    const invalidQuantityList = form.value.details.filter(it => !it.quantity)
    if (invalidQuantityList?.length) {
      return ElMessage.error('请选择移库数量')
    }
    // 构建参数
    const details = form.value.details.map(it => {
      return {
        id: it.id,
        movementOrderId: form.value.id,
        skuId: it.skuId,
        quantity: it.quantity,
        sourceWarehouseId: form.value.sourceWarehouseId,
        targetWarehouseId: form.value.targetWarehouseId,
      }
    })

    //('提交前校验',form.value)
    const params = {
      id: form.value.id,
      movementOrderNo: form.value.movementOrderNo,
      remark: form.value.remark,
      totalQuantity: form.value.totalQuantity,
      sourceWarehouseId: form.value.sourceWarehouseId,
      targetWarehouseId: form.value.targetWarehouseId,
      details: details
    }
    movement(params).then((res) => {
      if (res.code === 200) {
        ElMessage.success('移库成功')
        close()
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
}

const route = useRoute();
onMounted(() => {
  const id = route.query && route.query.id;
  if (id) {
    loadDetail(id)
  } else {
    form.value.movementOrderNo = 'YK' + generateNo()
  }
})


// 获取移库单详情
const loadDetail = (id) => {
  loading.value = true
  getMovementOrder(id).then((response) => {

    if (response.data.details?.length) {
      selectedInventory.value = response.data.details.map(it => {
        return {
          id: it.id,
          skuId: it.skuId,
          warehouseId: it.sourceWarehouseId
        }
      })
    }
    form.value = {...response.data}
    inventorySelectRef.value.setWarehouseId(form.value.sourceWarehouseId)
    Promise.resolve();
  }).then(() => {
  }).finally(() => {
    loading.value = false
  })
}

const handleChangeSourceWarehouse = (e) => {
  form.value.details = []
  inventorySelectRef.value.setWarehouseId(form.value.sourceWarehouseId)
}

const handleChangeTargetWarehouse = (e) => {
  form.value.details.forEach(it => {
    it.targetWarehouseId = e
  })

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

const handleDeleteDetail = (row, index) => {
  if (row.id) {
    proxy.$modal.confirm('确认删除本条商品明细吗？如确认会立即执行！').then(function () {
      return delMovementOrderDetail(row.id);
    }).then(() => {
      form.value.details.splice(index, 1)
      proxy.$modal.msgSuccess("删除成功");
    })
  } else {
    form.value.details.splice(index, 1)
  }
  const indexOfSelected = selectedInventory.value.findIndex(it => getWarehouseAndSkuKey(it) === getSourceWarehouseAndSkuKey(row))
  selectedInventory.value.splice(indexOfSelected, 1)
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
