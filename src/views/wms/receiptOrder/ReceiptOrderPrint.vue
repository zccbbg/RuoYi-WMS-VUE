<template lang="pug">
.receipt-order-print(ref="receiptOrderPrintRef" hidden="hidden")
  .title {{row.orderNo}}
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

  .shipping-order {
    width: 100% !important;
    font-size: 14px;
  }

  table, table tr th, table tr td {
    border: 0.05rem solid #000;
    font-size: 12px;
  }

}

.shipping-order

  .headTitle
    text-align: center;
    font-size: 0.5rem;
    padding-top: 10px;

  .receiverInfo
    font-size: 12px;
    display: flex;
    -webkit-box-pack: start;
    justify-content: flex-start;
    -webkit-box-align: start;
    align-items: flex-start;
    word-break: break-all;
    flex-wrap: wrap;

    .content1
      display: flex;
      -webkit-box-align: start;
      align-items: flex-start;
      margin-right: 1.5rem;
      word-break: break-all;

      .content-title
        min-width: 3.125rem;
        white-space: nowrap;

      .content-text
        -webkit-box-flex: 1;
        flex: 1;
        word-break: break-all;

  .table
    width 100%
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;

    .chris-table-header
      overflow: auto;

      th
        font-size: 0.5rem;
        text-align: center;
        background-color: transparent;

    .chris-table-body
      td
        word-break: break-all;
        text-align center

.pagebreak
  padding-left: 2px;
  padding-right: 2px;
</style>
