<template>
  <div class="app-container">
    <el-form class="ry_form" v-show="showSearch" :inline="true" label-width="100px" :model="queryParams" ref="queryForm"
             size="medium">
      <el-form-item label="类型" prop="panelType">
        <DictRadio v-model="queryParams.panelType" :radioData="dict.type.wms_inventory_panel_type" size="small"
                   @change="handleQuery"></DictRadio>
      </el-form-item>
      <el-form-item label="物料" prop="itemId">
        <item-select v-model="queryParams.itemId"></item-select>
      </el-form-item>
      <el-form-item label="仓库" prop="rackId">
        <wms-warehouse-cascader v-model="queryParams.place"></wms-warehouse-cascader>
      </el-form-item>
      <el-form-item label="库存" prop="quantity">
        <number-range v-model="queryParams.quantityRange"></number-range>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb8" :gutter="10">
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
                   @click="handleExport"
                   v-hasPermi="['wms:item:export']">导出
        </el-button>
      </el-col>
      <right-toolbar :columns="columns" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="wmsInventoryList" :span-method="objectSpanMethod" border
              @selection-change="handleSelectionChange">
      <el-table-column
        align="left"
        v-for="(col, index) in columns"
        :key="index"
        :label="col.label"
        :prop="col.prop"
      ></el-table-column>
    </el-table>
    <pagination v-show="total&gt;0" :limit.sync="pageReq.size" :page.sync="pageReq.page" :total="total"
                @pagination="getList"></pagination>

  </div>
</template>

<script>
import {
  listWmsInventory,
  exportWmsInventory
} from '@/api/wms/inventory'
import NumberRange from '@/components/NumberRange'
import ItemSelect from '@/components/ItemSelect'

export default {
  name: 'WmsInventory',
  components: {ItemSelect, NumberRange},
  dicts: ['wms_inventory_panel_type'],
  data() {
    return {
      mergeObj: {}, // 用来记录需要合并行的下标
      mergeArr: ['warehouseName'], // 表格中的列名
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
      // 总条数
      total: 0,
      // 库存表格数据
      wmsInventoryList: [],
      // 查询参数
      queryParams: {
        itemId: null,
        place: null,
        quantityRange: [],
        panelType: 5
      },
      pageReq: {
        page: 1,
        size: 10
      },
      // 表单参数
      form: {},
      columns: [],
      columnsNormal: [
        {
          label: '仓库/库区',
          prop: 'warehouseName',
          key: '1'
        },
        {
          label: '物料类型',
          prop: 'itemTypeName',
          key: '2'
        },
        {
          label: '物料编码',
          prop: 'itemNo',
          key: '3'
        },
        {
          label: '物料名称',
          prop: 'itemName',
          key: '4'
        },
        {
          label: '库存',
          prop: 'quantity',
          key: '5'
        }
      ],
      columnsType: [
        {
          label: '物料类型',
          prop: 'itemTypeName',
          key: '2'
        },
        {
          label: '物料编码',
          prop: 'itemNo',
          key: '3'
        },
        {
          label: '物料名称',
          prop: 'itemName',
          key: '4'
        },
        {
          label: '仓库/库区',
          prop: 'warehouseName',
          key: '1'
        },
        {
          label: '库存',
          prop: 'quantity',
          key: '5'
        }
      ],
      columnsArea: [
        {
          label: '仓库',
          prop: 'warehouseName',
          key: '1'
        },
        {
          label: '库区',
          prop: 'areaName',
          key: '1'
        },
        {
          label: '物料类型',
          prop: 'itemTypeName',
          key: '2'
        },
        {
          label: '物料编码',
          prop: 'itemNo',
          key: '3'
        },
        {
          label: '物料名称',
          prop: 'itemName',
          key: '4'
        },
        {
          label: '库存',
          prop: 'quantity',
          key: '5'
        }
      ],
      columnsByName: [
        {
          label: '物料名称',
          prop: 'itemName',
          key: '4'
        },
        {
          label: '物料类型',
          prop: 'itemTypeName',
          key: '2'
        },
        {
          label: '物料编码',
          prop: 'itemNo',
          key: '3'
        },
        {
          label: '仓库/库区',
          prop: 'warehouseName',
          key: '1'
        },
        {
          label: '库存',
          prop: 'quantity',
          key: '5'
        }
      ],
      panelType: 5
    }
  },
  created() {
    this.getList()

  },
  methods: {
    // objectSpanMethod方法
    // 默认接受四个值 { 当前行的值, 当前列的值, 行的下标, 列的下标 }
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      // 判断列的属性
      if (this.mergeArr.indexOf(column.property) !== -1) {
        // 判断其值是不是为0
        if (this.mergeObj[column.property][rowIndex]) {
          return [this.mergeObj[column.property][rowIndex], 1]
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
    },
    // getSpanArr方法
    getSpanArr(data) {
      this.mergeArr.forEach((key, index1) => {
        let count = 0; // 用来记录需要合并行的起始位置
        this.mergeObj[key] = []; // 记录每一列的合并信息
        data.forEach((item, index) => {
          // index == 0表示数据为第一行，直接 push 一个 1
          if (index === 0) {
            this.mergeObj[key].push(1);
          } else {
            // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
            if (item[key] === data[index - 1][key]) {
              this.mergeObj[key][count] += 1;
              this.mergeObj[key].push(0);
            } else {
              // 如果当前行和上一行其值不相等
              count = index; // 记录当前位置
              this.mergeObj[key].push(1); // 重新push 一个 1
            }
          }
        })
      })
    },
    /** 查询库存列表 */
    getList() {
      this.loading = true
      const {place, quantityRange, itemId, panelType} = this.queryParams;
      this.panelType = panelType;
      const [warehouseId, areaId, rackId] = place || [];
      const [quantityStart, quantityEnd] = quantityRange || [];
      const query = {warehouseId, areaId, rackId, itemId, quantityStart, quantityEnd, panelType}
      const pageReq = {...this.pageReq}
      pageReq.page -= 1;
      listWmsInventory(query, pageReq).then(response => {
        const {content, totalElements} = response

        this.wmsInventoryList = content

        if (panelType !=10) {
          // 10 库区需要考虑库区是否为空

          content.forEach(item => {
            if (!item.warehouseName) {
              item.warehouseName = "暂未分配仓库"
            }
            if (item.areaName) {
              item.warehouseName = item.warehouseName + '/' + item.areaName
            }
          })
        }
        // 合并行
        this.columns = this.columnsNormal
        if (panelType == 5 ) {
          // 仓库
          this.mergeArr = ['warehouseName']
        }else if (panelType == 10){
          // 库区
          content.forEach(item => {
            if (!item.warehouseName) {
              item.warehouseName = "暂未分配仓库"
            }
            if (!item.areaName) {
              item.areaName = "暂未分配库区"
            }
          })
          this.mergeArr = ['warehouseName','areaName'] // 表格中的列名
          this.columns = this.columnsArea
        } else if (panelType == 15) {
          // 类型
          this.mergeArr = ['itemTypeName',"itemNo",'itemName'] // 表格中的列名
          this.columns = this.columnsType
        } else {
          // 物料
          this.mergeArr = ['itemName','itemTypeName',"itemNo"] // 表格中的列名
          this.columns = this.columnsByName
        }
        this.getSpanArr(this.wmsInventoryList);
        this.total = totalElements
        this.loading = false
      })
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        itemId: null,
        rackId: null,
        quantity: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      }
      this.resetForm('form')
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
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$modal.confirm('是否确认导出所有库存数据项？').then(() => {
        this.exportLoading = true
        return exportWmsInventory(queryParams)
      }).then(response => {
        this.$download.download(response)
        this.exportLoading = false
      }).catch(() => {
      })
    }
  }
}
</script>
