<template>
  <div class="receipt-order-print" ref="receiptOrderPrintRef" hidden="hidden">
    <div class="title">{{ row.shipmentOrderNo }}</div>
    <div class="summary">
      <div class="col1">客戶: {{ row.customerName }}</div>
      <div class="col1">订单号: {{ row.orderNo }}</div>
      <div class="col1">出库类型: {{ row.shipmentType }}</div>
      <div class="col1">日期: {{ row.createTime }}</div>
    </div>
    <table class="common-table">
      <tr>
        <th>物料名</th>
        <th>物料编号</th>
        <th>物料类型</th>
        <th>数量</th>
        <th>仓库/库区</th>
      </tr>
      <tr v-for="it in row.details">
        <td>{{ it.itemName || '' }}</td>
        <td>{{ it.itemNo || '' }}</td>
        <td>{{ it.itemType || '' }}</td>
        <td>{{ it.planQuantity }}</td>
        <td>{{ it.place }}</td>
      </tr>
      <tr>
        <td>合计</td>
        <td></td>
        <td></td>
        <td>{{ row.totalCount }}</td>
        <td></td>
      </tr>
    </table>
    <div class="foot">
      <div class="col2">备注: {{ row.remark }}</div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['row'],
  methods: {
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
