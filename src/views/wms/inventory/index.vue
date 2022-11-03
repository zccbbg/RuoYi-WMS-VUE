<template lang="pug">
  .app-container
    el-form.ry_form(
      v-show="showSearch"
      :inline="true"
      label-width="100px"
      :model="queryParams"
      ref="queryForm"
      size="medium"
    )
      el-form-item(label="物料" prop="itemId")
        item-select(v-model="queryParams.itemId" )
      el-form-item(label="仓库" prop="rackId")
        wms-warehouse-cascader(v-model="queryParams.place")
      el-form-item(label="库存" prop="quantity")
        number-range(v-model="queryParams.quantityRange")
      el-form-item.flex_one.tr
        el-button(icon="el-icon-search" size="mini" type="primary" @click="handleQuery") 搜索
        el-button(icon="el-icon-refresh" size="mini" @click="resetQuery") 重置
    el-row.mb8(:gutter="10")
      right-toolbar(:columns="columns" :showSearch.sync="showSearch" @queryTable="getList")
    WmsTable(v-loading="loading" :data="wmsInventoryList" @selection-change="handleSelectionChange")
      el-table-column(align="left" label="编号" prop="id" width="72")
      el-table-column(align="left" label="物料")
        template(v-slot="{ row }")
          div 编号： {{row.itemId}}
          div {{row.itemName}}
          div {{row.itemNo}}
      el-table-column(align="left" label="仓库/库区/货架")
        template(v-slot="{ row }")
          span(v-if="row.warehouseName") {{row.warehouseName}}
          span(v-if="row.areaName") /{{row.areaName}}
          span(v-if="row.rackName") /{{row.rackName}}
      el-table-column(align="left" label="库存" prop="quantity")
    pagination(
      v-show="total>0"
      :limit.sync="pageReq.size"
      :page.sync="pageReq.page"
      :total="total"
      @pagination="getList"
    )
    // 添加或修改库存对话框
    el-dialog(append-to-body :title="title" :visible.sync="open" width="50%")
      el-form.dialog-form-two(
        inline
        label-width="108px"
        :model="form"
        ref="form"
        :rules="rules"
      )
        el-form-item(label="物料ID" prop="itemId")
          el-input(v-model="form.itemId" placeholder="请输入物料ID")
        el-form-item(label="货架id" prop="rackId")
          el-input(v-model="form.rackId" placeholder="请输入货架id")
        el-form-item(label="库存" prop="quantity")
          el-input(v-model="form.quantity" placeholder="请输入库存")
        el-form-item(label="备注" prop="remark")
          el-input(v-model="form.remark" placeholder="请输入备注")
      .dialog-footer(slot="footer")
        el-button(type="primary" @click="submitForm") 确 定
        el-button(@click="cancel") 取 消
</template>

<script>
import {
  listWmsInventory,
  getWmsInventory,
  delWmsInventory,
  addWmsInventory,
  updateWmsInventory,
  exportWmsInventory
} from '@/api/wms/inventory'
import NumberRange from '@/components/NumberRange'
import ItemSelect from '@/components/ItemSelect'

export default {
  name: 'WmsInventory',
  components: { ItemSelect, NumberRange },
  data() {
    return {
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
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        itemId: null,
        place: null,
        quantityRange: null
      },
      pageReq: {
        page: 1,
        size: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      columns: [
        { key: 1, label: '物料ID', visible: true },
        { key: 2, label: '货架id', visible: true },
        { key: 3, label: '库存', visible: true },
        { key: 4, label: '备注', visible: true }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询库存列表 */
    getList() {
      this.loading = true
      const {place, quantityRange, itemId} = this.queryParams;
      const [ warehouseId, areaId, rackId ] = place || [];
      const [ quantityStart, quantityEnd ] = quantityRange || [];
      const query = { warehouseId, areaId, rackId, itemId, quantityStart, quantityEnd }
      const pageReq = { ...this.pageReq }
      pageReq.page -= 1;
      listWmsInventory(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsInventoryList = content
        this.total = totalElements
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加库存'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getWmsInventory(id).then(response => {
        this.form = response
        this.open = true
        this.title = '修改库存'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsInventory(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addWmsInventory(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除库存编号为"' + ids + '"的数据项？').then(function() {
        return delWmsInventory(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
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
