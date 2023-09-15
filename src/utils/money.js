//主函数
export function digitalToChinese(n) {
  console.log('数字：', n)
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
    return "";
  console.log('数字继续执行：', n)
  var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
  n += "00";
  var p = n.indexOf('.');
  if (p >= 0)
    n = n.substring(0, p) + n.substr(p+1, 2);
  unit = unit.substr(unit.length - n.length);
  for (var i=0; i < n.length; i++)
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  console.log('转换前：', str)
  return str.replace(/零元零角零分/g, "元").replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元");
}
