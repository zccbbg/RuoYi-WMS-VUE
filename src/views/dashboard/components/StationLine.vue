<template>
  <div :class="className" ref="charRef" :style="{height:height,width:width}" />
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
        yData: [79,65, 21, 67, 21, 89, 56],
        xData: ['09-22','09-23','09-24','09-25','09-26','09-27','09-28']
      }
    }
    // required: true
  },
  yName: {
    type: String,
    default: '次'
  },
  xName: {
    type: String,
    default: '日'
  },
  seriesName: {
    type: String,
    default: '充电次数'
  },
  itemColor: {
    type: String,
    default: ''
  }
});

const chart = ref(null);

const charRef = ref(null)

watch(()=>props.chartData, (value) => {
  nextTick(() => {
    if (!chart.value) {
      return;
    }
    setOptions();
  });
})

onMounted(()=>{
  nextTick(()=>{
    initChart()
  })
})

onBeforeUnmount(()=>{
  if (!chart.value) {
    return
  }
  chart.value.dispose()
  chart.value = null
})

function initChart() {
  chart.value = echarts.init(charRef.value, 'lightTheme')
  setOptions()
}
function setOptions() {
  chart.value.setOption({
    xAxis: {
      name: props.xName,
      data: props.chartData.xData,
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      top: '15%',
      left: '2%',
      right: '10%',
      bottom: '0%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    dataZoom: {
      show: true,
      type: 'inside'
    },
    yAxis: {
      name: props.yName,
      axisTick: {
        show: false
      }
    },
    series: [{
      name: props.seriesName,
      itemStyle: {
        color: props.itemColor,
      },
      lineStyle: {
        // color: '#FF005A',
        width: 4
      },
      areaStyle: {
        opacity: 0.6,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: props.itemColor
          },
          {
            offset: 1,
            color: 'rgba(255, 255, 255, .255)'
          }
        ])
      },
      smooth: true,
      type: 'line',
      data: props.chartData.yData,
      animationDuration: 1500,
      animationEasing: 'cubicInOut',
    }]
  })
}
</script>
