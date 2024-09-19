<template>
  <div v-if="!checking" style="display: flex;justify-content: center;align-items: center;height: 80vh">
    <el-card header="选择仓库后开始盘库" >
      <el-form>
        <el-form-item label="仓库" prop="warehouseId">
          <el-select v-model="form.warehouseId" placeholder="请选择仓库" :disabled="checking"
                     filterable>
            <el-option v-for="item in useWmsStore().warehouseList" :key="item.id" :label="item.warehouseName"
                       :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain="plain" size="default" @click="startCheck"  style="width: 100%!important;">开始盘库</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div v-else v-loading="loading">
    <div class="receipt-order-edit-wrapper app-container" style="margin-bottom: 60px">
      <el-card header="盘库单基本信息">
        <el-form label-width="108px" :model="form" ref="checkForm" :rules="rules">
          <el-row :gutter="24">
            <el-col :span="11">
              <el-form-item label="盘库单号" prop="checkOrderNo">
                <el-input class="w200" v-model="form.checkOrderNo" placeholder="盘库单号"
                          :disabled="form.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库" prop="warehouseId">
                <el-select v-model="form.warehouseId" placeholder="请选择仓库" :disabled="checking"
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
              <el-form-item label="盈亏数" prop="checkOrderTotal">
                <el-input-number v-model="form.checkOrderTotal" :controls="false" :precision="0"
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
                :active-value="true"
                :inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
              />
            </div>
                  <el-button type="primary" plain="plain" size="default" @click="showSkuSelect" icon="Plus"
                             :disabled="!form.warehouseId">新增库存
                  </el-button>
          </div>
          <el-table :data="form.details" border empty-text="暂无商品明细">
            <el-table-column label="商品信息" prop="itemSku.itemName">
              <template #default="scope">
                  <div>{{
                      scope.row.itemSku.item.itemName + (scope.row.itemSku.item.itemCode ? ('(' + scope.row.itemSku.item.itemCode + ')') : '')
                    }}
                  </div>
                  <div v-if="scope.row.itemSku.item.itemBrand">
                    品牌：{{ useWmsStore().itemBrandMap.get(scope.row.itemSku.item.itemBrand).brandName }}
                  </div>
                </template>
            </el-table-column>
            <el-table-column label="规格信息">
              <template #default="{ row }">
                <template v-if="row.newInventoryDetail">
                  <div v-if="row.itemSku">{{ row.itemSku.skuName + (row.itemSku.barcode ? ('(' + row.itemSku.barcode + ')') : '') }}</div>
                  <div v-else>请选择商品</div>
                </template>
                <template v-else>
                  <div>{{ row.itemSku.skuName + (row.itemSku.barcode ? ('(' + row.itemSku.barcode + ')') : '') }}</div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="账面库存" align="right" width="150">
              <template #default="{ row }">
                <el-statistic :value="Number(row.quantity)" :precision="0"/>
              </template>
            </el-table-column>
            <el-table-column label="盈亏数" prop="remainQuantity" align="right" width="150">
              <template #default="{ row }">
                <el-statistic :value="Number(row.checkQuantity) - Number(row.quantity)" :precision="0"/>
              </template>
            </el-table-column>
            <el-table-column label="实际库存" prop="checkQuantity" width="180">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.checkQuantity"
                  placeholder="实际库存"
                  :min="0"
                  @change="handleChangeQuantity"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="right" fixed="right">
              <template #default="scope">
                <el-button icon="Delete" type="danger" plain size="small" v-if="scope.row.newInventoryDetail"
                           @click="handleDeleteDetail(scope.row, scope.$index)" link>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <SkuSelect
        ref="sku-select"
        :model-value="skuSelectShow"
        @handleOkClick="handleOkClick"
        @handleCancelClick="skuSelectShow = false"
        :size="'80%'"
      />
    </div>
    <div class="footer-global" v-if="checking">
      <div class="btn-box">
        <div>
          <el-button @click="doCheck" type="primary" class="ml10">完成盘库</el-button>
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

<script setup name="CheckOrderEdit">
import {computed, getCurrentInstance, onMounted, reactive, ref, toRef, toRefs, watch} from "vue";
import {addCheckOrder, getCheckOrder, updateCheckOrder, check} from "@/api/wms/checkOrder";
import {delCheckOrderDetail} from "@/api/wms/checkOrderDetail";
import {listInventoryNoPage} from "@/api/wms/inventory";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRoute} from "vue-router";
import {useWmsStore} from '@/store/modules/wms'
import {numSub, generateNo} from '@/utils/ruoyi'
import SkuSelect from "@/views/components/SkuSelect.vue";

const {proxy} = getCurrentInstance();
const {wms_shipment_type} = proxy.useDict("wms_shipment_type");
const checkGreaterThanZero = ref(false)
const loading = ref(false)
const initFormData = {
  id: undefined,
  checkOrderNo: undefined,
  checkOrderStatus: 0,
  remark: undefined,
  warehouseId: undefined,
  checkOrderTotal: 0,
  details: [],
}
const inventorySelectRef = ref(null)
const selectedInventory = ref([])
const data = reactive({
  form: {...initFormData},
  rules: {
    checkOrderNo: [
      {required: true, message: "盘库单号不能为空", trigger: "blur"}
    ],
    warehouseId: [
      {required: true, message: "请选择仓库", trigger: ['blur', 'change']}
    ],
  }
});
const {form, rules} = toRefs(data);
const cancel = async () => {
  await proxy?.$modal.confirm('确认取消编辑盘库单吗？');
  close()
}
const close = () => {
  const obj = {path: "/checkOrder"};
  proxy?.$tab.closeOpenPage(obj);
}
const inventorySelectShow = ref(false)
const skuSelectShow = ref(false)
const currentSkuSelectIndex = ref(null)
// 盘库中标识
const checking = ref(false)

// 选择商品 start
const startCheck = () => {
  if (!form.value.warehouseId) {
    return ElMessage.error('请先选择仓库！')
  }
  const query = {
    warehouseId: form.value.warehouseId,
  }
  checking.value = true
  loading.value = true
  listInventoryNoPage(query).then(res => {
    res.data.forEach(it => {
      if (!form.value.details.find(detail => detail.inventoryId === it.id)) {
        form.value.details.push({
            itemSku: it.itemSku,
            inventoryId: it.id,
            skuId: it.itemSku.id,
            warehouseId: it.warehouseId,
            quantity: Number(it.quantity),
            checkQuantity: Number(it.quantity),
            newInventoryDetail: false
          }
        )
      }
    })
  }).finally(() => loading.value = false)
}
// 选择成功
const handleOkClick = (item) => {
  skuSelectShow.value = false
  selectedInventory.value = [...item]
  item.forEach(it => {
      form.value.details.push(
        {
          itemSku: {...it},
          skuId: it.id,
          warehouseId: form.value.warehouseId,
          inventoryId: null,
          quantity: 0,
          checkQuantity: 0,
          newInventoryDetail: true
        })
  })
}

const showSkuSelect = () => {
  skuSelectShow.value = true
}
// 选择商品 end

// 初始化receipt-order-form ref
const checkForm = ref()

const save = async () => {
  await proxy?.$modal.confirm('确认暂存盘库单吗？');
  doSave()
}

const doSave = (checkOrderStatus = 0) => {
  //验证shipmentForm表单
  checkForm.value?.validate((valid) => {
    // 校验
    if (!valid) {
      return ElMessage.error('请填写必填项')
    }
    let details = []
    if (form.value.details?.length) {
      // 构建参数
      details = form.value.details.map(it => {
        return {
          id: it.id,
          checkOrderId: form.value.id,
          skuId: it.skuId,
          quantity: it.quantity,
          checkQuantity: it.checkQuantity,
          inventoryId: it.inventoryId,
          warehouseId: form.value.warehouseId,
        }
      })
    }
    const params = {
      id: form.value.id,
      checkOrderNo: form.value.checkOrderNo,
      checkOrderStatus,
      remark: form.value.remark,
      checkOrderTotal: form.value.checkOrderTotal,
      warehouseId: form.value.warehouseId,
      details: details
    }
    if (params.id) {
      updateCheckOrder(params).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg)
          close()
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else {
      addCheckOrder(params).then((res) => {
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
  await proxy?.$modal.confirm('确认作废盘库单吗？');
  doSave(-1)
}

const doCheck = async () => {
  await proxy?.$modal.confirm('确认盘库结束吗？');
  checkForm.value?.validate((valid) => {
    // 校验
    if (!valid) {
      return ElMessage.error('请填写必填项')
    }
    // 构建参数
    const details = form.value.details.map(it => {
      return {
        id: it.id,
        checkOrderId: form.value.id,
        skuId: it.skuId,
        quantity: it.quantity,
        checkQuantity: it.checkQuantity,
        warehouseId: form.value.warehouseId
      }
    })

    const params = {
      id: form.value.id,
      checkOrderNo: form.value.checkOrderNo,
      checkOrderTotal: form.value.checkOrderTotal,
      warehouseId: form.value.warehouseId,
      remark: form.value.remark,
      details: details
    }
    check(params).then((res) => {
      if (res.code === 200) {
        ElMessage.success('盘库成功')
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
    checking.value = true
    loadDetail(id)
  } else {
    form.value.checkOrderNo = 'PK' + generateNo()
  }
})


// 获取入库单详情
const loadDetail = (id) => {
  loading.value = true
  getCheckOrder(id).then((response) => {
    if (response.data.details?.length) {
      response.data.details.forEach(detail => {
        detail.newInventoryDetail = !detail.inventoryId
        detail.quantity = detail.remainQuantity
      })
    }
    form.value = {...response.data}
    Promise.resolve();
  }).then(() => {
  }).finally(() => {
    loading.value = false
  })
}

const handleDeleteDetail = (row, index) => {
  if (row.id) {
    proxy.$modal.confirm('确认删除本条商品明细吗？如确认会立即执行！').then(function () {
      return delCheckOrderDetail(row.id);
    }).then(() => {
      form.value.details.splice(index, 1)
      proxy.$modal.msgSuccess("删除成功");
    })
  } else {
    form.value.details.splice(index, 1)
  }
}

const handleChangeQuantity = () => {
  let checkOrderTotal = 0
  form.value.details.forEach(it => {
    if (it.quantity !== it.checkQuantity) {
      checkOrderTotal += (it.checkQuantity - it.quantity)
    }
  })
  form.value.checkOrderTotal = checkOrderTotal
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
.hover-text {
  color: black; /* 初始文字颜色 */
  text-decoration: none; /* 初始没有下划线 */
  transition: color 0.3s, text-decoration 0.3s; /* 平滑过渡效果 */
}

.hover-text:hover {
  color: #409EFF; /* 鼠标移上去时文字颜色变为蓝色 */
  text-decoration: underline; /* 鼠标移上去时带有下划线 */
}
</style>
