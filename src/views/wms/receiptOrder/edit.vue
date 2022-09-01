<template lang="pug">
.receipt-order-wrapper.app-container
  .content
    el-form(label-width="108px" :model="form" ref="form" :rules="rules")
      el-form-item(label="入库单号" prop="receiptOrderNo")
        .flex-center
          el-input.w200(v-model="form.receiptOrderNo" placeholder="入库单号")
          a.ml8 自动生成
      el-form-item(label="入库类型" prop="receiptOrderType")
        el-radio-group(v-model="form.receiptOrderType")
          el-radio-button(v-for="dict in dict.type.wms_receipt_type" :key="dict.value" :label="dict.value") {{dict.label}}
      el-form-item(label="供应商" prop="supplierId")
        WmsSupplierSelect(v-model="form.supplierId")
      el-form-item(label="订单号" prop="orderNo")
        el-input(v-model="form.orderNo" placeholder="请输入订单号")
      el-form-item(label="备注" prop="remark")
        el-input(v-model="form.remark" placeholder="请输入备注")
    el-divider
    .flex-center.mb8
      .flex-one 入库单详情
      .ops
        el-button(type="primary" plain size="small") 添加物料
    .table
      table.common-table
        tr
          th 物料
          th 计划数量
          th 实际数量
          th 入库状态
          th 操作
        tr
          td
            span 物料1
          td
            el-input
          td
            el-input
          td
            el-select
          td
            a.red 删除
</template>

<script>
import { addWmsReceiptOrder, updateWmsReceiptOrder } from "@/api/wms/receiptOrder";

export default {
  name: "WmsReceiptOrder",
  dicts: ['wms_receipt_type'],
  methods:{
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsReceiptOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
            });
          } else {
            addWmsReceiptOrder(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
            });
          }
        }
      });
    },
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
    }
  }
}
</script>
<style lang="stylus">
.receipt-order-wrapper
  .content
    min-width 640px
    width 50%
    margin 0 auto
</style>
