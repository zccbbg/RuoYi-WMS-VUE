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
        let count = 0;
        this.mergeObj[key] = [];
        data.forEach((item, index) => {
          if (index === 0) {
            // 第一行始终为新组
            this.mergeObj[key].push(1);
          } else {
            let valid = true;
            // 逐步判断当前行的特定属性与前一行的对应属性是否相等
            for (let i = 0; i <= index1; i++) {
              const mergeKey = this.mergeArr[i];
              if (item[mergeKey] !== data[index - 1][mergeKey]) {
                valid = false;
                break;
              }
            }
            if (valid) {
              // 所有属性值都相等，执行合并操作
              this.mergeObj[key][count] += 1;
              this.mergeObj[key].push(0);
            } else {
              // 任何一个属性不相等，不执行合并操作，创建新组
              count = index;
              this.mergeObj[key].push(1);
            }
          }
        });
      });
    }
  }
}
</script>
