<template>
  <div class="">
    <el-form class="ry_form" v-show="showSearch" :inline="true" label-width="100px" :model="queryParams" ref="queryForm"
             size="medium">
      <el-form-item label="出库状态" prop="shipmentOrderStatus">
        <DictRadio v-model="queryParams.shipmentOrderStatus" :radioData="dict.type.wms_shipment_status" :showAll="'all'"
                   size="small" @change="handleQuery"></DictRadio>
      </el-form-item>
      <el-form-item label="出库类型" prop="shipmentOrderType">
        <DictRadio v-model="queryParams.shipmentOrderType" :radioData="dict.type.wms_shipment_type" :showAll="'all'"
                   size="small" @change="handleQuery"></DictRadio>
      </el-form-item>
      <el-form-item label="出库单号" prop="shipmentOrderNo">
        <el-input v-model="queryParams.shipmentOrderNo" clearable="clearable" placeholder="请输入出库单号" size="small"
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" clearable="clearable" placeholder="请输入订单号" size="small"
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="客户" prop="customerId">
        <WmsCustomerSelect v-model="queryParams.customerId" size="small"></WmsCustomerSelect>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb8" :gutter="10">
      <el-col :span="1.5">
        <el-button v-hasPermi="['wms:shipmentOrder:add']" icon="el-icon-plus" plain="plain" size="mini" type="primary"
                   @click="handleAdd()">创建出库单
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-check" size="mini" type="warning" :disabled="!waveAble"
                   @click="handleWave()">波次作业
        </el-button>
      </el-col>
      <right-toolbar :columns="columns" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <WmsTable v-loading="loading" :data="wmsShipmentOrderList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column v-if="columns[0].visible" align="center" label="出库单号" min-width="150"
                       prop="shipmentOrderNo"></el-table-column>
      <el-table-column v-if="columns[1].visible" align="center" label="出库类型">
        <template slot-scope="scope">
          <el-tag effect="plain" size="medium" :type="getShipmentOrderTypeTag(scope.row)">
            {{ getShipmentOrderType(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[2].visible" align="center" :formatter="getCustomer" label="客户"></el-table-column>
      <el-table-column v-if="columns[3].visible" align="center" label="订单号" prop="orderNo"></el-table-column>
      <el-table-column v-if="columns[4].visible" align="center" label="出库状态">
        <template slot-scope="scope">
          <el-tag effect="plain" size="medium" :type="getShipmentOrderStatusTag(scope.row)">
            {{ getShipmentOrderStatus(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[5].visible" align="center" label="波次号" prop="waveNo" min-width="100"></el-table-column>
      <el-table-column v-if="columns[5].visible" align="center" label="备注" prop="remark">
        <template v-slot="{ row }">
          <el-popover placement="left" width="300" trigger="hover" :content="row.remark" popper-class="popperOptions">
            <p class="showOverTooltip" slot="reference">{{ row.remark }}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="right" class-name="small-padding fixed-width" label="操作" width="220">
        <template v-slot="{ row }">
          <el-button v-hasPermi="['wms:shipmentOrder:edit']"
                     :disabled="!(ShipmentOrderConstant.Status.NOT_IN === row.shipmentOrderStatus && !row.waveNo)" icon="el-icon-edit"
                     size="mini" type="text" @click.stop="handleUpdate(row)">修改
          </el-button>
          <el-button v-hasPermi="['wms:shipmentOrder:remove']" icon="el-icon-delete" size="mini" type="text"
                     :disabled="!(!row.waveNo && row.shipmentOrderStatus !== ShipmentOrderConstant.Status.ALL_IN)" @click.stop="handleDelete(row)">删除
          </el-button>
          <el-button v-hasPermi="['wms:shipmentOrder:status']" :disabled="!(row.detailCount && !row.waveNo && row.shipmentOrderStatus !== ShipmentOrderConstant.Status.ALL_IN)" icon="el-icon-truck" size="mini"
                     type="text" @click.stop="handleStatus(row)">发货/出库
          </el-button>
          <el-button icon="el-icon-print" size="mini" type="text" @click.stop="printOut(row,true)">打印</el-button>
        </template>
      </el-table-column>
    </WmsTable>
    <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total"
                @pagination="getList"></pagination>
    <el-dialog :visible.sync="modalObj.show" :title="modalObj.title" :width="modalObj.width">
      <template v-if="modalObj.component === 'print-type'">
        <el-radio-group v-model="modalObj.form.value">
          <el-radio :label="1">lodop打印</el-radio>
          <el-radio :label="2">浏览器打印</el-radio>
        </el-radio-group>
      </template>
      <template v-if="modalObj.form.value === 2 || modalObj.component === 'window-print-preview'">
        <shipment-order-print :row="modalObj.form.row" ref="receiptOrderPrintRef"></shipment-order-print>
      </template>
      <template slot="footer" class="dialog-footer">
        <el-button @click="modalObj.cancel">取消</el-button>
        <el-button @click="modalObj.ok" type="primary">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listWmsShipmentOrder,
  delWmsShipmentOrder,
  exportWmsShipmentOrder,
  getWmsShipmentOrder
} from '@/api/wms/shipmentOrder'
import {mapGetters} from 'vuex'
import {STOCK_OUT_TEMPLATE} from '@/utils/printData'
import ShipmentOrderPrint from '@/views/wms/shipmentOrder/ShipmentOrderPrint'
import {ShipmentOrderConstant} from '@/constant/ShipmentOrderConstant.ts'
import {addWave} from "@/api/wms/wave";

export default {
  name: 'wmsShipmentOrder',
  components: {ShipmentOrderPrint},
  dicts: ['wms_shipment_type', 'wms_shipment_status'],
  computed: {
    ShipmentOrderConstant() {
      return ShipmentOrderConstant
    },
    ...mapGetters(['customerMap', 'warehouseMap', 'areaMap', 'rackMap']),
    shipmentTypeMap() {
      let obj = this.dict.type.wms_shipment_type.map(item => [item.value, item.label])
      let map = new Map(obj)
      return map
    },
    shipmentStatusMap() {
      let obj = this.dict.type.wms_shipment_status.map(item => [item.value, item.label])
      let map = new Map(obj)
      return map
    }
  },
  data() {
    return {
      modalObj: {
        show: false,
        title: '选择打印方式',
        width: '520px',
        component: null,
        form: {
          value: null,
          row: null
        },
        ok: () => {
        },
        cancel: () => {
        }
      },
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 是否显示波次作业按钮
      waveAble: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 出库单表格数据
      wmsShipmentOrderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shipmentOrderNo: null,
        shipmentOrderType: null,
        customerId: null,
        orderNo: null,
        shipmentOrderStatus: null
      },
      // 表单校验
      rules: {},
      columns: [
        {key: 1, label: '出库单号', visible: true},
        {key: 2, label: '出库类型', visible: true},
        {key: 3, label: '供应商', visible: true},
        {key: 4, label: '订单号', visible: true},
        {key: 5, label: '出库状态', visible: true},
        {key: 6, label: '备注', visible: true}
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleWave() {
      addWave({ids:this.ids}).then(res => {
        this.$emit('switchTab',{} )
        this.getList()
      })
    },
    getShipmentOrderTypeTag(row) {
      switch (row.shipmentOrderType) {
        case ShipmentOrderConstant.Type.SALE:
          return 'success'
        case ShipmentOrderConstant.Type.OUTSOURCING:
          return 'warning'
        case ShipmentOrderConstant.Type.TRANSFER:
          return 'danger'
      }
    },
    getShipmentOrderStatusTag(row) {
      switch (row.shipmentOrderStatus) {
        case ShipmentOrderConstant.Status.NOT_IN:
          return 'info'
        case ShipmentOrderConstant.Status.PART_IN:
          return 'warning'
        case ShipmentOrderConstant.Status.DROP:
          return 'danger'
        case ShipmentOrderConstant.Status.ALL_IN:
          return 'success'
      }
    },
    getShipmentOrderType(row) {
      return this.shipmentTypeMap.get(row.shipmentOrderType + '')
    },
    getShipmentOrderStatus(row) {
      return this.shipmentStatusMap.get(row.shipmentOrderStatus + '')
    },
    getCustomer(row, column) {
      return this.customerMap.get(row.customerId)
    },
    /** 查询出库单列表 */
    getList() {
      this.loading = true
      const {pageNum, pageSize} = this.queryParams
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined}
      const pageReq = {page: pageNum - 1, size: pageSize}
      listWmsShipmentOrder(query, pageReq).then(response => {
        const {content, totalElements} = response
        this.wmsShipmentOrderList = content
        this.total = totalElements
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.waveAble = selection.length > 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({path: '/wms/shipmentOrder/edit'})
    },
    printOut(row, print) {
      this.modalObj = {
        show: true,
        title: '选择打印方式',
        width: '520px',
        component: 'print-type',
        form: {
          value: 1,
          row
        },
        ok: () => {
          this.modalObj.show = false
          if (this.modalObj.form.value === 1) {
            this.doPrintOut(row, false)
          } else {
            this.windowPrintOut(row, print)
          }
        },
        cancel: () => {
          this.modalObj.show = false
        }
      }
    },
    doPrintOut(row, print) {
      this.getDetail(row).then(result => {
        if (print) {
          this.$lodop.print(STOCK_OUT_TEMPLATE, [result])
        } else {
          this.$lodop.preview(STOCK_OUT_TEMPLATE, [result])
        }
      })
    },
    windowPrintOut(row, print) {
      this.getDetail(row).then(res => {
        if (print) {
          this.modalObj.form.row = res
          this.$nextTick(() => {
            this.$refs['receiptOrderPrintRef'].start()
          })
          return
        }
        this.$nextTick(() => {
          this.modalObj = {
            show: true,
            title: '浏览器打印预览',
            width: '800px',
            component: 'window-print-preview',
            form: {
              value: 1,
              row,
              print
            },
            ok: () => {
              this.modalObj.show = false
            },
            cancel: () => {
              this.modalObj.show = false
            }
          }
        })
      })
    },
    getDetail(row) {
      //查询详情
      return getWmsShipmentOrder(row.id).then(response => {
        const {details, items} = response
        const map = {};
        (items || []).forEach(it => {
          map[it.id] = it
        })
        let detailList = [], totalCount = 0
        details && details.forEach(it => {
          const prod = map[it.itemId]
          totalCount += it.planQuantity
          let place = this.warehouseMap.get(it.warehouseId)
          if (it.areaId) {
            place += `/${this.areaMap.get(it.areaId)}`
          }
          if (it.rackId) {
            place += `/${this.rackMap.get(it.rackId)}`
          }
          detailList.push({
            itemName: prod.itemName,
            itemNo: prod.itemNo,
            itemType: prod.itemType,
            planQuantity: it.planQuantity,
            place
          })
        })
        return {
          remark: row.remark,
          shipmentOrderNo: row.shipmentOrderNo,
          customerName: this.customerMap.get(row.customerId),
          orderNo: row.orderNo,
          shipmentType: this.shipmentTypeMap.get(row.shipmentOrderType + ''),
          createTime: row.createTime,
          details: detailList,
          totalCount
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      this.$router.push({path: '/wms/shipmentOrder/edit', query: {id}})
    },
    handleStatus(row) {
      const id = row.id || this.ids
      this.$router.push({path: '/wms/shipmentOrder/status', query: {id}})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      const shipmentOrderNo = row.shipmentOrderNo
      this.$modal.confirm('是否确认删除出库单编号为"' + shipmentOrderNo + '"的数据项？').then(function () {
        return delWmsShipmentOrder(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$modal.confirm('是否确认导出所有出库单数据项？').then(() => {
        this.exportLoading = true
        return exportWmsShipmentOrder(queryParams)
      }).then(response => {
        this.$download.download(response)
        this.exportLoading = false
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="stylus">
.popperOptions[x-placement^=left] .popper__arrow::after {
  border-left-color: #565D6B;
}

.popperOptions[x-placement^=right] .popper__arrow::after {
  border-right-color: #565D6B;
}

.popperOptions[x-placement^=bottom] .popper__arrow::after {
  border-bottom-color: #565D6B;
}

.popperOptions[x-placement^=top] .popper__arrow::after {
  border-top-color: #565D6B;
}

.popperOptions {
  background-color: #565D6B;
  color: #FFFFFF;
  border: #565D6B;
}
</style>
