<template>
  <div class="shipment-order-status-wrapper app-container" v-loading="loading">
    <div class="shipment-order-content">
      <el-row class="mb8 mt10" :gutter="10">
        <el-col :span="1.5">
          <div class="flex-one large-tip bolder-font">入库单明细</div>
        </el-col>
      </el-row>

      <el-dialog title="请选择入库状态" :visible.sync="open" width="50%" append-to-body="append-to-body">
        <DictRadio v-model="dialogStatus" :radioData="dialogStatusRange"></DictRadio>
        <div class="dialog-footer" slot="footer">
          <el-button type="primary" @click="dialogConfirm">确 定</el-button>
          <el-button @click="cancelDialog">取 消</el-button>
        </div>
      </el-dialog>

      <WmsTable :data="form.details" @selection-change="handleSelectionChange">
        <el-table-column label="入库单" align="center" width="200" prop="orderNo"/>
        <el-table-column label="物料名" align="center" prop="prod.itemName"></el-table-column>
        <el-table-column label="物料编号" align="center" prop="prod.itemNo"></el-table-column>
        <el-table-column label="计划数量" align="center" prop="planQuantity"></el-table-column>

      </WmsTable>
      <el-row class="mb8 mt20" :gutter="10">
        <el-col>
          <div class="flex-one large-tip bolder-font">备注</div>
          <el-input class="mt10" type="textarea" v-model="form.remark"/>
        </el-col>
      </el-row>
      <el-row class="mb8 mt20" :gutter="10">
        <el-col :span="1.5" v-if="form.status === '1'" >
          <el-button size="small" icon="el-icon-check" type="warning" plain="plain" @click="dialogFormVisible = true">
            分配仓库/库区
          </el-button>
        </el-col>
<!--        <el-col :span="1.5">-->
<!--          <el-button size="small" type="danger" plain="plain" @click="onCancelInventory">-->
<!--            取消分配-->
<!--          </el-button>-->
<!--        </el-col>-->
        <el-col :span="1.5" >
          <el-button size="small" type="success" plain="plain" icon="el-icon-delete-location"
                     @click="onBatchSetInventory">
            批量设置仓库/库区
          </el-button>
        </el-col>
        <el-col :span="1.5" >
          <el-button v-if="mergeDetailStatusArray.length === 1" type="primary" plain="plain" size="small"
                     @click="batch">批量设置入库状态
          </el-button>
        </el-col>
      </el-row>
      <WmsTable :data="form.allocationDetails" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"
                         :selectable="(row)=>!row.finish"></el-table-column>
        <el-table-column label="入库单" align="center" width="200" prop="orderNo"/>
        <el-table-column label="物料名" align="center" prop="prod.itemName"></el-table-column>
        <el-table-column label="物料编号" align="center" prop="prod.itemNo"></el-table-column>
        <el-table-column label="数量" align="center" prop="planQuantity"></el-table-column>
        <el-table-column label="实际数量" align="center" width="150">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.realQuantity" :min="1" :max="2147483647" size="small"
                             :disabled="scope.row.finish"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="仓库/库区" align="center" width="200">
          <template slot-scope="scope">
            <WmsWarehouseCascader v-model="scope.row.place" size="small"
                                  :disabled="scope.row.finish"></WmsWarehouseCascader>
          </template>
        </el-table-column>
        <el-table-column label="入库状态" width="150">
          <template slot-scope="{ row }">
            <DictSelect v-model="row.receiptOrderStatus" :options="row.range" size="small"
                        :disabled="row.finish"></DictSelect>
          </template>
        </el-table-column>
      </WmsTable>
      <div class="tc mt16">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="submitForm" type="primary" :disabled="finish">保存</el-button>
      </div>
      <BatchWarehouseDialog
        :visible.sync="batchDialogVisible"
        :form-data.sync="batchForm"
        @confirmed="onBatchDialogFinished"
      ></BatchWarehouseDialog>
      <el-dialog title="自动分配仓库/库区" :visible.sync="dialogFormVisible" width="400px">
        <el-form :model="dialogForm">
          <el-form-item label="分配策略" label-width="98px"
                        :rules="[{ required: true, message: '请选择分配策略', trigger: 'change' }]">
            <el-select v-model="dialogForm.region" placeholder="请选择分配策略">
              <el-option label="库存量小的库位优先" :value="1"></el-option>
              <el-option label="库存量大的库位优先" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="allocated()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ItemSelect from '@/views/components/ItemSelect'
import {mapGetters} from 'vuex'
import WmsCarrier from "@/views/wms/carrier/index.vue";
import BatchWarehouseDialog from "@/views/components/wms/BatchWarehouseDialog/index.vue";
import {ShipmentOrderConstant} from "@/constant/ShipmentOrderConstant.ts";
import {cancelAllocatedInventoryForReceipt, confirmWaveForReceipt, getReceiptWave, waveAllocatedInventoryForReceipt} from "@/api/wms/wave";

export default {
  components: {BatchWarehouseDialog, WmsCarrier, ItemSelect},
  dicts: ['wms_receipt_type', 'wms_receipt_status'],
  computed: {
    ShipmentOrderConstant() {
      return ShipmentOrderConstant
    },
    ...mapGetters(['customerMap', 'carrierMap']),
    shipmentStatusMap() {
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
      // 分配仓库
      dialogFormVisible: false,
      dialogForm: {
        region: 1,
      },
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
      // 物流管理
      deliveryTitle: '',
      waveOrderId: null,
      columns: [
        {key: 1, label: "出库单主表Id", visible: false},
        {key: 2, label: "承运商Id", visible: true},
        {key: 3, label: "发货日期", visible: true},
        {key: 4, label: "快递单号", visible: true},
        {key: 5, label: "备注", visible: true},
      ],
    }
  },
  created() {
    // console.log(this.$route.query, "this.$route.query")
    const {id} = this.$route.query
    if (id) {
      this.waveOrderId = id
      this.loadDetail(id)
    } else {
      this.cancel()
    }
  },
  methods: {
    /** 取消分配 */
    onCancelInventory(){
      cancelAllocatedInventoryForReceipt(this.waveOrderId).then(res=>{
        this.$modal.msgSuccess(res ? '修改成功' : '修改失败')
        this.cancel()
      })
    },
    /** 自动分配 仓库/库区 */
    allocated() {
      waveAllocatedInventoryForReceipt({id:this.waveOrderId,type:this.dialogForm.region}).then(response => {
        this.$modal.msgSuccess("分配成功");
        this.dialogFormVisible = false;
        const {details, items, allocationDetails} = response
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
        let count = 1;
        allocationDetails && allocationDetails.forEach(it => {
          it.id = count++;
          it.prod = map[it.itemId]
          if ((!it.place || it.place.length === 0) && it.prod) {
            it.place = it.prod.place;
          }
          it.range = this.getRange(it.receiptOrderStatus)
          it.finish = it.receiptOrderStatus === 3
        })
        this.sourceDetails = allocationDetails.map(it => ({...it}))
        this.finish = allocationDetails.filter(it => !it.finish)?.length === 0
        this.form = {
          ...response,
          details,
          allocationDetails
        }
        // this.loadDetail(this.shipmentOrderId)
      });
    },
    /** 批量设置仓库/库区 */
    onBatchSetInventory() {
      const {allocationDetails} = this.form
      if (!allocationDetails || allocationDetails.length === 0) {
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
      this.form.allocationDetails.forEach(it => {
        // 仅更新已选中
        if (this.ids.includes(it.id)) {
          it.place = [warehouseId, areaId, rackId].filter(Boolean)
        }
      })
    },
    // 格式化承运商
    getCarrier(row, column) {
      return this.carrierMap.get(row.carrierId)
    },
    dialogConfirm() {
      if (!this.dialogStatus) {
        this.$modal.alert('请选择出库状态')
        return
      }
      this.form.allocationDetails.forEach(detail => {
        if (this.ids.includes(detail.id)) {
          detail.receiptOrderStatus = this.dialogStatus
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
      this.$tab.closeOpenPage({path: '/wms/receiptOrder'})
    },
    /** 提交按钮 */
    submitForm() {
      this.form.allocationDetails.forEach(it=>{
        if (it.place) {
          it.warehouseId = it.place[0]
          it.areaId = it.place[1]
          it.rackId = it.place[2]
        } else {
          it.warehouseId = null
          it.areaId = null
          it.rackId = null
        }
        it.delFlag = 0;
      })
      const req = {...this.form,id:this.waveOrderId,remark:this.form.remark}
      confirmWaveForReceipt(req).then(response => {
        if (response.code == 398) {
          return
        }
        this.$modal.msgSuccess('保存成功')
        this.cancel()
      })

    },
    loadDetail(id) {
      this.loading = true
      getReceiptWave(id).then(response => {
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
        console.log(details)
        this.sourceDetails = details.map(it => ({...it}))
        this.finish = details.filter(it => !it.finish)?.length === 0
        this.form = {
          ...response,
          details,
          allocationDetails: details.map(it => ({...it}))
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
.shipment-order-status-wrapper
  .shipment-order-content
    width 70%
    min-width 900px
    margin 0 auto
</style>
