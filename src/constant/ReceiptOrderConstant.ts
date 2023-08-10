/**
 * @file 入库单类型和状态的常量
 * @description 入库单类型和状态的常量
 * @createdBy Zhang Cheng
 * @createdAt 2023/08/10
 */

export const ReceiptOrderConstant = {
  // 字典 wms_receipt_type
  Type: {
    // 采购
    PURCHASE: 1,
    // 外协
    OUTSOURCING: 2,
    // 退货
    RETURN: 3,
    // 盘盈入库
    CHECK_IN: 32
  },
  // 字典 wms_receipt_status
  Status: {
    // 未入库
    NOT_IN: 0,
    // 在途
    IN_PATH: 1,
    // 部分入库
    PART_IN: 2,
    // 全部入库
    ALL_IN: 3,
    // 作废
    DROP: 2
  }
}
