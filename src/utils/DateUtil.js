/**
 * Created by lcx47996 on 2017/12/25.
 */

export function dateFormat(date, format) {
  if (!date || date === 0) {
    return ''
  }
  if (!(date instanceof Date)) {
    date = new Date(date)
    if (date.toString() === 'Invalid Date') {
      return '无效时间戳'
    }
  }
  format = format || 'yyyy-MM-dd hh:mm:ss'
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return format;
}

function getAfterDate(after) {
  var dd = new Date();
  dd.setDate(dd.getDate() + after);// 获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;// 获取当前月份的日期
  var d = dd.getDate();
  return y + '-' + m + '-' + d;
}

function getAfterDateReturnDate(datetime, after) {
  if (!(datetime.type instanceof Date)) {
    return datetime
  }
  var r = new Date(datetime.getTime())
  r.setDate(datetime.getDate() + after);// 获取AddDayCount天后的日期
  return r;
}

function getAfterHourReturnDate(datetime, after) {
  if (!(datetime.type instanceof Date)) {
    return datetime
  }
  var r = new Date(datetime.getTime() + after * 60 * 60 * 1000)
  return r;
}

function getAfterMounth(date, after) {
  var dd = new Date();
  dd.setMonth(dd.getMonth() + after);// 获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;// 获取当前月份的日期
  var d = dd.getDate();
  return y + '-' + m + '-' + d;
}

/**
 * 计算2个日期相差的天数，不包含今天，如：2016-12-13到2016-12-15，相差2天
 */
function dateDiff(startDate, endDate) {
  return parseInt((endDate - startDate) / 1000 / 60 / 60 / 24);// 把相差的毫秒数转换为天数
}

/**
 * 计算2个日期相差的天数，包含今天，如：2016-12-13到2016-12-15，相差3天
 */
function dateDiffIncludeToday(startDate, endDate) {
  return parseInt((endDate - startDate) / 1000 / 60 / 60 / 24) + 1;// 把相差的毫秒数转换为天数
}

/**
 * 获取凌晨时间
 * @param day
 */
export function getMorningTime(day = 0) {
  if (day == null) {
    return null;
  }
  const timeStamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  return new Date(timeStamp + day * 86400000);
}

export function getStartEnd(length) {
  const end = getMorningTime(0);
  const start = getMorningTime(0);
  start.setTime(start.getTime() - 3600 * 1000 * 24 * length);
  return {end, start};
}

function getTimeShort(show90 = true) {
  const timeShort = [
    {
      text: '今天',
      onClick(picker) {
        const {end, start} = getStartEnd(0);
        picker.$emit('pick', [start, end]);
      }
    },
    {
      text: '昨天',
      onClick(picker) {
        const time = getMorningTime(0);
        time.setTime(time.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', [time, time]);
      }
    },
    {
      text: '最近一周',
      onClick(picker) {
        const {end, start} = getStartEnd(7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const {end, start} = getStartEnd(30);
        picker.$emit('pick', [start, end]);
      }
    }
  ];
  if (show90) {
    timeShort.push({
      text: '最近三个月',
      onClick(picker) {
        const {end, start} = getStartEnd(90);
        picker.$emit('pick', [start, end]);
      }
    })
  }
  return timeShort;
}

function getTimeShort2(){
  const timeShort =  [
    {
      text: '今天',
      onClick(picker) {
        const temp = new Date();
        picker.$emit('pick', [new Date(temp.setHours(0, 0, 0, 0)), new Date(temp.setHours(23, 59, 59, 0))]);
      }
    },
    {
      text: '昨天',
      onClick(picker) {
        const temp = new Date();
        temp.setTime(temp.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', [new Date(temp.setHours(0, 0, 0, 0)), new Date(temp.setHours(23, 59, 59, 0))]);
      }
    },
    {
      text: '前一周',
      onClick(picker) {
        const start = new Date();
        const end = new Date();
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
        picker.$emit('pick', [new Date(start.setHours(0, 0, 0, 0)), new Date(end.setHours(23, 59, 59, 0))]);
      }
    },
    {
      text: '这个月',
      onClick(picker) {
        const end = getCurrentMonthLast();
        const start = getCurrentMonthFirst();
        picker.$emit('pick', [new Date(start.setHours(0, 0, 0, 0)), new Date(end.setHours(23, 59, 59, 0))]);

        function getCurrentMonthFirst() {
          let date = new Date();
          date.setDate(1);
          return date;
        }

        // 获取当前月的最后一天
        function getCurrentMonthLast() {
          let date = new Date();
          let currentMonth = date.getMonth();
          let nextMonth = ++currentMonth;
          let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
          let oneDay = 1000 * 60 * 60 * 24;

          return new Date(nextMonthFirstDay - oneDay);
        }
      }
    },
    {
      text: '前一个月',
      onClick(picker) {
        const start = new Date();
        const end = new Date();
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 29);
        picker.$emit('pick', [new Date(start.setHours(0, 0, 0, 0)), new Date(end.setHours(23, 59, 59, 0))]);
      }
    }
  ]
  return timeShort
}

export default {
  'getAfterDate': getAfterDate,
  'getAfterMounth': getAfterMounth,
  'dateDiff': dateDiff,
  'dateDiffIncludeToday': dateDiffIncludeToday,
  'getAfterDateReturnDate': getAfterDateReturnDate,
  'getAfterHourReturnDate': getAfterHourReturnDate,
  getTimeShort,
  getTimeShort2,
  dateFormat,
  getStartEnd,
  getMorningTime
}

