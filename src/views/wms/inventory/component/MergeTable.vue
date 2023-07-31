<template>
  <el-table v-bind="$props" :data="processData" :span-method="objectSpanMethod" border>
    <slot/>
  </el-table>
</template>

<script>
export default {
  name: 'MergeTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    mergeArr: {// 表格中需要合并的列名
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mergeObj: {}, // 用来记录需要合并行的下标
    }
  },
  computed: {
    processData() {
      // 在data发生变化时执行的操作
      this.getSpanArr(this.tableData)
      return this.tableData
    }
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
  }
}
</script>
