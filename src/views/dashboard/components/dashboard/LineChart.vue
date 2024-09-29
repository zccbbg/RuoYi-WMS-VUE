<template>
  <div :class="className" ref="linechartRef" :style="{ height: height, width: width }"/>
</template>

<script setup>
import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  className: {
    type: String,
    default: 'chart'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '350px'
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  chartData: {
    type: Object,
    default: () => {
      return {
        yesterdayData: [
          6, 13, 9, 12, 5, 121, 152, 183, 193, 182, 163, 184, 89, 36
        ],
        todayData: [
          5, 6, 2, 16, 12, 83, 163, 179, 183, 157, 192, 141, 163, 21
        ]
      }
    }
    // required: true
  },
  yName: {
    type: String,
    default: 'kW'
  },
  xName: {
    type: String,
    default: '时'
  },
  xData: {
    type: Array,
    default: () => {
      return ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    }
  }
})
const chart = ref(null)
const linechartRef = ref()
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})
onBeforeUnmount(() => {
  if (!chart.value) {
    return
  }
  chart.value.dispose()
  chart.value = null
})
watch(() => props.chartData, (value) => {
  setOptions(value)
})

function initChart() {
  chart.value = echarts.init(linechartRef.value)
  setOptions(props.chartData)
}

function setOptions({ yesterdayData, todayData } = {}) {
  chart.value.setOption({
    xAxis: {
      name: props.xName,
      data: props.xData,
      boundaryGap: false,
      nameTextStyle: {
        color: '#fff'
      },
      splitLine: {
        lineStyle: {
          color: '#1d3666'
        }
      },
      axisLabel: {
        color: '#fff'
      },
      axisLine: {
        lineStyle: {
          color: '#00d0fe'
        }
      }
    },
    grid: {
      top: '16%',
      left: '2%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      // axisPointer: {
      //   type: 'cross'
      // },
      padding: [5, 10],
      backgroundColor: 'rgba(28, 37, 80, 0.9)',
      borderColor: '#2969e8',
      textStyle: {
        color: '#fff'
      }
    },
    dataZoom: {
      show: true,
      type: 'inside'
    },
    yAxis: {
      name: props.yName,
      nameTextStyle: {
        color: '#fff'
      },
      splitLine: {
        lineStyle: {
          color: '#1d3666'
        }
      },
      axisLabel: {
        color: '#fff'
      }
    },
    legend: {
      data: ['昨日', '当日'],
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '昨日',
        itemStyle: {
          color: '#c59af4'
        },
        smooth: true,
        type: 'line',
        symbol: 'none',
        data: yesterdayData,
        animationDuration: 1500,
        animationEasing: 'cubicInOut',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#c59af4'
            },
            {
              offset: 1,
              color: 'rgba(197, 154, 244, 0.2)'
            }
          ])
        }
      },
      {
        name: '当日',
        smooth: true,
        type: 'line',
        symbol: 'none',
        itemStyle: {
          color: '#00d0fe'
        },
        data: todayData,
        animationDuration: 1500,
        animationEasing: 'quadraticOut',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#00d0fe'
            },
            {
              offset: 1,
              color: 'rgba(0, 208, 254, 0.2)'
            }
          ])
        }
      }
    ]
  })
}
</script>
