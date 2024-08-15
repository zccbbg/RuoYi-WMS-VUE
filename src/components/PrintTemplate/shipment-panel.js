export default {
  "panels": [
    {
      "index": 0,
      "name": 1,
      "height": 297,
      "width": 210,
      "paperHeader": 49.5,
      "paperFooter": 780,
      "printElements": [
        {
          "options": {
            "left": 402.5,
            "top": 35,
            "height": 40,
            "width": 160,
            "title": "条形码",
            "barcodeType": "code128",
            "testData": "barcode",
            "textType": "barcode",
            "fields": [
              {
                "text": "出库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              }
            ],
            "field": "shipmentOrderNo",
            "coordinateSync": false,
            "widthHeightSync": false
          },
          "printElementType": {
            "title": "条形码",
            "type": "barcode"
          }
        },
        {
          "options": {
            "left": 20,
            "top": 42.5,
            "height": 27,
            "width": 350,
            "fields": [
              {
                "text": "出库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              },
              {
                "text": "仓库",
                "field": "warehouse"
              },
              {
                "text": "库区",
                "field": "area"
              }
            ],
            "title": "出库单",
            "field": "shipmentOrderNo",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 18,
            "fontWeight": "600",
            "lineHeight": 26.25,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 20,
            "top": 97.5,
            "height": 9.75,
            "width": 200,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "出库类型",
            "field": "shipmentOrderType",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0,
            "right": 139.5,
            "bottom": 108,
            "vCenter": 79.5,
            "hCenter": 103.125
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 340,
            "top": 97.5,
            "height": 9.75,
            "width": 200,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "出库状态",
            "field": "shipmentOrderStatus",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 20,
            "top": 122.5,
            "height": 9.75,
            "width": 200,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "客户",
            "field": "merchantName",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 340,
            "top": 122.5,
            "height": 9.75,
            "width": 150,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "订单号",
            "field": "orderNo",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0,
            "right": 489.75,
            "bottom": 131.25,
            "vCenter": 414.75,
            "hCenter": 126.375
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 20,
            "top": 147.5,
            "height": 9.75,
            "width": 200,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "仓库",
            "field": "warehouseName",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 340,
            "top": 147.5,
            "height": 9.75,
            "width": 150,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "库区",
            "field": "areaName",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0,
            "right": 489.75,
            "bottom": 131.25,
            "vCenter": 414.75,
            "hCenter": 126.375
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 20,
            "top": 172.5,
            "height": 9.75,
            "width": 200,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "数量",
            "field": "totalQuantity",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 340,
            "top": 172.5,
            "height": 9.75,
            "width": 150,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "金额",
            "field": "receivableAmount",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0,
            "right": 489.75,
            "bottom": 131.25,
            "vCenter": 414.75,
            "hCenter": 126.375
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 20,
            "top": 197.5,
            "height": 9.75,
            "width": 200,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "创建人",
            "field": "createBy",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 340,
            "top": 197.5,
            "height": 9.75,
            "width": 150,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "创建时间",
            "field": "createTime",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0,
            "right": 489.75,
            "bottom": 131.25,
            "vCenter": 414.75,
            "hCenter": 126.375
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 20,
            "top": 222.5,
            "height": 9.75,
            "width": 200,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "操作人",
            "field": "updateBy",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 340,
            "top": 222.5,
            "height": 9.75,
            "width": 150,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "操作时间",
            "field": "updateTime",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0,
            "right": 489.75,
            "bottom": 131.25,
            "vCenter": 414.75,
            "hCenter": 126.375
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 17.5,
            "top": 272.5,
            "height": 54,
            "width": 550,
            "field": "table",
            "groupFieldsFormatter": "function(type,options,data){ return [\"name\"] }",
            "columns": [
              [
                {
                  "width": 78.57142857142857,
                  "title": "商品名称",
                  "field": "itemName",
                  "checked": true,
                  "columnId": "itemName",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1
                },
                {
                  "width": 78.57142857142857,
                  "title": "规格名称",
                  "field": "skuName",
                  "checked": true,
                  "columnId": "skuName",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1
                },
                {
                  "width": 90,
                  "title": "库区",
                  "field": "areaName",
                  "checked": true,
                  "columnId": "areaName",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1
                },
                {
                  "width": 78.57142857142857,
                  "title": "批号",
                  "field": "batchNo",
                  "checked": true,
                  "columnId": "batchNo",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                },
                {
                  "width": 78.57142857142857,
                  "title": "生产日期",
                  "field": "productionDate",
                  "checked": true,
                  "columnId": "productionDate",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                },
                {
                  "width": 78.57142857142857,
                  "title": "过期日期",
                  "field": "expirationDate",
                  "checked": true,
                  "columnId": "expirationDate",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                },
                {
                  "width": 78.57142857142857,
                  "align": "right",
                  "title": "数量",
                  "field": "quantity",
                  "checked": true,
                  "columnId": "quantity",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                  "tableSummary": "sum",
                  "tableSummaryAlign": "right",
                  "tableSummaryNumFormat": "0"
                },
                {
                  "width": 78.57142857142857,
                  "align": "right",
                  "title": "价格(元)",
                  "field": "amount",
                  "checked": true,
                  "columnId": "amount",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                  "tableSummary": "sum",
                  "tableSummaryAlign": "right"
                },
              ]
            ]
          },
          "printElementType": {
            "title": "表格",
            "type": "table",
            "editable": true,
            "columnDisplayEditable": true,
            "columnDisplayIndexEditable": true,
            "columnTitleEditable": true,
            "columnResizable": true,
            "columnAlignEditable": true,
            "isEnableEditField": true,
            "isEnableContextMenu": true,
            "isEnableInsertRow": true,
            "isEnableDeleteRow": true,
            "isEnableInsertColumn": true,
            "isEnableDeleteColumn": true,
            "isEnableMergeCell": true
          }
        },
        {
          "options": {
            "left": 20,
            "top": 247.5,
            "height": 9.75,
            "width": 500,
            "fields": [
              {
                "text": "入库单号",
                "field": "shipmentOrderNo"
              },
              {
                "text": "客户",
                "field": "merchantName"
              },
              {
                "text": "订单号",
                "field": "orderNo"
              },
              {
                "text": "出库类型",
                "field": "shipmentOrderType"
              },
              {
                "text": "出库状态",
                "field": "shipmentOrderStatus"
              },
              {
                "text": "创建日期",
                "field": "createTime"
              },
              {
                "text": "备注",
                "field": "remark"
              }
            ],
            "title": "备注",
            "field": "remark",
            "coordinateSync": false,
            "widthHeightSync": false,
            "qrCodeLevel": 0,
            "right": 139.5,
            "bottom": 233.25,
            "vCenter": 79.5,
            "hCenter": 228.375
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        }
      ],
      "paperNumberLeft": 565.5,
      "paperNumberTop": 819,
      "paperNumberContinue": true,
      "watermarkOptions": {}
    }
  ]
};
