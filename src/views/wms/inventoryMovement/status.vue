<template lang="pug">
.inventory-movement-status-wrapper.app-container(v-loading="loading")
  .inventory-movement-content
    el-form(label-width="108px" :model="form" ref="form" :rules="rules")
      el-form-item(label="移库单号" prop="inventoryMovementNo") {{form.inventoryMovementNo}}
      el-form-item(label="移库状态" prop="status") {{statusMap.get(form.status+'')}}
      el-form-item(label="备注" prop="remark" ) {{form.remark}}
    el-divider
    .flex-center.mb8
      .flex-one.large-tip.bolder-font 物料明细
      .ops
        el-button(
          v-if="mergeDetailStatusArray.length === 1"
          type="primary" plain size="small" @click="batch") 批量设置移库状态
    el-dialog(title="请选择移库状态" :visible.sync="open" width="50%" append-to-body)
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
            el-input-number(v-model="scope.row.realQuantity" :min="1" :max="2147483647" size="small")
        el-table-column(label="源 仓库/库区/货架" align="center" width="200")
          template(slot-scope="scope")
            WmsWarehouseCascader(v-model="scope.row.sourcePlace" size="small")
        el-table-column(label="目标 仓库/库区/货架" align="center" width="200")
          template(slot-scope="scope")
            WmsWarehouseCascader(v-model="scope.row.targetPlace" size="small")
        el-table-column(label="移库状态" width="150")
          template(slot-scope="{ row }")
            DictSelect(v-model="row.moveStatus" :options="row.range" size="small")
      el-empty(v-if="!form.details || form.details.length === 0" :image-size="48")
    .tc.mt16
      el-button(@click="cancel") 取消
      el-button(@click="submitForm" type="primary" ) 保存
</template>

<script>
import {addOrUpdateWmsInventoryMovement, getWmsInventoryMovement} from '@/api/wms/inventoryMovement'
import ItemSelect from '@/views/components/ItemSelect'

export default {
  name: 'WmsInventoryMovement',
  components: { ItemSelect },
  dicts: ['wms_movement_status'],
  computed: {
    statusMap() {
      let obj = this.dict.type.wms_movement_status.map(item => [item.value, item.label])
      let map = new Map(obj)
      return map
    },
    mergeDetailStatusArray() {
      const arr = this.sourceDetails || []
      return [...new Set(arr.filter(it => it.moveStatus !== null).map(it => it.moveStatus))]
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
      multiple: true
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
        this.$modal.alert('请选择移库状态')
        return
      }
      this.form.details.forEach(detail => {
        if (this.ids.includes(detail.id)) {
          detail.moveStatus = this.dialogStatus
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
      this.$tab.closeOpenPage({ path: '/wms/inventoryMovement' })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        const details = this.form.details.map(it => {
          let {sourcePlace, targetPlace} = it;
          return {
            id: it.id,
            itemId: it.prod.id,
            sourceRackId: sourcePlace ? sourcePlace[2] : null,
            sourceAreaId: sourcePlace ? sourcePlace[1] : null,
            sourceWarehouseId: sourcePlace ? sourcePlace[0] : null,
            targetRackId: targetPlace ? targetPlace[2] : null,
            targetAreaId: targetPlace ? targetPlace[1] : null,
            targetWarehouseId: targetPlace ? targetPlace[0] : null,
            planQuantity: it.planQuantity,
            realQuantity: it.realQuantity,
            moveStatus: it.moveStatus,
            delFlag: 0
          }
        })
        if (details.filter(it=>!it.sourceWarehouseId|| !it.targetWarehouseId)?.length > 0){
          this.$message.warning('请选择仓库、库区或货架')
          return;
        }
        const arr = details.filter(it=>it.sourceRackId===it.targetRackId && it.sourceAreaId === it.targetAreaId && it.sourceWarehouseId === it.targetWarehouseId)
        if (arr?.length > 0) {
          this.$message.warning('同一个物料不能选择相同的仓库、库区、货架')
          return;
        }
        const req = { ...this.form, details }
        addOrUpdateWmsInventoryMovement(req).then(response => {
          this.$modal.msgSuccess(this.form.id ? '修改成功' : '新增成功')
          this.cancel()
        })
      })
    },
    loadDetail(id) {
      this.loading = true
      getWmsInventoryMovement(id).then(response => {
        const { details, items } = response
        const map = {};
        (items || []).forEach(it => {
          map[it.id] = it
        })
        details && details.forEach(it => {
          it.prod = map[it.itemId]
          if ((!it.sourcePlace || it.sourcePlace.length === 0) && it.prod) {
            it.sourcePlace = it.prod.sourcePlace;
          }
          if ((!it.targetPlace || it.targetPlace.length === 0) && it.prod) {
            it.targetPlace = it.prod.targetPlace;
          }
          it.range = this.getRange(it.moveStatus)
        })
        this.sourceDetails = details.map(it => ({ ...it }))
        this.form = {
          ...response,
          details
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getRange(status) {
      const arr = this.dict.type.wms_movement_status
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
.inventory-movement-status-wrapper
  .inventory-movement-content
    width 70%
    min-width 900px
    margin 0 auto
</style>