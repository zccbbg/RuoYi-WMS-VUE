<template lang="pug">
.receipt-order-edit-wrapper.app-container
  .receipt-order-content
    el-form(label-width="108px" :model="form" ref="form" :rules="rules")
      el-form-item(label="入库单号" prop="receiptOrderNo")
        el-input.w200(v-model="form.receiptOrderNo" placeholder="入库单号" disabled)
      el-form-item(label="入库类型" prop="receiptOrderType")
        el-radio-group(v-model="form.receiptOrderType")
          el-radio-button(v-for="dict in dict.type.wms_receipt_type" :key="dict.value" :label="dict.value") {{dict.label}}
      el-form-item(label="供应商" prop="supplierId")
        WmsSupplierSelect(v-model="form.supplierId")
      el-form-item(label="订单号" prop="orderNo")
        el-input(v-model="form.orderNo" placeholder="请输入订单号")
      el-form-item(label="备注" prop="remark")
        el-input(v-model="form.remark" placeholder="备注...100个字符以内" rows="3" maxlength="100" type="textarea" show-word-limit)
    el-divider
    .flex-center.mb8
      .flex-one.large-tip.bolder-font 物料明细
      .ops
        el-button(type="primary" plain size="small" @click="showAddItem") 添加物料
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
  el-dialog(:visible="modalObj.show" :title="modalObj.title" :width="modalObj.width" @close="modalObj.cancel")
    template(v-if="modalObj.component === 'add-item'")
      item-select(ref="item-select")
    template(#footer)
      el-button(v-if="modalObj.cancel" @click="modalObj.cancel") 取消
      el-button(v-if="modalObj.ok" type="primary" @click="modalObj.ok") 确认
</template>

<script>
import { addOrUpdateWmsReceiptOrder, getWmsReceiptOrder } from '@/api/wms/receiptOrder'
import { randomId } from '@/utils/RandomUtils'
import ItemSelect from '@/views/components/ItemSelect'

export default {
  name: 'WmsReceiptOrder',
  components: { ItemSelect },
  dicts: ['wms_receipt_type'],
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
      this.reset()
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
    // 表单重置
    reset() {
      this.form = {
        id: null,
        receiptOrderNo: 'R-' + randomId(),
        receiptOrderType: 1,
        supplierId: null,
        orderNo: null,
        receiptOrderStatus: 0,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        details: []
      }
      this.resetForm('form')
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
.receipt-order-edit-wrapper
  .receipt-order-content
    width 70%
    min-width 900px
    margin 0 auto
</style>
