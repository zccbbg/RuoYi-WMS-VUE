export function getWarehouseAndSkuKey (row) {
  return row.warehouseId + '_' + row.skuId
}

export function getSourceWarehouseAndSkuKey (row) {
  return row.sourceWarehouseId + '_' + row.skuId
}
