export function getWarehouseAndSkuKey (row) {
  return row.warehouseId + '_' + row.skuId
}
