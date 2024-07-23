<template>
  <div v-show="show">
    <el-form class="ry_form" v-show="showSearch" :inline="true" label-width="100px" :model="queryParams" ref="queryForm"
             size="medium">
      <el-form-item label="入库状态" prop="receiptOrderStatus">
        <DictRadio v-model="queryParams.receiptOrderStatus" :radioData="dict.type.wms_receipt_status" :showAll="'all'"
                   size="small" @change="handleQuery"></DictRadio>
      </el-form-item>
      <el-form-item label="入库类型" prop="receiptOrderType">
        <DictRadio v-model="queryParams.receiptOrderType" :radioData="dict.type.wms_receipt_type" :showAll="'all'"
                   size="small" @change="handleQuery"></DictRadio>
      </el-form-item>
      <el-form-item label="入库单号" prop="receiptOrderNo">
        <el-input v-model.trim="queryParams.receiptOrderNo" clearable="clearable" placeholder="请输入入库单号"
                  size="small"
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model.trim="queryParams.orderNo" clearable="clearable" placeholder="请输入订单号" size="small"
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <WmsSupplierSelect v-model="queryParams.supplierId" size="small"></WmsSupplierSelect>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb8" :gutter="10">
      <el-col :span="1.5">
        <el-button v-hasPermi="['wms:receiptOrder:add']" icon="el-icon-plus" plain="plain" size="mini" type="primary"
                   @click="handleAdd()">创建入库单
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-check" size="mini" type="warning" :disabled="!waveAble"
                   @click="handleWave()">批量入库
        </el-button>
      </el-col>
      <right-toolbar :columns="columns" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <WmsTable v-loading="loading" :data="wmsReceiptOrderList" @selection-change="handleSelectionChange">
      <el-table-column align="top" type="selection" width="55"></el-table-column>
      <el-table-column v-if="columns[0].visible" header-align="center" label="入库单号"
                       prop="receiptOrderNo"></el-table-column>
      <el-table-column v-if="columns[1].visible" header-align="center" align="center" label="入库类型">
        <template slot-scope="scope">
          <el-tag effect="plain" size="medium" :type="getReceiptOrderTypeTag(scope.row)">{{
              getReceiptOrderType(scope.row)
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[2].visible" header-align="center" :formatter="getSupplier"
                       label="供应商"></el-table-column>
      <el-table-column v-if="columns[3].visible" header-align="center" label="订单号" prop="orderNo"></el-table-column>
      <el-table-column v-if="columns[4].visible" header-align="center" align="center" label="入库状态">
        <template slot-scope="scope">
          <el-tag effect="plain" size="medium" :type="getReceiptOrderStatusTag(scope.row)">{{
              getReceiptOrderStatus(scope.row)
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[5].visible" header-align="center" label="批次号" prop="waveNo"></el-table-column>
      <el-table-column v-if="columns[6].visible" header-align="center" label="备注" prop="remark">
        <template v-slot="{ row }">
          <el-popover placement="left" width="300" trigger="hover" :content="row.remark" popper-class="popperOptions">
            <p class="showOverTooltip" slot="reference">{{ row.remark }}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="right" class-name="small-padding fixed-width" label="操作" fixed="right" width="240">
        <template v-slot="{ row }">
          <el-button v-hasPermi="['wms:receiptOrder:edit']"
                     :disabled="!(ReceiptOrderConstant.Status.NOT_IN === row.receiptOrderStatus && !row.waveNo)" icon="el-icon-edit"
                     size="mini" type="text" @click.stop="handleUpdate(row)">修改
          </el-button>
          <el-button v-hasPermi="['wms:receiptOrder:remove']" icon="el-icon-delete" :disabled="row.waveNo"
                     size="mini" type="text" @click.stop="handleDelete(row)">删除
          </el-button>
          <el-button v-hasPermi="['wms:receiptOrder:status']" :disabled="!(row.detailCount && !row.waveNo)" icon="el-icon-truck" size="mini"
                     type="text" @click.stop="handleStatus(row)">发货/入库
          </el-button>
          <el-button icon="el-icon-print" size="mini" type="text" @click.stop="printOut(row, true)">打印</el-button>
        </template>
      </el-table-column>
    </WmsTable>
    <pagination v-show="total > 0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum" :total="total"
                @pagination=" getList "></pagination>
    <el-dialog :visible.sync=" modalObj.show " :title=" modalObj.title " :width=" modalObj.width ">
      <template v-if=" modalObj.component === 'print-type' ">
        <el-radio-group v-model=" modalObj.form.value ">
          <el-radio :label=" 1 ">lodop打印</el-radio>
          <el-radio :label=" 2 ">浏览器打印</el-radio>
        </el-radio-group>
      </template>
      <template v-if=" modalObj.form.value === 2 || modalObj.component === 'window-print-preview' ">
        <receipt-order-print :row=" modalObj.form.row " ref="receiptOrderPrintRef"></receipt-order-print>
      </template>
      <template slot="footer" class="dialog-footer">
        <el-button @click=" modalObj.cancel ">取消</el-button>
        <el-button @click=" modalObj.ok " type="primary">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listWmsReceiptOrder,
  delWmsReceiptOrder,
  exportWmsReceiptOrder,
  getWmsReceiptOrder
} from '@/api/wms/receiptOrder'
import {mapGetters} from 'vuex'
import {STOCK_IN_TEMPLATE} from '@/utils/printData'
import ReceiptOrderPrint from '@/views/wms/receiptOrder/ReceiptOrderPrint'
import {ReceiptOrderConstant} from "@/constant/ReceiptOrderConstant.ts";
import { isStarRepo } from '@/utils/is-star-plugin'
import { addWaveForReceipt } from '@/api/wms/wave'

export default {
  name: 'WmsReceiptOrder',
  components: {ReceiptOrderPrint},
  dicts: ['wms_receipt_type', 'wms_receipt_status'],
  computed: {
    ReceiptOrderConstant() {
      return ReceiptOrderConstant
    },
    ...mapGetters(['supplierMap', 'warehouseMap', 'areaMap', 'rackMap','userId']),
    receiptTypeMap() {
      let obj = this.dict.type.wms_receipt_type.map(item => [item.value, item.label])
      let map = new Map(obj)
      return map
    },
    receiptStatusMap() {
      let obj = this.dict.type.wms_receipt_status.map(item => [item.value, item.label])
      let map = new Map(obj)
      return map
    }
  },
  data() {
    return {
      waveAble: false,
      modalObj: {
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
      // 显示搜索条件
      showSearch: true,
      show: false,
      // 总条数
      total: 0,
      // 入库单表格数据
      wmsReceiptOrderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receiptOrderNo: null,
        receiptOrderType: null,
        supplierId: null,
        orderNo: null,
        receiptOrderStatus: null
      },
      // 表单校验
      rules: {},
      columns: [
        {key: 1, label: '入库单号', visible: true},
        {key: 2, label: '入库类型', visible: true},
        {key: 3, label: '供应商', visible: true},
        {key: 4, label: '订单号', visible: true},
        {key: 5, label: '入库状态', visible: true},
        {key: 6, label: '批次号', visible: true},
        {key: 7, label: '备注', visible: true}
      ]
    }
  },
  async created() {
    const res = await isStarRepo('zccbbg','wms-ruoyi',this.userId,'http://wms.ichengle.top/wms/receiptOrder','Wms-Ruoyi-仓库库存管理','https://gitee.com/zccbbg/wms-ruoyi')
    this.show = res;
    if (res) {
      this.getList()
    }
  },
  methods: {
    handleWave() {
      addWaveForReceipt({ids:this.ids}).then(res => {
        this.$emit('switchTab',{} )
        this.getList()
      })
    },
    getReceiptOrderTypeTag(row) {
      switch (row.receiptOrderType) {
        case 1:
          return 'success'
        case 2:
          return 'warning'
        case 3:
          return 'danger'
      }
    },
    getReceiptOrderStatusTag(row) {
      switch (row.receiptOrderStatus) {
        case 0:
          return 'info'
        case 1:
          return 'warning'
        case 2:
          return 'danger'
        case 3:
          return 'success'
      }
    },
    getReceiptOrderType(row) {
      return this.receiptTypeMap.get(row.receiptOrderType + '')
    },
    getReceiptOrderStatus(row) {
      return this.receiptStatusMap.get(row.receiptOrderStatus + '')
    },
    getSupplier(row, column) {
      return this.supplierMap.get(row.supplierId)
    },
    /** 查询入库单列表 */
    getList() {
      this.loading = true
      const {pageNum, pageSize} = this.queryParams
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined}
      const pageReq = {page: pageNum - 1, size: pageSize}
      listWmsReceiptOrder(query, pageReq).then(response => {
        const {content, totalElements} = response
        this.wmsReceiptOrderList = content
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
      this.multiple = !selection.length
      this.waveAble = selection.length > 1
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({path: '/wms/receiptOrder/edit'})
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      this.$router.push({path: '/wms/receiptOrder/edit', query: {id}})
    },
    handleStatus(row) {
      const id = row.id || this.ids
      this.$router.push({path: '/wms/receiptOrder/status', query: {id}})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      const receiptOrderNo = row.receiptOrderNo
      this.$modal.confirm('是否确认删除入库单编号为"' + receiptOrderNo + '"的数据项？').then(function () {
        return delWmsReceiptOrder(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$modal.confirm('是否确认导出所有入库单数据项？').then(() => {
        this.exportLoading = true
        return exportWmsReceiptOrder(queryParams)
      }).then(response => {
        this.$download.download(response)
        this.exportLoading = false
      }).catch(() => {
      })
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
    windowPrintOut(row, print) {
      this.getOrderDetail(row).then(res => {
        console.log(res)
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
    doPrintOut(row, print) {
      this.getOrderDetail(row).then(result => {
        if (print) {
          this.$lodop.print(STOCK_IN_TEMPLATE, [result])
        } else {
          this.$lodop.preview(STOCK_IN_TEMPLATE, [result])
        }
      })
    },
    getOrderDetail(row) {
      //查询详情
      return getWmsReceiptOrder(row.id).then(response => {
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
          receiptOrderNo: row.receiptOrderNo,
          supplierName: this.supplierMap.get(row.supplierId),
          orderNo: row.orderNo,
          receiptType: this.receiptTypeMap.get(row.receiptOrderType + ''),
          createTime: row.createTime,
          details: detailList,
          totalCount
        }
      })
    }
  }
}
</script>
<style lang="stylus">
//.el-table__row .el-table__cell {
//  vertical-align: top
//}
.showOverTooltip {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  /*这里是3行*/
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

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
