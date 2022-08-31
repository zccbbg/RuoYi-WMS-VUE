<template>
  <div class="app-container">
    <el-form :model="form" :rules="rules" class="el-form--default el-form--label-right" inline label-width="108px" ref="form">
      <el-form-item label="入库类型" prop="receiptOrderType">
        <el-radio-group v-model="form.receiptOrderType">
          <el-radio-button :key="dict.value" :label="dict.value" v-for="dict in dict.type.wms_receipt_type">{{dict.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <WmsSupplierSelect v-model="form.supplierId"/>
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input placeholder="请输入订单号" v-model="form.orderNo"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input placeholder="请输入备注" v-model="form.remark"/>
      </el-form-item>
    </el-form>

  </div>

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
