<template>
  <div class="shipment-order-edit-wrapper app-container">
    <div class="shipment-order-content">
      <el-form label-width="108px" :model="form" ref="form" :rules="rules">
        <el-form-item label="出库单号" prop="shipmentOrderNo">
          <el-input class="w200" v-model="form.shipmentOrderNo" placeholder="出库单号" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="出库类型" prop="shipmentOrderType">
          <el-radio-group v-model="form.shipmentOrderType">
            <el-radio-button v-for="dict in dict.type.wms_shipment_type" :key="dict.value"
                             :label="dict.value">{{ dict.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="顾客" prop="customerId">
          <WmsCustomerSelect v-model="form.customerId"></WmsCustomerSelect>
        </el-form-item>
        <el-form-item label="金额" prop="receivableAmount" v-show="hasCustomer">
          <el-input-number v-model="form.receivableAmount" :precision="2" :min="0" label="请输入金额"></el-input-number>
        </el-form-item>
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="备注...100个字符以内" rows="3" maxlength="100" type="textarea"
                    show-word-limit="show-word-limit"></el-input>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="flex-center mb8">
        <div class="flex-one large-tip bolder-font">
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
          </el-row>
        </div>
        <div class="ops">
          <el-button type="primary" plain="plain" size="small" @click="showAddItem">添加物料</el-button>
        </div>
      </div>
      <div class="table">
        <WmsTable :data="form.details" @selection-change="handleSelectionChange"> 、
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="物料名" align="center" prop="prod.itemName"></el-table-column>
          <el-table-column label="物料编号" align="center" prop="prod.itemNo"></el-table-column>
          <el-table-column label="物料类型" align="center" prop="prod.itemType"></el-table-column>
          <el-table-column label="计划数量" align="center" prop="planQuantity" width="150">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.planQuantity" placeholder="计划数量" size="mini" :min="1"
                               :max="2147483647"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="仓库/库区" align="center">
            <template slot-scope="scope">
              <WmsWarehouseCascader v-model="scope.row.place" size="small"></WmsWarehouseCascader>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="center" width="150">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.money" :precision="2" @change="selectMoney" size="mini" :min="0"
                               label="请输入金额"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <a class="red" @click="form.details.splice(scope.$index, 1)">删除</a>
            </template>
          </el-table-column>
        </WmsTable>
        <!-- <el-empty v-if="!form.details || form.details.length === 0" :image-size="48"></el-empty> -->
      </div>
      <div class="tc mt16">
        <el-button type="primary" plain="plain" size="small" @click="showAddItem">添加物料</el-button>
      </div>
      <div class="tc mt16">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="submitForm" type="primary">保存</el-button>
      </div>
    </div>
    <el-dialog :visible="modalObj.show" :title="modalObj.title" :width="modalObj.width" @close="modalObj.cancel">
      <template v-if="modalObj.component === 'add-item'">
        <item-select ref="item-select" :data="this.form.details"></item-select>
      </template>
      <span slot="footer">
        <el-button v-if="modalObj.cancel" @click="modalObj.cancel">取消</el-button>
        <el-button v-if="modalObj.ok" type="primary" @click="modalObj.ok">确认</el-button>
      </span>
    </el-dialog>
    <BatchWarehouseDialog
      :visible.sync="batchDialogVisible"
      :form-data.sync="batchForm"
      @confirmed="onBatchDialogFinished"
    ></BatchWarehouseDialog>
  </div>
</template>

<script>
import {addOrUpdateWmsShipmentOrder, getWmsShipmentOrder} from '@/api/wms/shipmentOrder'
import {randomId} from '@/utils/RandomUtils'
import ItemSelect from '@/views/components/ItemSelect'
import BatchWarehouseDialog from "@/views/components/wms/BatchWarehouseDialog/index.vue";

export default {
  name: 'WmsShipmentOrder',
  components: {BatchWarehouseDialog, ItemSelect},
  dicts: ['wms_shipment_type'],
  data() {
    return {
      ids: [],
      // 非多个禁用
      multiple: true,
      // 批量设置仓库/库区
      batchDialogVisible: false,
      batchForm: {
        place: []
      },
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
      },
      hasSupplier: false
    }
  },
  watch: {
    'form.customerId': {
      immediate: true,
      handler(value) {
        if (value) {
          this.hasCustomer = true
        } else {
          this.hasCustomer = false
        }
      }
    }
  },
  created() {
    const {id} = this.$route.query
    if (id) {
      this.loadDetail(id)
    } else {
      this.reset()
    }
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
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
    /** 统计出库单金额 */
    selectMoney() {
      let sum = 0;
      this.form.details.map(item => {
        if (!isNaN(parseFloat(item.money))) {
          sum += item.money
        }
        return item.money
      })
      this.form.receivableAmount = sum
    },
    cancel() {
      this.$tab.closeOpenPage({path: '/wms/shipmentOrder'})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        const details = this.form.details.map(it => {
          console.log(it.place)
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
            itemId: it.prod.id,
            rackId: it.prod.rackId,
            areaId: it.prod.areaId,
            money: it.money,
            warehouseId: it.prod.warehouseId,
            planQuantity: it.planQuantity,
            realQuantity: it.realQuantity,
            shipmentOrderStatus: it.shipmentOrderStatus,
            delFlag: 0
          }
        })
        const req = {...this.form, details}
        addOrUpdateWmsShipmentOrder(req).then(response => {
          this.$modal.msgSuccess(this.form.id ? '修改成功' : '新增成功')
          this.cancel();
        })
      })
    },
    loadDetail(id) {
      getWmsShipmentOrder(id).then(response => {
        const {details, items} = response
        const map = {};
        (items || []).forEach(it => {
          map[it.id] = it
        });
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
        shipmentOrderNo: 'E-' + randomId(),
        shipmentOrderType: 11,
        customerId: null,
        orderNo: null,
        shipmentOrderStatus: 11,
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
      const value = this.$refs['item-select'].getRightList()
      value.forEach(it => {
        if (!this.form.details?.length) {
          this.form.details.push({
            id: it.id,
            prod: it,
            planQuantity: null,
            realQuantity: null,
            place: [],
            shipmentOrderStatus: 11,
            delFlag: 0
          })
        } else if (!this.form.details.find(detail => detail.prod.id === it.id)) {
          this.form.details.push({
            id: it.id,
            prod: it,
            planQuantity: null,
            realQuantity: null,
            place: [],
            shipmentOrderStatus: 11,
            delFlag: 0
          })
        }
      })
      this.closeModal()
    },
    closeModal() {
      this.modalObj.show = false
    },
    showAddItem() {
      try {
        this.$refs['item-select'].initDetailsList(this.form.details)
      } catch (err) {

      }
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
.shipment-order-edit-wrapper
  .shipment-order-content
    width 70%
    min-width 900px
    margin 0 auto
</style>
