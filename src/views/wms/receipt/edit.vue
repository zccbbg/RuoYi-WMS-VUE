<template>
  <div>
    <div class="receipt-order-edit-wrapper app-container" style="margin-bottom: 60px">
      <el-card header="入库单基本信息">
        <el-form label-width="108px" :model="form" ref="receiptForm" :rules="rules">
          <el-row :gutter="24">
            <el-col :span="11">
              <el-form-item label="入库单号" prop="receiptOrderNo">
                <el-input class="w200" v-model="form.receiptOrderNo" placeholder="入库单号" :disabled="form.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库" prop="warehouseId">
                <el-select v-model="form.warehouseId" placeholder="请选择仓库" @change="handleChangeWarehouse" filterable>
                  <el-option v-for="item in useWmsStore().warehouseList" :key="item.id" :label="item.warehouseName" :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="库区" prop="areaId">
                <el-select v-model="form.areaId" placeholder="请选择库区" :disabled="!form.warehouseId" clearable filterable @change="handleChangeArea" style="width: 100%!important;">
                  <el-option v-for="item in useWmsStore().areaList.filter(it => it.warehouseId === form.warehouseId)" :key="item.id" :label="item.areaName" :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="11">
              <el-form-item label="入库类型" prop="receiptOrderType">
                <el-radio-group v-model="form.receiptOrderType">
                  <el-radio-button
                    v-for="item in wms_receipt_type"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}</el-radio-button
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商" prop="merchantId">
                <el-select v-model="form.merchantId" placeholder="请选择供应商" clearable filterable>
                  <el-option v-for="item in useWmsStore().merchantList" :key="item.id" :label="item.merchantName" :value="item.id"/>
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
                <el-form-item label="金额" prop="payableAmount">
                  <el-input-number v-model="form.payableAmount" :precision="2" :min="0"></el-input-number>
                </el-form-item>
                <el-button link type="primary" @click="handleAutoCalc" class="ml20" style="line-height: 32px">自动计算</el-button>
              </div>
            </el-col>
            <el-col :span="6">
              <el-form-item label="数量" prop="totalQuantity">
                <el-input-number v-model="form.totalQuantity" :controls="false" :precision="0" :disabled="true"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card header="商品明细" class="mt10">
        <div class="receipt-order-content">
          <div class="flex-center mb8">
            <div style="width: 100%;text-align: right">
              <el-button type="primary" plain="plain" size="default" @click="showAddItem" icon="Plus">添加商品</el-button>
            </div>
          </div>
          <el-table :data="form.details" border empty-text="暂无商品明细">
            <el-table-column label="商品信息" prop="prod.itemName">
              <template #default="{ row }">
                <div>{{ row.prod.itemName + (row.prod.itemCode ? ('(' + row.prod.itemCode + ')') : '') }}</div>
                <div v-if="row.prod.itemBrand">品牌：{{ useWmsStore().itemBrandMap.get(row.prod.itemBrand).brandName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="规格信息">
              <template #default="{ row }">
                <div>{{ row.prod.skuName + '(' + row.prod.barcode + ')' }}</div>
              </template>
            </el-table-column>
            <el-table-column label="库区" prop="prod.skuName" width="200">
              <template #default="{ row }">
                <el-select v-model="row.areaId" placeholder="请选择库区" :disabled="!form.warehouseId || !!form.areaId" filterable>
                  <el-option v-for="item in useWmsStore().areaList.filter(it => it.warehouseId === form.warehouseId)" :key="item.id" :label="item.areaName" :value="item.id"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="quantity" width="180">
<!--              <template #header>-->
<!--                <span>数量</span>-->
<!--                <el-button class="ml10" :disabled="!form.details?.length" @click.stop="openBatchSetNumDialog(1)">批量</el-button>-->
<!--              </template>-->
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  placeholder="数量"
                  :min="1"
                  @change="handleChangeQuantity"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="价格" prop="amount" width="180">
<!--              <template #header>-->
<!--                <span>单价</span>-->
<!--                <el-button class="ml10" :disabled="!form.details?.length" @click.stop="openBatchSetNumDialog(2)">批量</el-button>-->
<!--              </template>-->
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
            <el-table-column label="批号" prop="batchNumber" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.batchNumber"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="生产日期/过期时间" width="250">
              <template #default="scope">
                <div class="flex-center">
                  <span>生产日期：</span>
                  <el-date-picker
                    v-model="scope.row.productionDate"
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 150px!important;"
                  />
                </div>
                <div class="flex-center mt5">
                  <span>过期时间：</span>
                  <el-date-picker
                    v-model="scope.row.expirationTime"
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 150px!important;"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="right" fixed="right">
              <template #default="scope">
                <el-button icon="Delete" type="danger" plain size="small" @click="handleDeleteDetail(scope.row, scope.$index)" link>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="tc mt20">
            <el-button type="primary" plain="plain" @click="showAddItem" icon="Plus">添加商品</el-button>
          </div>
        </div>
      </el-card>
      <SkuSelect
        ref="sku-select"
        :model-value="skuSelectShow"
        @handleOkClick="handleOkClick"
        @handleCancelClick="skuSelectShow = false"
        width="60%"
      />
    </div>
    <div class="footer-global">
      <div class="btn-box">
        <div>
          <el-button @click="doWarehousing" type="primary" class="ml10">入库</el-button>
          <el-button @click="updateToInvalid" type="danger" :disabled="!form.id">作废</el-button>
        </div>
        <div>
          <el-button @click="save" type="primary">暂存</el-button>
          <el-button @click="cancel" class="mr10">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ReceiptOrderEdit">
import {computed, getCurrentInstance, onMounted, reactive, ref, Ref, toRef, toRefs, watch} from "vue";
import {addReceiptOrder, getReceiptOrder, updateReceiptOrder, editReceiptOrderToInvalid, warehousing, generateReceiptOrderNo} from "@/api/wms/receiptOrder";
import {ElMessage} from "element-plus";
import SkuSelect from "../../components/SkuSelect.vue";
import {useRoute} from "vue-router";
import {useWmsStore} from '@/store/modules/wms'
import { numSub } from '@/utils/ruoyi'
import { delReceiptOrderDetail } from '@/api/wms/receiptOrderDetail'

const {proxy} = getCurrentInstance();
const { wms_receipt_type } = proxy.useDict("wms_receipt_type");

const detailLoading = ref(false)
const initFormData = {
  id: undefined,
  receiptOrderNo: undefined,
  receiptOrderType: "",
  merchantId: undefined,
  orderNo: undefined,
  payableAmount: undefined,
  receiptOrderStatus: 0,
  remark: undefined,
  warehouseId: undefined,
  areaId: undefined,
  totalQuantity: 0,
  details: [],
}
const data = reactive({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    receiptOrderNo: undefined,
    receiptOrderType: undefined,
    orderNo: undefined,
    payableAmount: undefined,
    receiptOrderStatus: undefined,
  },
  rules: {
    id: [
      {required: true, message: "不能为空", trigger: "blur"}
    ],
    receiptOrderNo: [
      {required: true, message: "入库单号不能为空", trigger: "blur"}
    ],
    receiptOrderType: [
      {required: true, message: "入库类型不能为空", trigger: "change"}
    ],
    receiptOrderStatus: [
      {required: true, message: "入库状态不能为空", trigger: "change"}
    ],
    warehouseId: [
      {required: true, message: "请选择仓库", trigger: ['blur', 'change']}
    ],
  }
});
const { form, rules} = toRefs(data);

const cancel = () => {
  const obj = {path: "/receiptOrder"};
  proxy?.$tab.closeOpenPage(obj);
}
const skuSelectShow: Ref<boolean> = ref<boolean>(false)

// 选择商品 start
const showAddItem = () => {
  skuSelectShow.value = true
}
// 选择成功
const handleOkClick = (item) => {
  skuSelectShow.value = false
  item.forEach((it) => {
    form.value.details.push(
      {
        prod: it,
        money: undefined,
        subPrice: undefined,
        quantity: it.quantity,
        expirationTime: undefined,
        warehouseId: form.value.warehouseId,
        areaId: form.value.areaId
      }
    )
  })
}
// 选择商品 end

// 初始化receipt-order-form ref
const receiptForm = ref()

const save = () => {
  console.log('form', form.value)
  //验证receiptForm表单
  receiptForm.value?.validate((valid: any) => {
    // 校验
    if (!valid) {
      return ElMessage.error('请填写必填项')
    }
    if (form.value.details?.length) {
      const invalidAreaList = form.value.details.filter(it => !it.areaId )
      if (invalidAreaList?.length) {
        return ElMessage.error('请选择库区')
      }
      const invalidQuantityList = form.value.details.filter(it => !it.quantity)
      if (invalidQuantityList?.length) {
        return ElMessage.error('请选择数量')
      }
    }
    // 构建参数
    const details = form.value.details.map((it: {
      place: any[];
      prod: { warehouseId: null; areaId: null; rackId: null; id: any; };
      amount: any;
      quantity: any;
      batchNumber: any;
      productionDate: any;
      expirationTime: any;
      warehouseId: string;
      areaId: string;
      rackId: string;
    }) => {
      return {
        skuId: it.prod.id,
        amount: it.amount,
        quantity: it.quantity,
        batchNumber: it.batchNumber,
        productionDate: it.productionDate,
        expirationTime: it.expirationTime,
        warehouseId: form.value.warehouseId,
        areaId: it.areaId
      }
    })

    //console.log('提交前校验',form.value)
    const params = {
      id: form.value.id,
      receiptOrderNo: form.value.receiptOrderNo,
      receiptOrderStatus: form.value.receiptOrderStatus,
      receiptOrderType: form.value.receiptOrderType,
      merchantId: form.value.merchantId,
      orderNo: form.value.orderNo,
      remark: form.value.remark,
      payableAmount: form.value.payableAmount,
      totalQuantity: form.value.totalQuantity,
      warehouseId: form.value.warehouseId,
      areaId: form.value.areaId,
      details: details
    }
    if (params.id) {
      updateReceiptOrder(params).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg)
          cancel()
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else {
      addReceiptOrder(params).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg)
          cancel()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}


const updateToInvalid = () => {
  editReceiptOrderToInvalid(form.value.id).then(res => {
    if (res.code === 200) {
      ElMessage.success('操作成功')
      cancel()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const doWarehousing = () => {
  receiptForm.value?.validate((valid: any) => {
    // 校验
    if (!valid) {
      return ElMessage.error('请填写必填项')
    }
    if (!form.value.details?.length) {
      return ElMessage.error('请选择商品')
    }
    const invalidAreaList = form.value.details.filter(it => !it.areaId )
    if (invalidAreaList?.length) {
      return ElMessage.error('请选择库区')
    }
    const invalidQuantityList = form.value.details.filter(it => !it.quantity)
    if (invalidQuantityList?.length) {
      return ElMessage.error('请选择数量')
    }
    // 构建参数
    const details = form.value.details.map((it: {
      place: any[];
      prod: { warehouseId: null; areaId: null; rackId: null; id: any; };
      amount: any;
      quantity: any;
      batchNumber: any;
      productionDate: any;
      expirationTime: any;
      warehouseId: string;
      areaId: string;
      rackId: string;
    }) => {
      return {
        skuId: it.prod.id,
        amount: it.amount,
        quantity: it.quantity,
        batchNumber: it.batchNumber,
        productionDate: it.productionDate,
        expirationTime: it.expirationTime,
        warehouseId: form.value.warehouseId,
        areaId: it.areaId
      }
    })

    //console.log('提交前校验',form.value)
    const params = {
      id: form.value.id,
      receiptOrderNo: form.value.receiptOrderNo,
      receiptOrderStatus: form.value.receiptOrderStatus,
      receiptOrderType: form.value.receiptOrderType,
      merchantId: form.value.merchantId,
      orderNo: form.value.orderNo,
      remark: form.value.remark,
      payableAmount: form.value.payableAmount,
      totalQuantity: form.value.totalQuantity,
      warehouseId: form.value.warehouseId,
      areaId: form.value.areaId,
      details: details
    }
    warehousing(params).then((res) => {
      if (res.code === 200) {
        ElMessage.success('入库成功')
        cancel()
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
    generateReceiptOrderNo().then((res) => {
      form.value.receiptOrderNo = res.msg
    })
  }
})


// 获取入库单详情
const loadDetail = (id) => {
  getReceiptOrder(id).then((response) => {
    let { details } = response.data
    details = details.map(it => {
      return {
        prod: {
          id: it.skuId,
          itemName: it.itemName,
          itemCode: it.itemCode,
          itemBrand: it.itemBrand,
          skuName: it.skuName,
          barcode: it.barcode
        },
        id: it.id,
        receiptOrderId: it.receiptOrderId,
        skuId: it.skuId,
        amount: it.amount,
        quantity: it.quantity,
        batchNumber: it.batchNumber,
        productionDate: it.productionDate,
        expirationTime: it.expirationTime,
        remark: it.remark,
        warehouseId: it.warehouseId,
        areaId: it.areaId,
      }
    })
    console.info("details:", details)
    const areaSet = new Set(details.map(it => it.areaId))
    form.value = {
      ...response.data,
      details,
      warehouseId: details.length ? details[0].warehouseId : null,
      areaId: details.length ? (areaSet.size === 1 ? details[0].areaId : undefined) : null
    }
    Promise.resolve();
  }).then(() => {
  })
}

const handleChangeWarehouse = (e) => {
  form.value.areaId = undefined
  form.value.details.forEach(it => {
    it.areaId = undefined
  })
}

const handleChangeArea = (e) => {
  form.value.details.forEach(it => {
    it.areaId = e
  })
}

const handleChangeQuantity = () => {
  let sum = 0
  form.value.details.forEach(it => {
    if (it.quantity) {
      sum += it.quantity
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
  form.value.payableAmount = sum
}

const handleDeleteDetail = (row, index) => {
  if (row.id) {
    proxy.$modal.confirm('确认删除本条商品明细吗？').then(function () {
      return delReceiptOrderDetail(row.id);
    }).then(() => {
      form.value.details.splice(index, 1)
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  } else {
    form.value.details.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.module.scss";

.btn-box {
  width: calc(100% - #{$base-sidebar-width});
  display: flex;
  align-items: center;
  justify-content: space-between;
  float: right;
}
</style>
