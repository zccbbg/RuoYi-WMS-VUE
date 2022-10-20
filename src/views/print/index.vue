<template>
  <kr-print-designer
    :temp-value="tempValue"
    :widget-options="widgets"
    :lodop-license="licenseInfo"
    @save="handleSave"
  />

</template>

<script>
export default {
  data() {
    return {
      tempValue: {
        "default": "true",
        "title": "出库单示例",
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
          "name": "stockoutCode",
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
          "left": 15,
          "top": 40,
          "title": "自定义文本",
          "value": "客户/供应商：",
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
          "value": "业务员：",
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
          "top": 60,
          "title": "自定义文本",
          "value": "发货类型：",
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
          "left": 375,
          "top": 60,
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
          "left": 95,
          "top": 40,
          "title": "客户/供应商",
          "value": "{ 客户/供应商 } ",
          "defaultValue": "中国苹果",
          "name": "unitName",
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
          "title": "经办人",
          "value": "{ 经办人 } ",
          "defaultValue": "zj001",
          "name": "handlerName",
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
          "top": 60,
          "title": "出库类型",
          "value": "{ 出库类型 } ",
          "defaultValue": "销售出库",
          "name": "stockoutType",
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
          "left": 410,
          "top": 60,
          "title": "制单时间",
          "value": "{ 制单时间 } ",
          "defaultValue": "2020-08-27 12: 00: 00",
          "name": "created",
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
          "top": 85,
          "title": "出库商品明细",
          "value": "{ details } ",
          "defaultValue": [{
            "productName": "苹果ipone11pro",
            "skuName": "iphone11pro256g",
            "specModel": "165L",
            "quantity": 3,
            "snCode": "[SPP1Y79G1]",
            "price": "23.00"
          }, {
            "productName": "苹果ipone11pro",
            "skuName": "iphone11pro124g",
            "specModel": "165L",
            "quantity": 3,
            "snCode": "[SPP1Y79G1]",
            "price": "12.00"
          }],
          "tabelHtml": "",
          "columnsAttr": [{
            "title": "产品名称",
            "value": "{ 产品名称 } ",
            "name": "productName"
          }, {
            "title": "sku名称",
            "value": "{ sku名称 } ",
            "name": "skuName"
          }, {
            "title": "规格型号",
            "value": "{ 规格型号 } ",
            "name": "specModel"
          }, {
            "title": "数量",
            "value": "{ 数量 } ",
            "name": "quantity"
          }, {
            "title": "单价",
            "value": "{ 单价 } ",
            "name": "price"
          }, {
            "title": "产品序列号",
            "value": "产品序列号明细：<br>{产品序列号}",
            "name": "snCode",
            "trSet": {
              "title": "产品序列号明细:",
              "col": 5,
              "margin": "50px"
            }
          }],
          "columns": [{
            "title": "产品名称",
            "value": "{产品名称}",
            "name": "productName"
          }, {
            "title": "sku名称",
            "value": "{sku名称}",
            "name": "skuName"
          }, {
            "title": "规格型号",
            "value": "{规格型号}",
            "name": "specModel"
          }, {
            "title": "数量",
            "value": "{数量}",
            "name": "quantity"
          }, {
            "title": "单价",
            "value": "{单价}",
            "name": "price"
          }],
          "selectCol": ["productName", "skuName", "specModel", "quantity", "price"],
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
          "left": 15,
          "top": 370,
          "title": "自定义文本",
          "value": "发货仓库：",
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
          "uuid": "6171703d27"
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 110,
          "height": 20,
          "left": 495,
          "top": 370,
          "title": "自定义文本",
          "value": "合计金额：",
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
          "top": 390,
          "title": "自定义文本",
          "value": "联系人：",
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
          "uuid": "8f53513be0"
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 110,
          "height": 20,
          "left": 255,
          "top": 390,
          "title": "自定义文本",
          "value": "电话：",
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
          "uuid": "74dad4adb2"
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 110,
          "height": 20,
          "left": 15,
          "top": 410,
          "title": "自定义文本",
          "value": "地址：",
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
          "uuid": "4ed4accd35"
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
          "width": 110,
          "height": 20,
          "left": 15,
          "top": 450,
          "title": "自定义文本",
          "value": "库管：",
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
          "uuid": "c71258f82d"
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 110,
          "height": 20,
          "left": 375,
          "top": 450,
          "title": "自定义文本",
          "value": "客户签收：",
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
          "uuid": "648e537904"
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 400,
          "height": 20,
          "left": 75,
          "top": 370,
          "title": "出库仓库",
          "value": "{出库仓库}",
          "defaultValue": "北京仓库",
          "name": "warehouseName",
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
          "uuid": "10855eefc1"
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 180,
          "height": 20,
          "left": 555,
          "top": 370,
          "title": "合计金额",
          "value": "{合计金额}",
          "defaultValue": "123.00",
          "name": "totalPrice",
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
          "width": 180,
          "height": 20,
          "left": 60,
          "top": 390,
          "title": "收货人(销售)",
          "value": "{收货人}",
          "defaultValue": "刘某某",
          "name": "receivePerson",
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
          "uuid": "29a5f24c1b"
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 190,
          "height": 20,
          "left": 290,
          "top": 390,
          "title": "收货电话(销售)",
          "value": "{收货人电话}",
          "defaultValue": "收货人",
          "name": "receivePhone",
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
          "uuid": "ae0fd46895"
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 680,
          "height": 20,
          "left": 50,
          "top": 410,
          "title": "收货地址(销售)",
          "value": "{收货地址}",
          "defaultValue": "四川成都",
          "name": "address",
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
          "uuid": "dae1e2cac9"
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 660,
          "height": 20,
          "left": 50,
          "top": 430,
          "title": "摘要",
          "value": "{摘要}",
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
        }, {
          "type": "braid-txt",
          "isEdit": 1,
          "dragable": true,
          "resizable": true,
          "width": 292,
          "height": 20,
          "left": 50,
          "top": 450,
          "title": "制单人",
          "value": "{制单人}",
          "defaultValue": "jz002",
          "name": "createUserName",
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
          "uuid": "2d1b141163"
        }]
      },
      widgets: [
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '自定义文本',
          value: '自定义文本',
          defaultValue: '自定义文本',
          name: ''
        },
        {
          type: 'braid-txt',
          isEdit: 0,
          title: '公司名称',
          value: '{公司名称}',
          defaultValue: '某某公司',
          name: 'companyName'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '出库单号',
          value: '{出库单号}',
          defaultValue: 'CK-1234567890',
          name: 'stockoutCode'
        },
        {
          type: 'bar-code',
          isEdit: 1,
          title: '单号条码',
          value: '{单号}',
          defaultValue: 'CK-1234567890',
          name: 'stockoutCode',
          lodopStyle: { QRCodeVersion: '1', QRCodeErrorLevel: 'L' },
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '客户/供应商',
          value: '{客户/供应商}',
          defaultValue: '中国苹果',
          name: 'unitName'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '经办人',
          value: '{经办人}',
          defaultValue: 'zj001',
          name: 'handlerName'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '出库类型',
          value: '{出库类型}',
          defaultValue: '销售出库',
          name: 'stockoutType'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '出库仓库',
          value: '{出库仓库}',
          defaultValue: '北京仓库',
          name: 'warehouseName'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '出库时间',
          value: '{出库时间}',
          defaultValue: '2020-08-27 12:00:00',
          name: 'businessDate'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '制单人',
          value: '{制单人}',
          defaultValue: 'jz002',
          name: 'createUserName'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '制单时间',
          value: '{制单时间}',
          defaultValue: '2020-08-27 12:00:00',
          name: 'created'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '收货人(销售)',
          value: '{收货人}',
          defaultValue: '刘某某',
          name: 'receivePerson'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '收货电话(销售)',
          value: '{收货人电话}',
          defaultValue: '收货人',
          name: 'receivePhone'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '收货地址(销售)',
          value: '{收货地址}',
          defaultValue: '四川成都',
          name: 'address'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '合计金额',
          value: '{合计金额}',
          defaultValue: '123.00',
          name: 'totalPrice'
        },
        {
          type: 'braid-txt',
          isEdit: 1,
          title: '摘要',
          value: '{摘要}',
          defaultValue: '北京采购入库成都摘要',
          name: 'remark'
        },
        {
          type: 'braid-html',
          isEdit: 1,
          title: '分页',
          value: '{第##页/共##页}',
          defaultValue: '<font><span tdata=\'pageNO\'>第##页</span>/<span tdata=\'pageCount\'>共##页</span></font>',
          name: ''
        },
        {
          type: 'braid-table',
          isEdit: 0,
          title: '出库商品明细',
          name: 'details',
          value: '{details}',
          style: {},
          defaultValue: [
            {
              productName: '苹果ipone11pro',
              skuName: 'iphone11pro256g',
              specModel: '165L',
              quantity: 3,
              snCode: '[SPP1Y79G1]',
              price: '23.00'
            },
            {
              productName: '苹果ipone11pro',
              skuName: 'iphone11pro124g',
              specModel: '165L',
              quantity: 3,
              snCode: ' [SPP1Y79G1]',
              price: '12.00'
            }

          ],
          tabelHtml: '',
          columnsAttr: [
            {
              title: '产品名称',
              value: '{产品名称}',
              name: 'productName',
            },
            {
              title: 'sku名称',
              value: '{sku名称}',
              name: 'skuName',
            },
            {
              title: '规格型号',
              value: '{规格型号}',
              name: 'specModel'
            },
            {
              title: '数量',
              value: '{数量}',
              name: 'quantity'
            },
            {
              title: '单价',
              value: '{单价}',
              name: 'price'
            },
            {
              title: '产品序列号',
              value: '产品序列号明细：<br>{产品序列号}',
              name: 'snCode',
              trSet: {
                title: '产品序列号明细:',
                col: 5,
                margin: '50px'
              },
            }
          ],
          columns: []
        }
      ],
      licenseInfo: {}
    }
  },
  methods: {
    handleSave() {
      const data = [{
        stockoutCode: 'CK2421412412423421', created: "2022-09-01 12:33:22",
        details: [{
          "productName": "苹果ipone11pro",
          "skuName": "iphone11pro256g",
          "specModel": "165L",
          "quantity": 3,
          "snCode": "[SPP1Y79G1]",
          "price": "23.00"
        }, {
          "productName": "苹果ipone22pro",
          "skuName": "iphone11pro124g",
          "specModel": "165L",
          "quantity": 5,
          "snCode": "[SPP1Y79G1]",
          "price": "12.00"
        }]
      }]
      this.$lodop.preview(this.tempValue, data);
    },
  }
}
</script>
