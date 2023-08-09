// wms 相关的工具函数

/*
* 批量设置库存
* */
export function batchWarehouseRenderHeader(h, column) {
  let currentLabel = column.column.label;
  return [
    h('div', {style: {display: 'flex', alignItems: 'center'}}, [
      h('span', {}, currentLabel),
      h('el-button', {
        props: {
          type: 'text',
          size: 'small',
          icon: 'el-icon-files',
        },
        on: {
          click: this.onBatchSetInventory
        }
      }, '批量'),
    ]),
  ];
}
