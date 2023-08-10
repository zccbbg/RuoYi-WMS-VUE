/**
 * @file 出库单类型和状态的常量
 * @description 出库单类型和状态的常量
 * @createdBy Zhang Cheng
 * @createdAt 2023/08/10
 */
export const ShipmentOrderConstant = {
  // 字典 wms_shipment_type
  Type: {
    // 销售订单
    SALE: 11,
    // 外包订单
    OUTSOURCING: 12,
    // 转运订单
    TRANSFER: 13,
    // 部门订单
    DEPT: 14
  },
  // 字典 wms_shipment_status
  Status: {
    // 未出库
    NOT_IN: 11,
    // 部分出库
    PART_IN: 12,
    // 全部出库
    ALL_IN: 13,
    // 作废
    DROP: 14
  }
}
