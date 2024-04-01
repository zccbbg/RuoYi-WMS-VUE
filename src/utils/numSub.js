export function numSub(num1, num2) {
    let baseNum1
    let baseNum2
    try {
      baseNum1 = num1.toString().split('.')[1].length
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length
    } catch (e) {
      baseNum2 = 0
    }
    const baseNum = Math.pow(10, Math.max(baseNum1, baseNum2)) // 10的二次方 = 100
    const precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2 // 精度 // 2
    return Number(((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision))
  }