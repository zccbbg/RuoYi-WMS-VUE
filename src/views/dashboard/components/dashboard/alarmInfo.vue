<template>
  <div class="alarmInfo-container">
    <Vue3SeamlessScroll :list="alarmList" :hover="true" :step="0.4"  :wheel="true" :isWatch="true" :limitScrollNum="4" style="height: 100%;overflow:hidden;">
      <div class="alarm-item" v-for="(item, index) in alarmList" :key="index">
        <div class="flex-between mb5">
          <span class="alarm-name">{{item.area}}</span>
          <span>{{item.alarmTime}}</span>
        </div>
        <div class="flex-between">
          <span>{{item.alarmInfo}}</span>
          <div class="item-level" :class="changeAlarmBg(item.alarmLevel)">{{getLevel(item.alarmLevel)}}</div>
        </div>
      </div>
    </Vue3SeamlessScroll>
  </div>
</template>

<script setup>
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { onMounted, ref } from 'vue'

const alarmList = ref([])

function getAlarmList(){
  alarmList.value = [
    {
      "id": "1840213663235485697",
      "paramName": "1",
      "alarmTime": "2024-09-29 10:15:00",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "电能质量分析仪\t",
      "equipment": "Z2QB379B5N",
      "alarmVal": "19.90",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    },
    {
      "id": "1840187240030449666",
      "paramName": "1",
      "alarmTime": "2024-09-29 08:30:00",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "201_电表01",
      "equipment": "S5N5D8L9PE",
      "alarmVal": "19.90",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    },
    {
      "id": "1839994717089607682",
      "paramName": "1",
      "alarmTime": "2024-09-28 19:45:00",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "电能质量分析仪\t",
      "equipment": "ZNVZW4GQWX",
      "alarmVal": "20.00",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    },
    {
      "id": "1839885251761451010",
      "paramName": "1",
      "alarmTime": "2024-09-28 12:30:01",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "102_电表01",
      "equipment": "X2NWV79B5N",
      "alarmVal": "19.90",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    },
    {
      "id": "1839685181418024961",
      "paramName": "1",
      "alarmTime": "2024-09-27 23:15:00",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "电能质量分析仪\t",
      "equipment": "ZNVZW4GQWX",
      "alarmVal": "60.10",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    },
    {
      "id": "1839621009783173122",
      "paramName": "1",
      "alarmTime": "2024-09-27 19:00:00",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "201_电表01",
      "equipment": "S5N5D8L9PE",
      "alarmVal": "60.00",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    },
    {
      "id": "1839549288870883329",
      "paramName": "1",
      "alarmTime": "2024-09-27 14:15:00",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "201_电表01",
      "equipment": "S5N5D8L9PE",
      "alarmVal": "20.00",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    },
    {
      "id": "1839386971331932162",
      "paramName": "1",
      "alarmTime": "2024-09-27 03:30:00",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "102_电表01",
      "equipment": "X2NWV79B5N",
      "alarmVal": "60.00",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    },
    {
      "id": "1838545169708265474",
      "paramName": "1",
      "alarmTime": "2024-09-24 19:45:00",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "\r\n202_电表01",
      "equipment": "IZVFH3HLRJ",
      "alarmVal": "20.00",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    },
    {
      "id": "1838484776164044802",
      "paramName": "1",
      "alarmTime": "2024-09-24 15:45:00",
      "alarmInfo": "电流值达到临界值",
      "alarmLevel": "0",
      "area": "201_电表01",
      "equipment": "S5N5D8L9PE",
      "alarmVal": "60.10",
      "count": null,
      "proportion": null,
      "lastCount": null,
      "name": null
    }
  ]
}

function changeAlarmBg(level) {
  switch (level) {
    case '0':
      return 'alarm-normal'
    case '1':
      return 'alarm-warning'
    case '2':
      return 'alarm-danger'
    default:
      break;
  }
}
function getLevel(level) {
  switch (level) {
    case '0':
      return '一般'
    case '1':
      return '紧急'
    case '2':
      return '严重'
    default:
      break;
  }
}

onMounted(()=>{
  getAlarmList()
})
</script>

<style lang='scss' scoped>
.alarmInfo-container {
  width: 100%;
  height: 100%;
  padding: 12px 12px 0;
  font-size: 14px;

  .alarm-item {
    padding: 12px 0;
    border-bottom: 1px solid;
    border-image: linear-gradient(90deg, #00d0fe 0%, #286be9 50%, #00d0fe 100%) 2 2 2 2;;

    .alarm-name {
      // color: var(--current-color);
      font-weight: bold;
      color: #00d0fe;
    }

    .item-level {
      padding: 2px 8px;
      font-size: 13px;
      color: #fff;
      // background: #f56c6c;
      border-radius: 10px 0 10px 0;
    }
    .alarm-normal {
      background: #67c23a;
    }
    .alarm-warning {
      background: #e6a23c;
    }
    .alarm-danger {
      background: #f56c6c;
    }
  }
}
</style>
