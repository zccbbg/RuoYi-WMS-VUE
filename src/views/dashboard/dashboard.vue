<template>
  <div class="board-container">
    <div v-if="showWhich" class="back-btn" @click="backHome"><img src="@/assets/images/home.png">返回</div>
    <img v-else src="@/assets/images/fullscreen.png" alt="" class="fullscreen-img" @click="toDataBoard" >
    <div class="time-stamp">{{ nowTime }}</div>
    <div class="board-title"><span>数据可视化平台</span></div>
    <div class="board-content flex-between">
      <div class="content-left flex-column-between">
        <div class="content-overview">
          <div class="box-title">库存总览</div>
          <div class="box-content flex-between">
            <div class="overview-object flex-column-center">
              <div class="object-count">5</div>
              <div class="object-name">仓库总数</div>
            </div>
            <div class="overview-meter flex-column-center">
              <div class="object-count">981</div>
              <div class="object-name">库位总数</div>
            </div>
            <div class="overview-alarm flex-column-center">
              <div class="object-count">4</div>
              <div class="object-name">异常库位</div>
            </div>
          </div>
        </div>
        <div class="content-status">
          <div class="box-title">监控设备状态</div>
          <div class="box-content">
            <CirclePieChart height="100%" :pieData="pieData"/>
          </div>
        </div>
        <div class="content-alarm">
          <div class="box-title">报警信息</div>
          <div class="box-content">
            <alarmInfo/>
          </div>
        </div>
      </div>
      <div class="content-middle flex-column-between">
        <div class="content-map" id="boardMap"></div>
        <div class="content-chart">
          <div class="box-title">今日仓库耗能</div>
          <div class="box-content">
            <el-tabs
              v-model="activeName"
              @tab-click="handleClick"
              class="trend-tabs"
            >
              <el-tab-pane label="综合能耗" name="total">
                <TrendLineChart
                  v-if="activeName === 'total'"
                  :height="'100%'"
                  :yName="'kgce'"
                  :xData="xData"
                  :yData="energyData"
                />
              </el-tab-pane>
              <el-tab-pane label="电" name="electricity">
                <TrendLineChart
                  v-if="activeName === 'electricity'"
                  :height="'100%'"
                  :yName="'kM·h'"
                  :xData="xData"
                  :yData="electricityData"
                />
              </el-tab-pane>
              <el-tab-pane label="水" name="water">
                <TrendLineChart
                  v-if="activeName === 'water'"
                  :height="'100%'"
                  :yName="'t'"
                  :xData="xData"
                  :yData="waterData"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="content-right flex-column-between">
        <div class="content-statistics">
          <div class="box-title">入库统计</div>
          <div class="box-content flex-between">
            <div class="statistics-item flex-column-center">
<!--              <lightning theme="outline" size="25" fill="#00d1ff"/>-->
              <div class="item-count">58</div>
              <div style="text-align: center">待入库</div>
            </div>
            <div class="statistics-item flex-column-center">
<!--              <dashboard theme="outline" size="25" fill="#00d1ff"/>-->
              <div class="item-count">10</div>
              <div style="text-align: center">待质检</div>
            </div>
            <div class="statistics-item flex-column-center">
<!--              <cycle theme="outline" size="25" fill="#00d1ff"/>-->
              <div class="item-count">5</div>
              <div style="text-align: center">待上架</div>
            </div>
          </div>
        </div>
        <div class="content-statistics">
          <div class="box-title">出库统计</div>
          <div class="box-content flex-between">
            <div class="statistics-item flex-column-center">
              <!--              <lightning theme="outline" size="25" fill="#00d1ff"/>-->
              <div class="item-count">15</div>
              <div style="text-align: center">待配货</div>
            </div>
            <div class="statistics-item flex-column-center">
              <!--              <dashboard theme="outline" size="25" fill="#00d1ff"/>-->
              <div class="item-count">10</div>
              <div style="text-align: center">待拣货</div>
            </div>
            <div class="statistics-item flex-column-center">
              <!--              <cycle theme="outline" size="25" fill="#00d1ff"/>-->
              <div class="item-count">5</div>
              <div style="text-align: center">待出库</div>
            </div>
          </div>
        </div>
        <div class="content-statistics">
          <div class="box-title">其他</div>
          <div class="box-content flex-between">
            <div class="statistics-item flex-column-center">
              <!--              <lightning theme="outline" size="25" fill="#00d1ff"/>-->
              <div class="item-count">15</div>
              <div style="text-align: center">待截单</div>
            </div>
            <div class="statistics-item flex-column-center">
              <!--              <dashboard theme="outline" size="25" fill="#00d1ff"/>-->
              <div class="item-count">10</div>
              <div style="text-align: center">异常单</div>
            </div>
            <div class="statistics-item flex-column-center">
              <!--              <cycle theme="outline" size="25" fill="#00d1ff"/>-->
              <div class="item-count">5</div>
              <div style="text-align: center">今日到货</div>
            </div>
          </div>
        </div>

        <div class="content-carbon">
          <div class="box-title">今日出入库流水</div>
          <div class="box-content">
            <barChart
              :height="'100%'"
              :barColor="['#1c508e', '#1be5e7']"
              :yName="'件'"
              :xData="xData"
              :yData="carbonData"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CirclePieChart from './components/dashboard/CirclePieChart.vue'
import alarmInfo from './components/dashboard/alarmInfo.vue'
import LineChart from './components/dashboard/LineChart.vue'
import barChart from './components/dashboard/BarChart.vue'
import TrendLineChart from './components/dashboard/TrendLineChart.vue'
import moment from 'moment'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const map = ref()
const showWhich = computed(()=>{
  return router.currentRoute.value.path === '/system/dashboard'
})
const activeName = ref('total')
const nowTime = ref()
const timer = ref()  //定时任务
const pieData = ref([])
const deviceTotal = ref(0)
const alarmTotal = ref(0)
const energyType = ref('0')
const areaId = ref(1)
const xData = ref([])
const electricityData = ref([])
const waterData = ref([])
const energyData = ref([])
const carbonData = ref([])
const electricityTotal = ref(0)
const powerTotal = ref(0)
const carbonTotal = ref(0)
const dailyP = ref({})

const router = useRouter();
function toDataBoard() {
  router.push('/system/dashboard')
}

function backHome() {
  router.push('/dashboard')
}

function getEquipmentData() {
  const res = [
    {
      'id': null,
      'name': null,
      'sn': null,
      'model': null,
      'description': null,
      'img': null,
      'qrCode': null,
      'factory': null,
      'type': null,
      'status': '0',
      'count': 10,
      'proportion': '71.43%',
      'imgOss': null,
      'areaName': null
    },
    {
      'id': null,
      'name': null,
      'sn': null,
      'model': null,
      'description': null,
      'img': null,
      'qrCode': null,
      'factory': null,
      'type': null,
      'status': '1',
      'count': 1,
      'proportion': '7.14%',
      'imgOss': null,
      'areaName': null
    },
    {
      'id': null,
      'name': null,
      'sn': null,
      'model': null,
      'description': null,
      'img': null,
      'qrCode': null,
      'factory': null,
      'type': null,
      'status': '2',
      'count': 3,
      'proportion': '21.43%',
      'imgOss': null,
      'areaName': null
    }
  ]
  pieData.value = [
    { value: res[0].count, name: '正常', itemStyle: { color: '#6be6c3' } },
    { value: res[1].count, name: '报警', itemStyle: { color: '#e0c464' } },
    { value: res[2].count, name: '离线', itemStyle: { color: '#297ef8' } }
  ]
  res.forEach(item => {
    deviceTotal.value = item.count + deviceTotal.value
  })
}

/** 查询历史报警列表 */
function getAlarmList() {
  alarmTotal.value = 4
}

// 获取区域拓扑
function getAreaList() {
  const res = [
    {
      'id': 1,
      'parentId': 0,
      'label': '科研楼',
      'weight': 0,
      'children': [
        {
          'id': '1646408966204309506',
          'parentId': 1,
          'label': '一层',
          'weight': 31,
          'children': [
            {
              'id': '1646408966204309505',
              'parentId': '1646408966204309506',
              'label': '101',
              'weight': 1
            },
            {
              'id': '1646422704076713985',
              'parentId': '1646408966204309506',
              'label': '102',
              'weight': 2
            },
            {
              'id': '1717771706262138881',
              'parentId': '1646408966204309506',
              'label': '103',
              'weight': 3
            }
          ]
        },
        {
          'id': '1648325981443239938',
          'parentId': 1,
          'label': '二层',
          'weight': 32,
          'children': [
            {
              'id': '1648326036518645761',
              'parentId': '1648325981443239938',
              'label': '201',
              'weight': 1
            },
            {
              'id': '1648326088922279937',
              'parentId': '1648325981443239938',
              'label': '202',
              'weight': 2
            },
            {
              'id': '1717771752927965186',
              'parentId': '1648325981443239938',
              'label': '203',
              'weight': 3
            },
            {
              'id': '1717771794132807682',
              'parentId': '1648325981443239938',
              'label': '204',
              'weight': 4
            }
          ]
        }
      ]
    },
    {
      'id': 3454657657688,
      'parentId': 0,
      'label': '能源分项',
      'weight': 0,
      'children': [
        {
          'id': '1698583616605478914',
          'parentId': 3454657657688,
          'label': '电',
          'weight': 0,
          'children': [
            {
              'id': '1698584115568271361',
              'parentId': '1698583616605478914',
              'label': '插座用电',
              'weight': 0
            },
            {
              'id': '1698584207037652993',
              'parentId': '1698583616605478914',
              'label': '空调用电',
              'weight': 1
            },
            {
              'id': '1698585341307478017',
              'parentId': '1698583616605478914',
              'label': '照明用电',
              'weight': 2
            },
            {
              'id': '1698585419581579266',
              'parentId': '1698583616605478914',
              'label': '特殊用电',
              'weight': 3
            }
          ]
        },
        {
          'id': '1698583808511664130',
          'parentId': 3454657657688,
          'label': '水',
          'weight': 1
        }
      ]
    }
  ]
  areaId.value = res[0].id
}

//根据能源类型查询
function getEnergyType() {
  let date = moment().format('yyyy-MM-DD HH:mm:ss')
  xData.value = []
  electricityData.value = []
  waterData.value = []
  let data = {
    energyType: energyType.value,
    areaId: areaId.value,
    nowTime: date
  }
  let res = []
  if (energyType.value == 0) {
    res = [
      '18.61',
      '21.70',
      '22.30',
      '18.20',
      '26.80',
      '21.70',
      '15.49',
      '18.60',
      '25.40',
      '20.50',
      '23.00',
      '26.41',
      '23.40',
      '16.00',
      '21.40',
      '--'
    ]
  } else if (energyType.value == 1) {
    res = [
      '1.09',
      '1.15',
      '0.99',
      '1.11',
      '1.16',
      '1.19',
      '1.08',
      '1.14',
      '1.00',
      '1.12',
      '1.13',
      '0.99',
      '1.12',
      '0.79',
      '1.10',
      '--'
    ]
  }
  if (res.length <= 0) {
    xData.value = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    return
  }
  res.forEach((item, index) => {
    xData.value.push(index)
  })
  if (energyType.value == 0) {
    electricityData.value = res
  } else if (energyType.value == 1) {
    waterData.value = res
  }
}

// 获取总能耗
function getConsumption() {
  const res = {
    'electricity': '319.51',
    'kgce': '46.97',
    'kg': '265.52'
  }
  electricityTotal.value = res.electricity
  powerTotal.value = res.kgce
  carbonTotal.value = res.kg

}

//综合能耗
function getEnergy() {
  let date = moment().format('yyyy-MM-DD HH:mm:ss')
  xData.value = []
  energyData.value = []
  carbonData.value = []
  electricityData.value = []
  waterData.value = []
  let data = {
    energyType: '0',
    areaId: areaId.value,
    nowTime: date
  }
  const res = [
    '18.61',
    '21.70',
    '22.30',
    '18.20',
    '26.80',
    '21.70',
    '15.49',
    '18.60',
    '25.40',
    '20.50',
    '23.00',
    '26.41',
    '23.40',
    '16.00',
    '21.40',
    '9.40'
  ]
  if (res.length <= 0) {
    xData.value = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    return
  }
  res.forEach((item, index) => {
    xData.value.push(index)
  })
  electricityData.value = res
  let query = {
    energyType: '1',
    areaId: areaId.value,
    nowTime: date
  }
  const request = [
    '1.09',
    '1.15',
    '0.99',
    '1.11',
    '1.16',
    '1.19',
    '1.08',
    '1.14',
    '1.00',
    '1.12',
    '1.13',
    '0.99',
    '1.12',
    '0.79',
    '1.10',
    '0.30'
  ]
  waterData.value = request
  xData.value.forEach((item, index) => {
    energyData.value.push((parseFloat(electricityData.value[index]) / 8.167 + parseFloat(waterData.value[index]) * 0.4857).toFixed(2))
    carbonData.value.push((parseFloat(electricityData.value[index]) * 0.785 + parseFloat(waterData.value[index]) * 0.91).toFixed(2))
  })
}

// 获取当日-昨日电功率曲线
function getDailyPData() {
  let param = {
    areaId: areaId.value,
    energyType: '0'
  }
  const res = {
    'todayData': [
      '2815.90',
      '2882.20',
      '2981.20',
      '2993.20',
      '2752.70',
      '2995.30',
      '2982.00',
      '2947.30',
      '2995.80',
      '2897.10',
      '2555.60',
      '2693.90',
      '2907.60',
      '2812.70',
      '2621.80',
      '2838.80'
    ],
    'yesterdayData': [
      '2863.40',
      '2962.80',
      '2651.20',
      '2939.00',
      '2520.30',
      '2992.60',
      '2793.20',
      '2927.30',
      '2933.40',
      '2695.40',
      '2916.00',
      '2755.60',
      '2439.30',
      '2793.10',
      '2990.00',
      '2677.70',
      '2748.30',
      '2588.80',
      '2848.50',
      '2751.60',
      '2965.90',
      '2978.20',
      '2945.60',
      '2931.20'
    ],
    'yesterdayMax': {
      'createBy': null,
      'createTime': '2024-09-28 05:05:02',
      'updateBy': null,
      'updateTime': '2024-09-28 05:55:02',
      'id': '1839773264591237125',
      'equipmentSn': '47HO3C3UCS',
      'energyType': '0',
      'time': '2024-09-28 05:00:00',
      'min': '131.70',
      'max': '2992.60',
      'ave': '1555.73'
    },
    'todayMax': {
      'createBy': null,
      'createTime': '2024-09-29 08:05:02',
      'updateBy': null,
      'updateTime': '2024-09-29 08:55:02',
      'id': '1840180950864539650',
      'equipmentSn': 'S5N5D8L9PE',
      'energyType': '0',
      'time': '2024-09-29 08:00:00',
      'min': '223.70',
      'max': '2995.80',
      'ave': '1183.52'
    }
  }
  let result = {
    todayData: res.todayData,
    yesterdayData: res.yesterdayData
  }
  dailyP.value = result
}

function initMap() {
  map.value = new BMapGL.Map('boardMap')

  let myIcon = new BMapGL.Icon(
    'https://szcloudpulse.com:9000/cp-portal/2023/04/27/d85f358bb44a4cf69e843acecf7b0c2c.png',
    new BMapGL.Size(23, 25),
    {
      // 指定定位位置。
      // 当标注显示在地图上时，其所指向的地理位置距离图标左上
      // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
      // 图标中央下端的尖角位置。
      // anchor: new BMapGL.Size(15, 25),
      // 设置图片偏移。
      // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
      // 需要指定大图的偏移位置，此做法与css sprites技术类似。
      // imageOffset: new BMapGL.Size(0, 0 - 25)   // 设置图片偏移
    }
  )

  // 设置中心点坐标和放大倍数
  // 以 经纬度 定位
  let point = new BMapGL.Point(120.654617, 31.268181)
  // let point2 = new BMapGL.Point(120.679607, 31.529649)
  map.value.centerAndZoom(point, 10)

  //设置地图样式
  map.value.setMapStyleV2({ styleId: 'd9955f6e8bd01669bfd15a998f109283' })
  // 以 地名 定位
  // map.value.centerAndZoom('苏州市', 12);

  map.value.enableScrollWheelZoom() //启用滚轮放大缩小，默认禁用
  map.value.enableContinuousZoom() //启用地图惯性拖拽，默认禁用

  // 标注
  let marker = new BMapGL.Marker(point, { icon: myIcon })
  map.value.addOverlay(marker)
  // 信息窗口
  let opts = {
    width: 250,
    height: 100,
    title: '武珞科技园'
  }
  // let infoWindow = new BMapGL.InfoWindow("云脉软件", opts);
  // marker.addEventListener("mouseover", function () {
  //   openInfoWindow(infoWindow);
  // });
  // // 鼠标移开标注点要发生的事
  // marker.addEventListener("mouseout", function () {
  //   closeInfoWindow(infoWindow);
  // });

  let point2 = new BMapGL.Point(120.679607, 31.529649)
  let marker2 = new BMapGL.Marker(point2, { icon: myIcon })
  map.value.addOverlay(marker2)
  let opts2 = {
    width: 250,
    height: 100,
    title: '优胜美地生产基地'
  }
  // let infoWindow2 = new BMapGL.InfoWindow("优胜美地", opts2);
  // marker2.addEventListener("mouseover", function () {
  //   openInfoWindow(infoWindow2);
  // });
  // // 鼠标移开标注点要发生的事
  // marker2.addEventListener("mouseout", function () {
  //   closeInfoWindow(infoWindow2);
  // });
}

function handleClick(tab, event) {
  if (tab.index == '0') {
    getEnergy()
  } else if (tab.index == '1') {
    energyType.value = '0'
    getEnergyType()
  } else if (tab.index == '2') {
    energyType.value = '1'
    getEnergyType()
  }
}

function getNowTime() {
  nowTime.value = moment().format('yyyy-MM-DD HH:mm:ss')
}

onMounted((() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  timer.value = setInterval(getNowTime, 1000)

  getEquipmentData()
  getAlarmList()
  getAreaList()
  nextTick((() => {
    initMap()
    getConsumption()
    getEnergy()
    getDailyPData()
  }))
}))

onBeforeUnmount(() => {
  clearInterval(timer.value)
  map.value = null
})

</script>

<style scoped>
.board-container {
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/images/board-bg.png");
  background-size: 100% 100%;
  color: #fff;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 2.5%;
  top: 5%;
  height: 3%;
  color: #00d0ff;
  font-size: 17px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.back-btn img {
  height: 100%;
  margin-right: 6px;
}

.fullscreen-img {
  position: absolute;
  left: 2.5%;
  top: 5%;
  height: 3%;
  cursor: pointer;
}

.time-stamp {
  position: absolute;
  right: 2.5%;
  top: 5%;
  color: #00d1ff;
  font-size: 20px;
}

.board-title {
  background-image: linear-gradient(to top, #2571e9, #00e7ff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-size: 40px;
  font-weight: bold;
  letter-spacing: 8px;
  height: 9%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.board-content {
  height: 86%;
  width: 95%;
  margin: 6px auto 0;
}

.content-left {
  width: calc(25% - 12px);
  margin-right: 12px;
}

.content-overview,
.content-status,
.content-alarm,
.content-statistics,
.content-trend,
.content-carbon,
.content-chart {
  background-image: url("../../assets/images/box-bg1.png");
  background-size: 100% 100%;
}

.content-overview {
  height: 20%;
  margin-bottom: 12px;
  padding: 12px 16px;
}

.box-title {
  height: 20px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  color: #01d1ff;
}

.box-title::before {
  content: " ";
  width: 6px;
  height: 100%;
  border-radius: 10px;
  display: inline-block;
  margin-right: 6px;
  background: linear-gradient(to bottom, #00d1ff, #2869e8);
}

.box-content {
  height: calc(100% - 20px);
  overflow: hidden;
  padding: 20px 10px;
}

.overview-object,
.overview-meter,
.overview-alarm {
  width: calc(33% - 10px);
  align-items: center;
  text-align: center;
}

.object-count {
  color: #1be5e7;
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 6px;
}

.object-name {
  font-size: 12px;
}

.content-status {
  height: calc(40% - 12px);
  margin-bottom: 12px;
  padding: 20px 16px;
}

.content-alarm {
  height: calc(40% - 12px);
  padding: 16px 16px;
}

.content-middle {
  width: 50%;
  margin-right: 12px;
}

.content-map {
  height: 65%;
}

.content-chart {
  height: calc(35% - 12px);
  padding: 18px 30px;
}

.content-right {
  width: calc(25% - 12px);
}

.content-statistics {
  height: 20%;
  padding: 12px 16px;
}

.content-trend {
  height: calc(40% - 12px);
  padding: 18px 16px;
}

.content-carbon {
  height: calc(40% - 12px);
  padding: 18px 16px;
}

.statistics-item {
  width: calc(33% - 8px);
  align-items: center;
  font-size: 12px;
}

.item-count {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #1be5e7;
  margin: 6px 0 6px;
}

.trend-tabs {
  height: 100%;
}
</style>
<style>
.trend-tabs,
.trend-tabs .el-tabs__content .el-tab-pane {
  height: 100%;
}

.trend-tabs .el-tabs__item {
  color: #fff;
}

.trend-tabs .el-tabs__item:hover,
.trend-tabs .el-tabs__item.is-active {
  color: #00d0fe;
}

.trend-tabs .el-tabs__active-bar {
  background-color: #00d0fe;
}

.trend-tabs .el-tabs__nav-wrap::after {
  background-color: #1d3666;
}

.trend-tabs .el-tabs__content {
  height: calc(100% - 55px);
}

/* 地图信息窗口样式修改 */
#boardMap .BMap_bubble_pop {
  background-color: rgba(28, 37, 80, 0.8) !important;
  border: 1px solid #186dbf !important;
}

#boardMap .BMap_bubble_pop img {
  display: none;
}

#boardMap .BMap_bubble_pop .BMap_bubble_top .BMap_bubble_title,
#boardMap .BMap_bubble_pop .BMap_bubble_center .BMap_bubble_content {
  color: #fff !important;
}
</style>
