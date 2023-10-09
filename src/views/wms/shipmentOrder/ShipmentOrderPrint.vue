<template>
  <div>
    <div class="receipt-order-print" ref="receiptOrderPrintRef" hidden="hidden">
      <!--    <div class="title">{{ row.shipmentOrderNo }}</div>-->
      <!--    <div class="summary">-->
      <!--      <div class="col1">客戶: {{ row.customerName }}</div>-->
      <!--      <div class="col1">订单号: {{ row.orderNo }}</div>-->
      <!--      <div class="col1">出库类型: {{ row.shipmentType }}</div>-->
      <!--      <div class="col1">日期: {{ row.createTime }}</div>-->
      <!--      <div class="col1">出库人: {{ row.createByName }}</div>-->
      <!--    </div>-->
      <div v-for="item in row" style="height: 794px!important;">
        <table class="common-table">
          <tr align="center">
            <th :colspan="10">出库单：{{ item.shipmentOrderNo }}</th>
          </tr>
          <tr>
            <th align="left">
              顾客：
            </th>
            <th colspan="4" align="left">
              {{ item.customerName }}
            </th>
            <th align="left">
              操作员：
            </th>
            <th align="left">
              {{ item.createByName }}
            </th>
            <th align="left">操作时间：</th>
            <th align="left" colspan="2">{{ item.createTime || '' }}</th>
          </tr>
          <tr>
            <th width="150">编号</th>
            <th>名称</th>
            <th>规格</th>
            <th>数量</th>
            <th>单位</th>
            <th>单价</th>
            <th>金额</th>
            <th>批号</th>
            <th width="120">效期</th>
            <th>备注</th>
          </tr>
          <tr v-for="it in item.details">
            <td align="center">{{ it.item.itemNo || '' }}</td>
            <td align="center">{{ it.item.itemName || '' }}</td>
            <td align="center">{{ it.item.specification || '' }}</td>
            <td align="center">{{ it.planQuantity }}</td>
            <td align="center">{{ it.item.unit || '' }}</td>
            <td align="center">{{ it.money ? it.money : (it.money == 0 ? '0' : '') }}</td>
            <td align="center">{{ it.money*it.planQuantity }}</td>
            <td align="center">{{ it.item.batch || '' }}</td>
            <td align="center">{{ parseTime(it.item.expiryDate, '{y}-{m}-{d}') }}</td>
            <td align="center">{{ it.item.remark || '' }}</td>
          </tr>
          <tr>
            <td colspan="4" align="center">合计：</td>
            <td align="center" colspan="3">{{ digitalToChinese(item.amount) }}</td>
            <td align="center" colspan="3">{{ item.amount }}元</td>
          </tr>
        </table>
      </div>
      <!--    <div class="foot">-->
      <!--      <div class="col2">备注: {{ row.remark }}</div>-->
      <!--    </div>-->
    </div>
  </div>
</template>

<script>

import {digitalToChinese} from "@/utils/money";

export default {
  props: ['row'],
  methods: {
    digitalToChinese,
    start() {
      this.$print(this.$refs.receiptOrderPrintRef, {}, 'A4')
    },
  }
}
</script>

<style lang="stylus" media="print">
@page {
  size: auto;
  margin: 0;
}

@media print {
  * {
    color: #000 !important;
  }

  table {
    width 100%
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
  }

  table, tbody, thead {
    width: 100% !important;
  }

  .receipt-order-print {
    width: 100% !important;
    font-size: 14px;
  }

  table, table tr th, table tr td {
    border: 0.05rem solid #000;
    font-size: 12px;
  }

}

.receipt-order-print
  padding 12px
  line-height 1.8

  .summary
    display flex
    flex-wrap wrap

    .col1
      width 50%

  .title
    font-size 18px
    text-align center

  .common-table
    td, th
      border-color black
</style>
