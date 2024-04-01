<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" label-width="100px" size="medium"
             class="dialog-form-two">
      <el-row :gutter="24">
        <el-col :span="5">
          <el-form-item label="创建时间" prop="time">
            <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
                            :clearable="false" :picker-options="pickerOptions" range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="客户" prop="customerId">
            <WmsCustomerSelect v-model="queryParams.customerId" size="small" placeholder="请选择客户" :filterable="true"></WmsCustomerSelect>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="分类" prop="itemType">
            <treeselect v-model="queryParams.itemTypeId" :options="itemTypeOptions" :show-count="true" placeholder="请选择分类"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="list" show-summary :summary-method="getSummaries" border>
      <el-table-column label="客户" align="center" prop="customerName"/>
      <el-table-column v-for="item in columns" :label="item.label" align="right" prop="amount">
        <template slot-scope="{ row }">
          <div>{{ getAmount(row, item) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="合计" align="right" prop="total">
        <template slot-scope="{ row }">
          <div>{{ row.total.toFixed(2) }}</div>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import {itemTypeTreeselect, listWmsItemTypeNoPage} from '@/api/wms/itemType'
import { statByCustomerAndType } from '@/api/wms/shipmentOrder'
import dateUtil from '@/utils/DateUtil'
import moment from 'moment'
import {numSub} from "@/utils/numSub";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: 'shipmentItemStatistics',
  components: {Treeselect},
  data() {
    return {
      itemTypeOptions: [],
      queryParams: {
        customerId: null,
        itemTypeId: null,
        startTime: null,
        endTime: null,
        time: []
      },
      pickerOptions: {
        shortcuts: dateUtil.getTimeShort(false)
      },
      list: [],
      loading: true,
      columns: [],
      dateRange: [],
    }
  },
  methods: {
    numSub,
    handleQuery() {
      this.getList()
    },
    resetQuery() {

    },
    getList() {
      const [start,end] = this.dateRange;
      const days = moment(end).diff(moment(start), 'day');
      if (days > 31) {
        this.$message.error('日期间隔只能选择31天内的');
        return
      }
      const { beginTime, endTime } = this.addDateRange2(this.queryParams, this.dateRange, false)
      this.loading = true
      listWmsItemTypeNoPage({}, {}).then(res => {
        console.log('res:', res)
        this.columns = []
        res.data.forEach(it => {
          this.columns.push({
            key: it.itemTypeId,
            label: it.typeName,
            visible: true
          })
        })
      }).then(() => {
        statByCustomerAndType({...this.queryParams, beginTime, endTime}).then((res) => {
          this.list = res
        })
        //查统计数据
      }).finally(() => {
        this.loading = false
      })
    },
    initDate() {
      const { end, start } = dateUtil.getStartEnd(7)
      this.dateRange = [moment(start).format('yyyy-MM-DD'), moment(end).format('yyyy-MM-DD')]
    },
    getAmount(row, item) {
      const index = row.data.findIndex(it => it.itemTypeId === item.key)
      if (index === -1) {
        return Number(0).toFixed(2)
      } else {
        return Number(row.data[index].amount).toFixed(2)
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      let sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === columns.length - 1) {
          sums[index] = this.list.map(it => it.total).reduce((prev, curr) => {
            return numSub(Number(prev), -Number(curr));
          }, Number(0))
        } else {
          const itemTypeId = this.columns[index - 1].key;
          sums[index] = Number(0)
          this.list.forEach(it => {
            it.data.forEach(item => {
              if (item.itemTypeId === itemTypeId) {
                sums[index] = numSub(sums[index], -Number(item.amount))
              }
            })
          })
        }
      });
      sums = sums.map(it => {
        if (it !== '合计') {
          return  Number(it).toFixed(2)
        }
        return it
      })
      return sums;
    }
  },
  created() {
    itemTypeTreeselect().then(response => {
      this.itemTypeOptions = response.data
    });
    this.initDate()
    this.getList()
  }
}
</script>

<style scoped lang="scss">

</style>
