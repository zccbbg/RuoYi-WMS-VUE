<template lang="pug">
.shipment-order-status-wrapper.app-container(v-loading="loading")
  .shipment-order-content
    el-form(label-width="108px" :model="form" ref="form" :rules="rules")
      el-form-item(label="出库单号" prop="shipmentOrderNo") {{form.shipmentOrderNo}}
      el-form-item(label="出库状态" prop="shipmentOrderNo") {{shipmentStatusMap.get(form.shipmentOrderStatus+'')}}
      el-form-item(label="出库类型" prop="shipmentOrderType") {{selectDictLabel(dict.type.wms_shipment_type, form.shipmentOrderType)}}
      el-form-item(label="客户" prop="customerId") {{customerMap.get(form.customerId)}}
      el-form-item(label="订单号" prop="orderNo") {{form.orderNo}}
      el-form-item(label="备注" prop="remark" ) {{form.remark}}
    el-divider
    .flex-center.mb8
      .flex-one.large-tip.bolder-font 物料明细
      .ops
        el-button(
          v-if="mergeDetailStatusArray.length === 1"
          type="primary" plain size="small" @click="batch") 批量设置出库状态
    el-dialog(title="请选择出库状态" :visible.sync="open" width="50%" append-to-body)
      DictRadio(v-model="dialogStatus" :radioData="dialogStatusRange")
      .dialog-footer(slot="footer")
        el-button(type="primary" @click="dialogConfirm") 确 定
        el-button(@click="cancelDialog") 取 消
    .table
      WmsTable(:data="form.details" @selection-change="handleSelectionChange")
        el-table-column(type="selection" width="55" align="center")
        el-table-column(label="物料名" align="center" prop="prod.itemName")
        el-table-column(label="物料编号" align="center" prop="prod.itemNo")
        el-table-column(label="物料类型" align="center" prop="prod.itemType")
        el-table-column(label="计划数量" align="center" prop="planQuantity")
        el-table-column(label="实际数量" align="center" width="150")
          template(slot-scope="scope")
            el-input-number(v-model="scope.row.realQuantity" :min="1" :max="2147483647" size="small" :disabled="scope.row.finish")
        el-table-column(label="仓库/库区/货架" align="center" width="200")
          template(slot-scope="scope")
            WmsWarehouseCascader(v-model="scope.row.place" size="small" :disabled="scope.row.finish")
        el-table-column(label="出库状态" width="150")
          template(slot-scope="{ row }")
            DictSelect(v-model="row.shipmentOrderStatus" :options="row.range" size="small" :disabled="row.finish")
      el-empty(v-if="!form.details || form.details.length === 0" :image-size="48")
    .tc.mt16
      el-button(@click="cancel") 取消
      el-button(@click="submitForm" type="primary" :disabled="finish") 保存
</template>

<script>
import { addOrUpdateWmsShipmentOrder, getWmsShipmentOrder } from '@/api/wms/shipmentOrder'
import ItemSelect from '@/views/components/ItemSelect'
import { mapGetters } from 'vuex'

export default {
  name: 'WmsShipmentOrder',
  components: { ItemSelect },
  dicts: ['wms_shipment_type', 'wms_shipment_status'],
  computed: {
    ...mapGetters(['customerMap']),
    shipmentStatusMap() {
      let obj = this.dict.type.wms_shipment_status.map(item => [item.value, item.label])
      let map = new Map(obj)
      return map
    },
    mergeDetailStatusArray() {
      const arr = this.sourceDetails || []
      return [...new Set(arr.filter(it => it.shipmentOrderStatus !== null).map(it => it.shipmentOrderStatus))]
    },
    dialogStatusRange() {
      if (this.mergeDetailStatusArray.length !== 1) {
        return []
      }
      return this.getRange(this.mergeDetailStatusArray[0])
    }
  },
  data() {
    return {
      open: false,
      // 遮罩层
      loading: true,
      ids: [],
      // 表单参数
      form: {
        details: []
      },
      sourceDetails: [],
      // 表单校验
      rules: {},
      dialogStatus: null,
      // 非多个禁用
      multiple: true,
      finish: false
    }
  },
  created() {
    const { id } = this.$route.query
    if (id) {
      this.loadDetail(id)
    } else {
      this.cancel()
    }
  },
  methods: {
    dialogConfirm() {
      if (!this.dialogStatus) {
        this.$modal.alert('请选择出库状态')
        return
      }
      this.form.details.forEach(detail => {
        if (this.ids.includes(detail.id)) {
          detail.shipmentOrderStatus = this.dialogStatus
        }
      })
      this.cancelDialog()
    },
    cancelDialog() {
      this.open = false
      this.dialogStatus = null
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    batch() {
      if (this.multiple) {
        this.$modal.alert('请先选择物料')
      } else {
        this.open = true
      }
    },
    cancel() {
      this.$tab.closeOpenPage({ path: '/wms/shipmentOrder' })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        const details = this.form.details.map(it => {
          if (it.place) {
            it.prod.warehouseId = it.place[0]
            it.prod.areaId = it.place[1]
            it.prod.rackId = it.place[2]
          } else {
            it.prod.warehouseId = null
            it.prod.areaId = null
            it.prod.rackId = null
          }
          return {
            id: it.id,
            itemId: it.prod.id,
            rackId: it.prod.rackId,
            areaId: it.prod.areaId,
            warehouseId: it.prod.warehouseId,
            planQuantity: it.planQuantity,
            realQuantity: it.realQuantity,
            shipmentOrderStatus: it.shipmentOrderStatus,
            delFlag: 0
          }
        })
        const req = { ...this.form, details }
        addOrUpdateWmsShipmentOrder(req).then(response => {
          this.$modal.msgSuccess(this.form.id ? '修改成功' : '新增成功')
          this.cancel()
        })
      })
    },
    loadDetail(id) {
      this.loading = true
      getWmsShipmentOrder(id).then(response => {
        const { details, items } = response
        const map = {};
        (items || []).forEach(it => {
          map[it.id] = it
        })
        details && details.forEach(it => {
          it.prod = map[it.itemId]
          if ((!it.place || it.place.length === 0) && it.prod) {
            it.place = it.prod.place;
          }
          it.range = this.getRange(it.shipmentOrderStatus)
          it.finish = it.shipmentOrderStatus === 13
        })
        this.sourceDetails = details.map(it => ({ ...it }))
        this.finish = details.filter(it=>!it.finish)?.length === 0
        this.form = {
          ...response,
          details
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getRange(status) {
      const arr = this.dict.type.wms_shipment_status
      if (status === 4 || status === 3) {
        return arr.filter(it => +it.value === status).map(it => ({ label: it.label, value: it.value }))
      }
      if (status === 2) {
        return arr.filter(it => +it.value >= status && +it.value !== 4).map(it => ({
          label: it.label,
          value: it.value
        }))
      }
      return arr.filter(it => +it.value >= status).map(it => ({ label: it.label, value: it.value }))
    }
  }
}
</script>
<style lang="stylus">
.shipment-order-status-wrapper
  .shipment-order-content
    width 70%
    min-width 900px
    margin 0 auto
</style>
