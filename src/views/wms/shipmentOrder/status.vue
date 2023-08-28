<template>
  <div class="shipment-order-status-wrapper app-container" v-loading="loading">
    <div class="shipment-order-content">
      <el-form label-width="108px" :model="form" ref="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="出库状态" prop="shipmentOrderNo">
              <el-tag> {{ shipmentStatusMap.get(form.shipmentOrderStatus + '') }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="出库类型" prop="shipmentOrderType">
              {{ selectDictLabel(dict.type.wms_shipment_type, form.shipmentOrderType) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="出库单号" prop="shipmentOrderNo">{{ form.shipmentOrderNo }}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="订单号" prop="orderNo">{{ form.orderNo }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="客户" prop="customerId">{{ customerMap.get(form.customerId) }}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="备注" prop="remark">{{ form.remark }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider/>

      <div class="flex-center mb8">
        <div class="flex-one large-tip bolder-font">物流信息</div>
        <div class="ops">
          <el-button v-if="mergeDetailStatusArray.length === 1" type="primary" plain="plain" size="small"
                     @click="deliveryAdd">新增快递单号
          </el-button>
        </div>
      </div>

      <div class="table">
        <WmsTable v-loading="loading" :data="form.delivery" @selection-change="handleSelectionChange">
          <el-table-column label="出库单主表Id" align="center" prop="shipmentOrderId" v-if="columns[0].visible"/>
          <el-table-column label="承运商" align="center" :formatter="getCarrier" prop="carrierId"
                           v-if="columns[1].visible"/>
          <el-table-column label="发货日期" align="center" prop="deliveryDate" width="180" v-if="columns[2].visible">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.deliveryDate, '') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="快递单号" align="center" prop="trackingNo" v-if="columns[3].visible">
            <!--        https://www.kuaidi100.com/chaxun?com=[]&nu=[]-->
            <template slot-scope="scope">
              <a
                target="_blank"
                :href=" 'https://www.kuaidi100.com/chaxun?com='+getCarrier(scope.row)+'&nu='+scope.row.trackingNo">{{
                  scope.row.trackingNo
                }}
              </a>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" v-if="columns[4].visible"/>
        </WmsTable>
      </div>
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

        <el-col :span="1.5">
          <el-button size="small" icon="el-icon-check" type="warning" plain="plain" @click="dialogFormVisible = true">
            分配仓库/库区
          </el-button>
        </el-col>

      </el-row>

      <el-dialog title="请选择出库状态" :visible.sync="open" width="50%" append-to-body="append-to-body">
        <DictRadio v-model="dialogStatus" :radioData="dialogStatusRange"></DictRadio>
        <div class="dialog-footer" slot="footer">
          <el-button type="primary" @click="dialogConfirm">确 定</el-button>
          <el-button @click="cancelDialog">取 消</el-button>
        </div>
      </el-dialog>
      <div class="table">
        <el-form ref="form" :model="form" :show-message="false">
          <WmsTable :data="form.details" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"
                             :selectable="(row)=>!row.finish"></el-table-column>
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
            <el-table-column label="出库状态" width="150">
              <template slot-scope="{ row }">
                <DictSelect v-model="row.shipmentOrderStatus" :options="row.range" size="small"
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
      <!-- 添加或修改发货记录对话框 -->
      <el-dialog :title="deliveryTitle" :visible.sync="deliveryOpen" width="50%" append-to-body>
        <el-form ref="deliveryForm" :model="deliveryForm" :rules="rules" label-width="108px" inline
                 class="dialog-form-two">
          <el-form-item label="出库单" prop="shipmentOrderId">
            <el-input v-model="deliveryForm.shipmentOrderId" disabled placeholder="请输入出库单"/>
          </el-form-item>
          <el-form-item label="承运商" prop="carrierId">
            <wms-carrier-select v-model="deliveryForm.carrierId"></wms-carrier-select>
          </el-form-item>
          <el-form-item label="发货日期" prop="deliveryDate">
            <el-date-picker clearable size="small"
                            v-model="deliveryForm.deliveryDate"
                            type="datetime"
                            value-format="yyyy-MM-ddTHH:mm:ss"
                            placeholder="选择发货日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="快递单号" prop="trackingNo">
            <el-input v-model="deliveryForm.trackingNo" placeholder="请输入快递单号"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="deliveryForm.remark" placeholder="请输入备注"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitdeliveryForm">确 定</el-button>
          <el-button @click="canceldeliveryForm">取 消</el-button>
        </div>
      </el-dialog>
      <BatchWarehouseDialog
        :visible.sync="batchDialogVisible"
        :form-data.sync="batchForm"
        @confirmed="onBatchDialogFinished"
      ></BatchWarehouseDialog>
      <el-dialog title="自动分配仓库/库区" :visible.sync="dialogFormVisible" width="400px">
        <el-form :model="dialogForm">
          <el-form-item label="分配策略" label-width="98px">
            <el-select v-model="dialogForm.region" placeholder="请选择分配策略">
              <el-option label="库存量小的库位优先" :value="1"></el-option>
              <el-option label="库存量大的库位优先" :value="2"></el-option>
              <el-option label="先入先出(FIFO)" :value="3" disabled></el-option>
              <el-option label="先过期先出" :value="4" disabled></el-option>
              <el-option label="适量库存优先" :value="5" disabled></el-option>
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
import {addOrUpdateWmsShipmentOrder, allocatedInventory, getWmsShipmentOrder} from '@/api/wms/shipmentOrder'
import ItemSelect from '@/views/components/ItemSelect'
import {mapGetters} from 'vuex'
import WmsCarrier from "@/views/wms/carrier/index.vue";
import {addWmsDelivery, updateWmsDelivery} from "@/api/wms/delivery";
import BatchWarehouseDialog from "@/views/components/wms/BatchWarehouseDialog/index.vue";
import {ShipmentOrderConstant} from "@/constant/ShipmentOrderConstant.ts";

export default {
  name: 'WmsShipmentOrder',
  components: {BatchWarehouseDialog, WmsCarrier, ItemSelect},
  dicts: ['wms_shipment_type', 'wms_shipment_status'],
  computed: {
    ShipmentOrderConstant() {
      return ShipmentOrderConstant
    },
    ...mapGetters(['customerMap', 'carrierMap']),
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
      // 分配仓库
      dialogFormVisible: false,
      dialogForm: {
        date1: '',
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
      shipmentOrderId: null,
      deliveryOpen: false,
      deliveryForm: {},
      // 发货记录表格数据
      wmsDeliveryList: [],
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
    const {id} = this.$route.query
    if (id) {
      this.shipmentOrderId = id
      this.loadDetail(id)
    } else {
      this.cancel()
    }
  },
  methods: {
    /** 自动分配 仓库/库区 */
    allocated() {
      allocatedInventory({id:this.shipmentOrderId,type:this.dialogForm.region}).then(response => {
        this.$modal.msgSuccess("分配成功");
        this.dialogFormVisible = false;
        this.loadDetail(this.shipmentOrderId)
      });
    },
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
    // 格式化承运商
    getCarrier(row, column) {
      return this.carrierMap.get(row.carrierId)
    },
    // 新增物流对话框，提交按钮
    submitdeliveryForm() {
      this.$refs["deliveryForm"].validate(valid => {
        if (valid) {
          if (this.deliveryForm.id != null) {
            updateWmsDelivery(this.deliveryForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.deliveryOpen = false;
              this.loadDetail(this.shipmentOrderId)
            });
          } else {
            addWmsDelivery(this.deliveryForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.deliveryOpen = false;
              this.loadDetail(this.shipmentOrderId)
            });
          }
        }
      });
    },// 新增物流对话框，取消按钮
    canceldeliveryForm() {
      this.deliveryOpen = false
    },
    // 新增物流信息
    deliveryAdd() {
      this.deliveryTitle = "新增物流信息"
      this.deliveryOpen = true
      this.deliveryForm.shipmentOrderId = this.shipmentOrderId
    },
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
      this.$tab.closeOpenPage({path: '/wms/shipmentOrder'})
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
        const req = {...this.form, details}
        addOrUpdateWmsShipmentOrder(req).then(response => {
          if (response.code == 398) {
            return
          }
          this.$modal.msgSuccess(this.form.id ? '修改成功' : '新增成功')
          this.cancel()
        })
      })
    },
    loadDetail(id) {
      this.loading = true
      getWmsShipmentOrder(id).then(response => {
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
          it.range = this.getRange(it.shipmentOrderStatus)
          it.finish = it.shipmentOrderStatus === 13
        })
        this.sourceDetails = details.map(it => ({...it}))
        this.finish = details.filter(it => !it.finish)?.length === 0
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
