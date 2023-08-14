<template>
  <div class="receipt-order-status-wrapper app-container" v-loading="loading">
    <div class="receipt-order-content">
      <el-form label-width="108px" :model="form" ref="form" :rules="rules">
        <el-form-item label="入库单号" prop="receiptOrderNo">{{ form.receiptOrderNo }}</el-form-item>
        <el-form-item label="入库状态" prop="receiptOrderNo">{{ receiptStatusMap.get(form.receiptOrderStatus + '') }}
        </el-form-item>
        <el-form-item label="入库类型" prop="receiptOrderType">
          {{ selectDictLabel(dict.type.wms_receipt_type, form.receiptOrderType) }}
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">{{ supplierMap.get(form.supplierId) }}</el-form-item>
        <el-form-item label="订单号" prop="orderNo">{{ form.orderNo }}</el-form-item>
        <el-form-item label="备注" prop="remark">{{ form.remark }}</el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-row class="mb8 mt10" :gutter="10">
        <el-col :span="1.5">
          <div class="flex-one large-tip bolder-font">物料明细</div>
        </el-col>
        <el-col :span="1.5">
          <el-button size="small" type="success" plain="plain" icon="el-icon-delete-location"
                     @click="onBatchSetInventory">
            批量设置仓库/库区
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button v-if="mergeDetailStatusArray.length === 1" type="primary" plain="plain" size="small"
                     @click="batch">批量设置出库状态
          </el-button>
        </el-col>

      </el-row>

      <el-dialog title="请选择入库状态" :visible.sync="open" width="50%" append-to-body="append-to-body">
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
            <el-table-column label="物料类型" align="center" prop="prod.itemType" class="mb20"></el-table-column>
            <el-table-column label="计划数量" align="center" prop="planQuantity" class="mb20"></el-table-column>
            <el-table-column label="实际数量" align="center" width="150">
              <template slot-scope="scope" class="mb20">
                <el-input-number v-model="scope.row.realQuantity" :min="1" :max="2147483647" size="small"
                                 :disabled="scope.row.finish"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="仓库/库区" align="center" width="200">
              <template slot-scope="scope">
                <el-form-item :prop=" 'details.' + scope.$index + '.place' "
                              :rules="[{ required: true, message: '请选择仓库/库区', trigger: 'change' }]"
                              style="margin-bottom: 0!important;">
                  <WmsWarehouseCascader v-model="scope.row.place" size="small"
                                        :disabled="scope.row.finish"></WmsWarehouseCascader>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="入库状态" width="150">
              <template slot-scope="{ row }">
                <DictSelect v-model="row.receiptOrderStatus" :options="row.range" size="small"
                            @change="setReceiptOrderStatus" :disabled="row.finish"></DictSelect>
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
import {addOrUpdateWmsReceiptOrder, getWmsReceiptOrder} from '@/api/wms/receiptOrder'
import ItemSelect from '@/views/components/ItemSelect'
import {mapGetters} from 'vuex'
import BatchWarehouseDialog from "@/views/components/wms/BatchWarehouseDialog/index.vue";
import {ReceiptOrderConstant} from "@/constant/ReceiptOrderConstant.ts";

export default {
  name: 'WmsReceiptOrder',
  components: {BatchWarehouseDialog, ItemSelect},
  dicts: ['wms_receipt_type', 'wms_receipt_status'],
  computed: {
    ReceiptOrderConstant() {
      return ReceiptOrderConstant
    },
    ...mapGetters(['supplierMap']),
    receiptStatusMap() {
      let obj = this.dict.type.wms_receipt_status.map(item => [item.value, item.label])
      let map = new Map(obj)
      return map
    },
    mergeDetailStatusArray() {
      const arr = this.sourceDetails || []
      return [...new Set(arr.filter(it => it.receiptOrderStatus !== null).map(it => it.receiptOrderStatus))]
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
      finish: false,
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
    onBatchSetInventory() {
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
    },
    /** 批量设置仓库/库区 完成事件 */
    onBatchDialogFinished() {
      this.batchDialogVisible = false
      const [warehouseId, areaId, rackId] = this.batchForm.place || []
      this.form.details.forEach(it => {
        // 仅更新已选中
        if (this.ids.includes(it.id)) {
          it.place = [warehouseId, areaId, rackId].filter(Boolean)
        }
      })
    },
    dialogConfirm() {
      if (!this.dialogStatus) {
        this.$modal.alert('请选择入库状态')
        return
      }
      this.form.details.forEach(detail => {
        if (this.ids.includes(detail.id)) {
          detail.receiptOrderStatus = this.dialogStatus
        }
      })
      this.setReceiptOrderStatus()
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
      this.$tab.closeOpenPage({path: '/wms/receiptOrder'})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid, msg) => {
        if (!valid) {
          this.$notify({
            title: '警告',
            message: "请完善表单信息",
            type: 'warning'
          });
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
            receiptOrderStatus: it.receiptOrderStatus,
            delFlag: 0
          }
        })
        const req = {...this.form, details}
        addOrUpdateWmsReceiptOrder(req).then(response => {
          this.$modal.msgSuccess(this.form.id ? '修改成功' : '新增成功')
          this.cancel()
        })
      })
    },
    setReceiptOrderStatus() {
      this.form.receiptOrderStatus = this.getReceiptOrderStatus()
    },
    getReceiptOrderStatus() {
      let receiptOrderStatusArray = []
      this.form.details.map(it => {
        receiptOrderStatusArray.push(Number(it.receiptOrderStatus))
      })
      if (receiptOrderStatusArray.length == 0) {
        return 0
      }
      for (let i = 0; i < 5; i++) {
        if (receiptOrderStatusArray.every((item) => item == i)) {
          return i
        }
      }
      if (receiptOrderStatusArray.includes(3) || receiptOrderStatusArray.includes(2)) {
        if (receiptOrderStatusArray.includes(0) || receiptOrderStatusArray.includes(1)) {
          return 2
        }
      }
      if (receiptOrderStatusArray.includes(1)) {
        return 1
      } else if (receiptOrderStatusArray.includes(2)) {
        return 2
      } else if (receiptOrderStatusArray.includes(0)) {
        return 0
      } else if (receiptOrderStatusArray.includes(3)) {
        return 3
      }
    },
    loadDetail(id) {
      this.loading = true
      getWmsReceiptOrder(id).then(response => {
        const {details, items} = response
        const map = {};
        (items || []).forEach(it => {
          map[it.id] = it
        })
        details && details.forEach(it => {
          it.prod = map[it.itemId]
          if ((!it.place || it.place.length === 0) && it.prod) {
            it.place = it.prod.place;
          }
          it.range = this.getRange(it.receiptOrderStatus)
          it.finish = it.receiptOrderStatus === 3
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
      const arr = this.dict.type.wms_receipt_status
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
.receipt-order-status-wrapper
  .receipt-order-content
    width 70%
    min-width 900px
    margin 0 auto
</style>
