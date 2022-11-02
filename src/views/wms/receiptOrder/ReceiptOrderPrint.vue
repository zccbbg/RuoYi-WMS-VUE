<template lang="pug">
.receipt-order-print(ref="receiptOrderPrintRef" hidden="hidden")
  .title {{row.receiptOrderNo}}
  .summary
    .col1 供应商: {{row.supplierName}}
    .col1 订单号: {{row.orderNo}}
    .col1 入库类型: {{row.receiptType}}
    .col1 日期: {{row.createTime}}
  table.common-table
    tr
      th 物料名
      th 物料编号
      th 物料类型
      th 数量
      th 仓库/库区/货架
    tr(v-for="it in row.details")
      td {{it.itemName || ''}}
      td {{it.itemNo || ''}}
      td {{it.itemType || ''}}
      td {{it.planQuantity}}
      td {{it.place}}
    tr
      td 合计
      td
      td
      td {{row.totalCount}}
      td
  .foot
    .col2 备注: {{row.remark}}
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
