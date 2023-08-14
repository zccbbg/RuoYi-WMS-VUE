<template>
  <div class="inventory-movement-status-wrapper app-container" v-loading="loading">
    <div class="inventory-movement-content">
      <el-form label-width="108px" :model="form" ref="form" :rules="rules">
        <el-form-item label="移库单号" prop="inventoryMovementNo">{{ form.inventoryMovementNo }}</el-form-item>
        <el-form-item label="移库状态" prop="status">{{ statusMap.get(form.status + '') }}</el-form-item>
        <el-form-item label="备注" prop="remark">{{ form.remark }}</el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-row class="mb8 mt10" :gutter="10">
        <el-col :span="1.5">
          <div class="flex-one large-tip bolder-font">物料明细</div>
        </el-col>
        <el-col :span="1.5">
          <el-button size="small" type="success" plain="plain" icon="el-icon-delete-location"
                     @click="onBatchSetInventory('sourcePlace')">
            设置源仓库
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button v-if="mergeDetailStatusArray.length === 1" type="primary" plain="plain" size="small"
                     @click="batch">批量设置出库状态
          </el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button size="small" icon="el-icon-aim" type="warning" plain="plain"
                     @click="onBatchSetInventory('targetPlace')">
            设置目标仓库
          </el-button>
        </el-col>

      </el-row>
      <el-dialog title="请选择移库状态" :visible.sync="open" width="50%" append-to-body="append-to-body">
        <DictRadio v-model="dialogStatus" :radioData="dialogStatusRange"></DictRadio>
        <div class="dialog-footer" slot="footer">
          <el-button type="primary" @click="dialogConfirm">确 定</el-button>
          <el-button @click="cancelDialog">取 消</el-button>
        </div>
      </el-dialog>
      <div class="table">
        <el-form ref="form" :model="form" :show-message="false">
          <WmsTable :data="form.details" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="物料名" align="center" prop="prod.itemName"></el-table-column>
            <el-table-column label="物料编号" align="center" prop="prod.itemNo"></el-table-column>
            <el-table-column label="物料类型" align="center" prop="prod.itemType"></el-table-column>
            <el-table-column label="计划数量" align="center" prop="planQuantity"></el-table-column>
            <el-table-column label="实际数量" align="center" width="150">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.realQuantity" :min="1" :max="2147483647" size="small"
                                 :disabled="scope.row.finish"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="源 仓库/库区" align="center" width="200">

              <template slot-scope="scope">
                <el-form-item :prop=" 'details.' + scope.$index + '.sourcePlace' "
                              :rules="[{ required: true, message: '请选择源 仓库/库区', trigger: 'change' }]"
                              style="margin-bottom: 0!important;">
                  <WmsWarehouseCascader v-model="scope.row.sourcePlace" size="small"
                                        :disabled="scope.row.finish"></WmsWarehouseCascader>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="目标 仓库/库区" align="center" width="200">

              <template slot-scope="scope">
                <el-form-item :prop=" 'details.' + scope.$index + '.targetPlace' "
                              :rules="[{ required: true, message: '请选择目标 仓库/库区', trigger: 'change' }]"
                              style="margin-bottom: 0!important;">
                  <WmsWarehouseCascader v-model="scope.row.targetPlace" size="small"
                                        :disabled="scope.row.finish"></WmsWarehouseCascader>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="移库状态" width="150">
              <template slot-scope="{ row }">
                <DictSelect v-model="row.moveStatus" :options="row.range" size="small"
                            :disabled="row.finish"></DictSelect>
              </template>
            </el-table-column>
          </WmsTable>
        </el-form>
        <el-empty v-if="!form.details || form.details.length === 0" :image-size="48"></el-empty>
      </div>
      <div class="tc mt16">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="submitForm" type="primary" :disabled="finish">保存</el-button>
      </div>
    </div>
    <BatchWarehouseDialog
      :visible.sync="batchDialogVisible"
      :form-data.sync="batchForm"
      @confirmed="onBatchDialogFinished"
    ></BatchWarehouseDialog>
  </div>
</template>

<script>
import {addOrUpdateWmsInventoryMovement, getWmsInventoryMovement} from '@/api/wms/inventoryMovement'
import ItemSelect from '@/views/components/ItemSelect'
import BatchWarehouseDialog from "@/views/components/wms/BatchWarehouseDialog/index.vue";

export default {
  name: 'WmsInventoryMovement',
  components: {BatchWarehouseDialog, ItemSelect},
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
      // 批量设置仓库/库区
      batchDialogVisible: false,
      batchDialogField: '',
      batchForm: {
        place: []
      },
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
    const {id} = this.$route.query
    if (id) {
      this.loadDetail(id)
    } else {
      this.cancel()
    }
  },
  methods: {
    /** 批量设置仓库/库区 */
    onBatchSetInventory(field) {
      const {details} = this.form
      if (!details || details.length === 0) {
        this.$modal.msgError('请先添加物料')
        return
      }
      // 未选中
      if (!this.ids.length) {
        this.$modal.msgError('请先选择物料')
        return
      }
      this.batchDialogVisible = true
      this.batchDialogField = field
    },
    onBatchDialogFinished() {
      this.batchDialogVisible = false
      const [warehouseId, areaId, rackId] = this.batchForm.place || []
      this.form.details.forEach(it => {
        // 仅更新已选中
        if (this.ids.includes(it.id)) {
          it[this.batchDialogField] = [warehouseId, areaId, rackId].filter(Boolean)
        }
      })
    },
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
      this.$tab.closeOpenPage({path: '/wms/inventoryMovement'})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          this.$notify({
            title: '警告',
            message: "请完善表单信息",
            type: 'warning'
          });
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
        if (details.filter(it => !it.sourceWarehouseId || !it.targetWarehouseId)?.length > 0) {
          this.$message.warning('请选择仓库、库区或货架')
          return;
        }
        const arr = details.filter(it => it.sourceRackId === it.targetRackId && it.sourceAreaId === it.targetAreaId && it.sourceWarehouseId === it.targetWarehouseId)
        if (arr?.length > 0) {
          this.$message.warning('同一个物料不能选择相同的仓库、库区、货架')
          return;
        }
        const req = {...this.form, details}
        addOrUpdateWmsInventoryMovement(req).then(response => {
          this.$modal.msgSuccess(this.form.id ? '修改成功' : '新增成功')
          this.cancel()
        })
      })
    },
    loadDetail(id) {
      this.loading = true
      getWmsInventoryMovement(id).then(response => {
        const {details, items} = response
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
          it.finish = it.moveStatus === 23
        })
        this.finish = details.filter(it => !it.finish)?.length === 0
        this.sourceDetails = details.map(it => ({...it}))
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
        return arr.filter(it => +it.value === status).map(it => ({label: it.label, value: it.value}))
      }
      if (status === 2) {
        return arr.filter(it => +it.value >= status && +it.value !== 4).map(it => ({
          label: it.label,
          value: it.value
        }))
      }
      return arr.filter(it => +it.value >= status).map(it => ({label: it.label, value: it.value}))
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
