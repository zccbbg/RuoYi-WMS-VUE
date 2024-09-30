<template>
  <div :class="className" ref="stationPieRef" :style="{height:height,width:width}" />
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
    default: '300px'
  },
  unit: {
    type: String,
    default: '个'
  },
  pieData: {
    type: Array,
    default: function () {
      return [
        { value: 23, name: "园区仓" },
        { value: 11, name: "盛泽仓" },
        { value: 5, name: "常熟仓" },
        { value: 0, name: "吴江仓" },
        { value: 0, name: "南京仓" },
      ];
    },
  },
})

const chart = ref(null);
const totalCount = ref(0)
const stationPieRef = ref();

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

watch(()=>props.pieData, (value) => {
  nextTick(() => {
    if (!chart.value) {
      return;
    }
    chart.value.dispose();
    chart.value = null;
    initChart();
  });
})

function initChart() {
  chart.value = echarts.init(stationPieRef.value, 'lightTheme')

  // 计算总值
  let total = 0
  props.pieData.forEach(item => {
    total = total + item.value
  })
  totalCount.value = total

  chart.value.setOption({
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      formatter: (params) => {
        return params.seriesName + '<br/>' + params.marker + params.data.name + '： <strong>' + params.data.value + '</strong> ' + props.unit
      }
    },
    legend: {
      bottom: '0%',
      // top: '80%',
      formatter: (param) => {
        let item = props.pieData.find(c => c.name === param)
        if(!item) return ''
        let rate = !totalCount.value ? 0 : item.value / totalCount.value * 100
        return `{name|${param}}    占比： {percent|${rate.toFixed(1)}%}`
      },
      itemWidth: 14,
      itemGap: 15,
      textStyle: {
        rich: {
          name: {
            // color: '#9da0a2',
            width: 30
          },
          count: {
            // color: '#fff',
            width: 70
          },
          percent: {
            // color: '#fff',
            width: 40
          }
        },
      }
    },
    series: [
      {
        name: '分项占比',
        type: 'pie',
        radius: ['35%', '50%'],
        center: ['50%', '38%'],
        data:props.pieData,
        animationDuration: 1500,
        label: {
          // show: false,
          // formatter: '{b}:{d}%'
        },
        emphasis: {
          label: {
            fontWeight: 'bold',
            fontSize: 12
          }
        }
      }
    ]
  })
}
</script>
