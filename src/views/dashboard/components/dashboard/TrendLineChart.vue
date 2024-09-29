<template>
  <div :class="className" ref="trendLineRef" :style="{height:height,width:width}" />
</template>

<script setup>
import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const animationDuration = 1000
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
    default: '300px'
  },
  yName: {
    type: String,
    default: 'kM·h'
  },
  barColor: {
    type: Array,
    default: () => {
      return ['#00d0ff','#2969e8']
    }
  },
  xData: {
    type: Array,
    default: () => {
      return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    }
  },
  yData: {
    type: Array,
    default: () => {
      return [79, 52, 200, 334, 390, 330, 34,79, 52, 123, 334, 34, 56]
    }
  },
})

const chart = ref(null)
const trendLineRef = ref()
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
watch(() => props.yData, (value) => {
  nextTick(() => {
    if (!chart.value) {
      initChart()
      return;
    }
    chart.value.dispose();
    chart.value = null;
    initChart();
  });
})
function initChart() {
  chart.value = echarts.init(trendLineRef.value)
  chart.value.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      backgroundColor: 'rgba(28, 37, 80, 0.9)',
      borderColor: '#2969e8',
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      top: '16%',
      left: '2%',
      right: '2%',
      bottom: '0%',
      containLabel: true
    },
    dataZoom: {
      show: true,
      type: 'inside'
    },
    xAxis: [{
      type: 'category',
      data: props.xData,
      axisTick: {
        alignWithLabel: true
      },
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
          color: 'rgb(0, 221, 255)'
        }
      }
    }],
    yAxis: [{
      // type: 'value',
      // name: 'kmh',
      // axisTick: {
      //   show: true
      // }
      type: 'value',
      name: props.yName,
      position: 'left',
      alignTicks: true,
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
    }],
    series: [{
      // name: 'pageA',
      type: 'line',
      stack: 'vistors',
      barWidth: '50%',
      data: props.yData,
      itemStyle: {
        color: "rgb(0, 221, 255)",
      },
      animationDuration,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)'
          },
          {
            offset: 1,
            color: 'rgba(77, 119, 255, .2)'
          }
        ]),
      },
    }]
  })
}
</script>
