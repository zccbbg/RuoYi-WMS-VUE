<template lang="pug">
.receipt-order-wrapper.app-container
  .receipt-order-content
    el-form(label-width="108px" :model="form" ref="form" :rules="rules")
      el-form-item(label="入库单号" prop="receiptOrderNo") {{form.receiptOrderNo}}
      el-form-item(label="入库类型" prop="receiptOrderType") {{selectDictLabel(dict.type.wms_receipt_type, form.receiptOrderType)}}
      el-form-item(label="供应商" prop="supplierId") {{supplierMap.get(form.supplierId)}}
      el-form-item(label="订单号" prop="orderNo") {{form.orderNo}}
      el-form-item(label="备注" prop="remark" ) {{form.remark}}
    el-divider
    .flex-center.mb8
      .flex-one 物料明细
    .table
      table.common-table
        tr
          th 物料名
          th 物料编号
          th 物料类型
          th 计划数量
          th 仓库/库区/货架
          th 操作
        tr(v-for="(it, index) in form.details")
          td(align="center") {{it.prod.itemName}}
          td(align="center") {{it.prod.itemNo}}
          td(align="center") {{it.prod.itemType}}
          td(align="center")
            el-input-number(v-model="it.planQuantity" placeholder="计划数量" :min="1" :max="2147483647")
          td(align="center") 
            WmsWarehouseCascader(v-model="it.place" size="small")
          td(align="center")
            a.red(@click="form.details.splice(index, 1)") 删除
      el-empty(v-if="!form.details || form.details.length === 0" :image-size="48")
    .tc.mt16
      el-button(@click="cancel") 取消
      el-button(@click="submitForm" type="primary" ) 保存
</template>

<script>
import { addOrUpdateWmsReceiptOrder, getWmsReceiptOrder } from '@/api/wms/receiptOrder'
import ItemSelect from '@/views/components/ItemSelect'
import { mapGetters } from 'vuex'

export default {
  name: 'WmsReceiptOrder',
  components: { ItemSelect },
  dicts: ['wms_receipt_type'],
  computed: {
  ...mapGetters(['supplierMap']),
  },
  data() {
    return {
      // 表单参数
      form: {
        details: []
      },
      // 表单校验
      rules: {},
      modalObj: {
        show: false,
        title: '',
        width: '50%',
        component: null,
        model: {},
        ok: () => {
        },
        cancel: () => {
        }
      }
    }
  },
  created() {
    const { id } = this.$route.query
    if (id) {
      this.loadDetail(id)
    } else {
      this.cancel();
    }
  },
  methods: {
    cancel() {
      this.$tab.closeOpenPage({ path: '/wms/receiptOrder' })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        const details = this.form.details.map(it => {
          console.log(it.place)
          if(it.place){
            it.prod.warehouseId=it.place[0]
            it.prod.areaId=it.place[1]
            it.prod.rackId=it.place[2]
          }else{
            it.prod.warehouseId=null
            it.prod.areaId=null
            it.prod.rackId=null
          }
          return {
            itemId: it.prod.id,
            rackId: it.prod.rackId,
            areaId: it.prod.areaId,
            warehouseId: it.prod.warehouseId,
            planQuantity: it.planQuantity,
            realQuantity: it.realQuantity,
            receiptOrderStatus: it.receiptOrderStatus,
            delFlag: 0
          }
        })
        const req = {...this.form, details}
        addOrUpdateWmsReceiptOrder(req).then(response => {
          this.$modal.msgSuccess(this.form.id ? '修改成功' : '新增成功')
          this.cancel();
        })
      })
    },
    loadDetail(id) {
      getWmsReceiptOrder(id).then(response => {
        console.log(this.dict.type.wms_receipt_type)
        const {details, items} = response
        const map = {};
        (items || []).forEach(it => {map[it.id] = it});
        details && details.forEach(it => it.prod = map[it.itemId])
        this.form = {
          ...response,
          details
        }
      })
    },
    confirmSelectItem() {
      const value = this.$refs['item-select'].rightList
      this.form.details = value.map(it => {
        return {
          prod: it,
          planQuantity: null,
          realQuantity: null,
          receiptOrderStatus: 0,
          delFlag: 0
        }
      })
      this.closeModal()
    },
    closeModal() {
      this.modalObj.show = false
    },
    showAddItem() {
      const ok = () => this.confirmSelectItem()
      const cancel = () => this.closeModal()
      this.modalObj = {
        show: true,
        title: '添加物料',
        width: '50%',
        component: 'add-item',
        model: {},
        ok,
        cancel
      }
    }
  }
}
</script>
<style lang="stylus">
.receipt-order-wrapper
  .receipt-order-content
    min-width 640px
    width 50%
    margin 0 auto
</style>
