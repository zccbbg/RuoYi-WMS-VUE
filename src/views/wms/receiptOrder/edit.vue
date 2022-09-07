<template lang="pug">
.receipt-order-wrapper.app-container
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
      .flex-one 入库单详情
      .ops
        el-button(type="primary" plain size="small" @click="showAddItem") 添加物料
    .table
      table.common-table
        tr
          th(style="width: 240px") 物料
          th 计划数量
          th 实际数量
          th 入库状态
          th 操作
        tr(v-for="(it, index) in form.details")
          td
            template(v-if="it.prod")
              div {{it.prod.itemName}}
              .mt8
                el-tag(v-if="it.prod.itemType" size="mini") {{it.prod.itemType}}
                span.ml8 {{it.prod.itemNo}}
          td
            el-input(v-model="it.planQuantity" placeholder="计划数量")
          td
            el-input(v-model="it.realQuantity" placeholder="实际数量")
          td
            el-select(v-model="it.receiptOrderStatus")
              el-option(:value="0" label="未入库")
              el-option(:value="1" label="已入库")
              el-option(:value="2" label="部分入库")
          td
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
.receipt-order-wrapper
  .receipt-order-content
    min-width 640px
    width 50%
    margin 0 auto
</style>
