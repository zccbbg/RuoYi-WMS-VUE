export const STOCK_OUT_TEMPLATE = {
  "default": "true",
  "title": "出库单",
  "type": 1,
  "width": 770,
  "height": 500,
  "pageWidth": 215,
  "pageHeight": 140,
  "tempItems": [{
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 770,
    "height": 25,
    "left": 0,
    "top": 10,
    "title": "出库单号",
    "value": "{ 出库单号 } ",
    "defaultValue": "CK-1234567890",
    "name": "shipmentOrderNo",
    "style": {
      "zIndex": 0,
      "FontSize": 12,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "center",
      "ItemType": 1
    },
    "uuid": "7f7b0b45da"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 39,
    "top": 40,
    "title": "自定义文本",
    "value": "客户：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "54ca3dc671"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 375,
    "top": 40,
    "title": "自定义文本",
    "value": "订单号：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "dae9eb86e4"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 15,
    "top": 67,
    "title": "自定义文本",
    "value": "出库类型：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "317ae87dea"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 387,
    "top": 67,
    "title": "自定义文本",
    "value": "日期：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "d8cf0f23b0"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 268,
    "height": 20,
    "left": 81,
    "top": 40,
    "title": "客户",
    "value": "{ 客户 } ",
    "defaultValue": "中国苹果",
    "name": "customerName",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "a77126a142"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 299,
    "height": 20,
    "left": 425,
    "top": 40,
    "title": "订单号",
    "value": "{ 订单号 } ",
    "defaultValue": "zj001",
    "name": "orderNo",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "d8f17a27f5"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 257,
    "height": 20,
    "left": 80,
    "top": 67,
    "title": "出库类型",
    "value": "{ 出库类型 } ",
    "defaultValue": "销售出库",
    "name": "shipmentType",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "4be08abbb3"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 230,
    "height": 20,
    "left": 425,
    "top": 67,
    "title": "下单时间",
    "value": "{ 下单时间 } ",
    "defaultValue": "2020-08-27 12: 00: 00",
    "name": "createTime",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "83ef9c90be"
  }, {
    "type": "braid-table",
    "isEdit": 0,
    "dragable": true,
    "resizable": true,
    "width": 740,
    "height": 275,
    "left": 15,
    "top": 110,
    "title": "出库商品明细",
    "value": "{ details } ",
    "tabelHtml": "",
    "columnsAttr": [{
      "title": "物料名",
      "value": "{ 物料名 } ",
      "name": "itemName"
    }, {
      "title": "物料编号",
      "value": "{ 物料编号 } ",
      "name": "itemNo"
    }, {
      "title": "物料类型",
      "value": "{ 物料类型 } ",
      "name": "itemType"
    }, {
      "title": "数量",
      "value": "{ 数量 } ",
      "name": "planQuantity"
    }, {
      "title": "仓库/库区",
      "value": "{ 仓库/库区 } ",
      "name": "place"
    }],
    "columns": [{
      "title": "物料名",
      "value": "{物料名}",
      "name": "itemName"
    }, {
      "title": "物料编号",
      "value": "{物料编号}",
      "name": "itemNo"
    }, {
      "title": "物料类型",
      "value": "{物料类型}",
      "name": "itemType"
    }, {
      "title": "数量",
      "value": "{数量}",
      "name": "planQuantity"
    }, {
      "title": "仓库/库区",
      "value": "{仓库/库区}",
      "name": "place"
    }],
    "selectCol": ["itemName", "itemNo", "itemType", "planQuantity", "place"],
    "name": "details",
    "style": {
      "zIndex": 0,
      "Alignment": "left",
      "FontSize": 9,
      "FontColor": "#000000",
      "BorderColor": "#000000",
      "AutoHeight": true,
      "BottomMargin": 0
    },
    "uuid": "8f1ee2cff3"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 435,
    "top": 382,
    "title": "自定义文本",
    "value": "合计数量：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "15134dd251"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 15,
    "top": 430,
    "title": "自定义文本",
    "value": "备注：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "6b5f65c726"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 180,
    "height": 20,
    "left": 492,
    "top": 382,
    "title": "合计数量",
    "value": "{合计数量}",
    "defaultValue": "123.00",
    "name": "totalCount",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "7a425ef108"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 660,
    "height": 20,
    "left": 50,
    "top": 430,
    "title": "备注",
    "value": "{备注}",
    "defaultValue": "北京采购入库成都摘要",
    "name": "remark",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "a745e40eae"
  }]
}


export const STOCK_IN_TEMPLATE = {
  "default": "true",
  "title": "入库单",
  "type": 1,
  "width": 770,
  "height": 500,
  "pageWidth": 215,
  "pageHeight": 140,
  "tempItems": [{
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 770,
    "height": 25,
    "left": 0,
    "top": 10,
    "title": "入库单号",
    "value": "{ 入库单号 } ",
    "defaultValue": "CK-1234567890",
    "name": "receiptOrderNo",
    "style": {
      "zIndex": 0,
      "FontSize": 12,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "center",
      "ItemType": 1
    },
    "uuid": "7f7b0b45da"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 27,
    "top": 40,
    "title": "自定义文本",
    "value": "供应商：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "54ca3dc671"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 375,
    "top": 40,
    "title": "自定义文本",
    "value": "订单号：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "dae9eb86e4"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 15,
    "top": 67,
    "title": "自定义文本",
    "value": "入库类型：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "317ae87dea"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 387,
    "top": 67,
    "title": "自定义文本",
    "value": "日期：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "d8cf0f23b0"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 268,
    "height": 20,
    "left": 80,
    "top": 40,
    "title": "供应商",
    "value": "{ 供应商 } ",
    "defaultValue": "中国苹果",
    "name": "supplierName",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "a77126a142"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 299,
    "height": 20,
    "left": 425,
    "top": 40,
    "title": "订单号",
    "value": "{ 订单号 } ",
    "defaultValue": "zj001",
    "name": "orderNo",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "d8f17a27f5"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 257,
    "height": 20,
    "left": 80,
    "top": 67,
    "title": "入库类型",
    "value": "{ 入库类型 } ",
    "defaultValue": "销售出库",
    "name": "receiptType",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 1
    },
    "uuid": "4be08abbb3"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 230,
    "height": 20,
    "left": 425,
    "top": 67,
    "title": "下单时间",
    "value": "{ 下单时间 } ",
    "defaultValue": "2020-08-27 12: 00: 00",
    "name": "createTime",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "83ef9c90be"
  }, {
    "type": "braid-table",
    "isEdit": 0,
    "dragable": true,
    "resizable": true,
    "width": 740,
    "height": 275,
    "left": 15,
    "top": 110,
    "title": "入库商品明细",
    "value": "{ details } ",
    "tabelHtml": "",
    "columnsAttr": [{
      "title": "物料名",
      "value": "{ 物料名 } ",
      "name": "itemName"
    }, {
      "title": "物料编号",
      "value": "{ 物料编号 } ",
      "name": "itemNo"
    }, {
      "title": "物料类型",
      "value": "{ 物料类型 } ",
      "name": "itemType"
    }, {
      "title": "数量",
      "value": "{ 数量 } ",
      "name": "planQuantity"
    }, {
      "title": "仓库/库区",
      "value": "{ 仓库/库区 } ",
      "name": "place"
    }],
    "columns": [{
      "title": "物料名",
      "value": "{物料名}",
      "name": "itemName"
    }, {
      "title": "物料编号",
      "value": "{物料编号}",
      "name": "itemNo"
    }, {
      "title": "物料类型",
      "value": "{物料类型}",
      "name": "itemType"
    }, {
      "title": "数量",
      "value": "{数量}",
      "name": "planQuantity"
    }, {
      "title": "仓库/库区",
      "value": "{仓库/库区}",
      "name": "place"
    }],
    "selectCol": ["itemName", "itemNo", "itemType", "planQuantity", "place"],
    "name": "details",
    "style": {
      "zIndex": 0,
      "Alignment": "left",
      "FontSize": 9,
      "FontColor": "#000000",
      "BorderColor": "#000000",
      "AutoHeight": true,
      "BottomMargin": 0
    },
    "uuid": "8f1ee2cff3"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 435,
    "top": 382,
    "title": "自定义文本",
    "value": "合计数量：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "15134dd251"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 110,
    "height": 20,
    "left": 15,
    "top": 430,
    "title": "自定义文本",
    "value": "备注：",
    "defaultValue": "自定义文本",
    "name": "",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "6b5f65c726"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 180,
    "height": 20,
    "left": 492,
    "top": 382,
    "title": "合计数量",
    "value": "{合计数量}",
    "defaultValue": "123.00",
    "name": "totalCount",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "7a425ef108"
  }, {
    "type": "braid-txt",
    "isEdit": 1,
    "dragable": true,
    "resizable": true,
    "width": 660,
    "height": 20,
    "left": 50,
    "top": 430,
    "title": "备注",
    "value": "{备注}",
    "defaultValue": "北京采购入库成都摘要",
    "name": "remark",
    "style": {
      "zIndex": 0,
      "FontSize": 9,
      "FontColor": "#  000000",
      "Bold": false,
      "Italic": false,
      "Underline": false,
      "Alignment": "left",
      "ItemType": 0
    },
    "uuid": "a745e40eae"
  }]
}
