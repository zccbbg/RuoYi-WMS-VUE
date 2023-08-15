<template>

  <el-dialog :visible.sync="dialogVisible" title="库存一览" width="600px" @close="handleDialogClose">
    <div ref="reportHTML" v-html="msg" class="web-con"></div>
    <el-table :data="wmsInventoryList" v-loading="loading">
      <el-table-column width="100" property="itemName" label="物料名称"></el-table-column>
      <el-table-column width="150" property="itemTypeName" label="物料类别"></el-table-column>
      <el-table-column property="warehouseName" label="仓库/库区"></el-table-column>
      <el-table-column width="100" property="quantity" label="库存"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
import {mapGetters} from 'vuex'
import {listWmsInventory} from "@/api/wms/inventory";

export default {
  props: {
    value: {
      type: [String, Number, Array],
      default: null
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prodId: {
      type: [Number, String],
      default: null
    },
    msg: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      wmsInventoryList: [],
      loading: true,
      dialogVisible: true,
      selectedValue: ''
    }
  },
  computed: {
    ...mapGetters(['rackList', 'areaList', 'warehouseList']),
    selections: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  created() {
    this.setOptions()
  },
  methods: {
    setOptions() {
      this.loading = true
      listWmsInventory({itemId: this.prodId}, {}).then(response => {
        const {content, totalElements} = response
        this.wmsInventoryList = content

        content.forEach(item => {
          if (!item.warehouseName) {
            item.warehouseName = "暂未分配仓库"
          }
          if (item.areaName) {
            if (item.areaName) {
              item.warehouseName = `${item.warehouseName}/${item.areaName}`;
            }
          }
        });
        this.total = totalElements;
        this.loading = false;
      });
    },
    handleDialogClose() {
      this.selectedValue = this.selections;
    },
    showDialog() {
      this.dialogVisible = true;
    },
    handleDialogConfirm() {
      // 处理对话框确认按钮的逻辑
      // 可以在这里获取选中的值并进行相应的处理
      // 例如，将选中的值赋给输入框的绑定值
      this.selectedValue = this.selections;
      this.dialogVisible = false; // 关闭对话框
    }
  }
}
</script>
