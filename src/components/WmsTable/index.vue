<template>
  <el-table
        border
        ref="multipleTable"
        v-bind="$props"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
      <slot />
  </el-table>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      selectionData: []
    }
  },
  methods: {
    // 向父组件共享数据
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    },

    handleRowClick(row, column, event){
      // selectionData -- 已选的数据
				let index = this.selectionData.findIndex(item => {
					// 判断已选数组中是否已存在该条数据
					return item.id == row.id
				})
				if (index == -1) {
					// 如果未存在，设置已选状态，并在list中添加这条数据
					this.$refs.multipleTable.toggleRowSelection(row, true); //设置复选框为选中状态
					this.selectionData.push(row)
				} else {
					// 如果已存在，设置未选状态，并在list中删除这条数据
					this.$refs.multipleTable.toggleRowSelection(row, false); //设置复选框为未选状态
					this.selectionData.splice(index, 1)
				}
    }
  }
}
</script>
