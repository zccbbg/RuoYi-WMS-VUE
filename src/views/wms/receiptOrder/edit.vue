<template>
  <div class="receipt-order-edit-wrapper app-container">
    <div class="receipt-order-content">
      <el-form label-width="108px" :model="form" ref="form" :rules="rules">
        <el-form-item label="入库单号" prop="receiptOrderNo">
          <el-input class="w200" v-model="form.receiptOrderNo" placeholder="入库单号" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="入库类型" prop="receiptOrderType">
          <el-radio-group v-model="form.receiptOrderType">
            <el-radio-button v-for="dict in dict.type.wms_receipt_type" :key="dict.value" :label="dict.value">{{
                dict.label
              }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <WmsSupplierSelect v-model="form.supplierId"></WmsSupplierSelect>
        </el-form-item>
        <el-form-item label="金额" prop="payableAmount" v-show="hasSupplier">
          <el-input-number v-model="form.payableAmount" :precision="2" :min="0" label="请输入金额"></el-input-number>
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
        <div class="flex-one large-tip bolder-font">物料明细</div>
        <div class="ops">
          <el-button type="primary" plain="plain" size="small" @click="showAddItem">添加物料</el-button>
        </div>
      </div>
      <div class="table">
        <table class="common-table">
          <tr>
            <th>物料名</th>
            <th>物料编号</th>
            <th>物料类型</th>
            <th>计划数量</th>
            <th>仓库/库区
              <el-button type="text" size="small"  icon="el-icon-files" @click="onBatchSetInventory">批量</el-button>
            </th>
            <th>金额</th>
            <th>操作</th>
          </tr>
          <tr v-for="(it, index) in form.details">
            <td align="center">{{ it.prod.itemName }}</td>
            <td align="center">{{ it.prod.itemNo }}</td>
            <td align="center">{{ it.prod.itemType }}</td>
            <td align="center">
              <el-input-number v-model="it.planQuantity" placeholder="计划数量" :min="1"
                               :max="2147483647"></el-input-number>
            </td>
            <td align="center">
              <WmsWarehouseCascader v-model="it.place" size="small"></WmsWarehouseCascader>

            </td>
            <td align="center">
              <el-input-number v-model="it.money" :precision="2" @change="selectMoney" size="mini" :min="0"
                               label="请输入金额"></el-input-number>
            </td>
            <td align="center"><a class="red" @click="form.details.splice(index, 1)">删除</a></td>
          </tr>
        </table>
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
import {addOrUpdateWmsReceiptOrder, getWmsReceiptOrder} from '@/api/wms/receiptOrder'
import {randomId} from '@/utils/RandomUtils'
import ItemSelect from '@/views/components/ItemSelect'
import BatchWarehouseDialog from "@/views/components/wms/BatchWarehouseDialog/index.vue";

export default {
  name: 'WmsReceiptOrder',
  components: {BatchWarehouseDialog, ItemSelect},
  dicts: ['wms_receipt_type'],
  data() {
    return {
      // 批量设置仓库/库区
      batchDialogVisible: false,
      batchForm: {
        place: []
      },
      // 表单参数
      form: {
        details: [],
        payableAmount: 0.00,
        supplierId: null
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
    'form.supplierId': {
      immediate: true,
      handler(value) {
        if (value) {
          this.hasSupplier = true
        } else {
          this.hasSupplier = false
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
    /** 批量设置仓库/库区 */
    onBatchSetInventory() {
      const {details} = this.form
      if (!details || details.length === 0) {
        this.$modal.msgError('请先添加物料')
        return
      }
      this.batchDialogVisible = true
    },
    onBatchDialogFinished() {
      this.batchDialogVisible = false
      const [warehouseId, areaId, rackId] = this.batchForm.place || []
      this.form.details.forEach(it => {
        it.place = [warehouseId, areaId, rackId].filter(Boolean)
      })
    },
    /** 统计入库单金额 */
    selectMoney() {
      let sum = 0;
      this.form.details.map(item => {
        if (!isNaN(parseFloat(item.money))) {
          sum += item.money
        }
        return item.money
      })
      this.form.payableAmount = sum
    },
    cancel() {
      this.$tab.closeOpenPage({path: '/wms/receiptOrder'})
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
      const value = this.$refs['item-select'].getRightList()
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
.receipt-order-edit-wrapper
  .receipt-order-content
    width 70%
    min-width 900px
    margin 0 auto
</style>
