const downloadCSV = function (args = {}) {
  const {data, columns, filename = 'export.csv'} = args;
  if (data == null || !data.length) return

  const keys = Object.keys(data[0])

  let csv = ''
  csv += columns.join(',')
  csv += '\n'

  data.forEach(item => {
    let ctr = 0
    keys.forEach(key => {
      if (ctr > 0) csv += ',';
      let str = item[key] === '' ? '--' : item[key]
      csv += str
      ctr++
    })
    csv += '\n'
  })

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,\ufeff' + csv
  }
  const encodeData = encodeURI(csv)

  const link = document.createElement('a')
  link.setAttribute('href', encodeData)
  link.setAttribute('download', filename)
  link.click()
}

const base64 = (s) => {
  return window.btoa(unescape(encodeURIComponent(s)))
};
const exportXls = ({column, data, name}) => {
  let body = data.map(it => '<tr>' + it.map(it2 => '<td style="mso-number-format:\'\\@\';">' + it2 + '</td>').join('') + '</tr>').join(''),
    head = '<tr>' + column.map(it => '<th>' + it + '</th>').join('') + '</tr>';
  downloadXls(name, head, body);
}
/**
 *
 * @param column [{key,  name, style}]
 * @param data {[key]: value}
 * @param name 表格名称
 */
const exportXlsxCustom = ({columns, data, name}) => {
  let body = data.map(it => '<tr>' + columns.map(col => {
      if (col.style) {
        return '<td style="' + col.style + '">' + it[col.key] + '</td>';
      }
      return '<td>' + it[col.key] + '</td>'
    }).join('') + '</tr>').join(''),
    head = '<tr>' + columns.map(col => '<th>' + col.name + '</th>').join('') + '</tr>';
  downloadXls(name, head, body);
}
const downloadXls = (name = '', head, body) => {
  const cont = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${'sheet1'}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head><body><table>${head}${body}</table></body></html>`
  const href = 'data:application/vnd.ms-excel;base64,' + base64(cont);
  const filename = `${name ? name : nowTime}.xls`
  if('msSaveOrOpenBlob' in navigator){
    const blob = new Blob([cont]);
    window.navigator.msSaveOrOpenBlob(blob, filename);
    return;
  }
  // window.location.
  // 通过创建a标签实现
  var link = document.createElement('a')
  link.href = href;
  const now = new Date();
  // 对下载的文件命名
  let nowTime = `${now.getFullYear()}${(now.getMonth() + 1)}${now.getDate()}`
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
export default {
  downloadCSV,
  exportXls,
  exportXlsxCustom
}
