<template>
  <div>
    <div>
      <el-card style="margin: 20px 20px; font-size: 14px">
        <div slot="header">
          <span>工作台</span>
        </div>
        <div class="first">
          <img src="./pic/1.png" alt="" style="width: 50px; height: 50px; float:left; margin-right:10px;border-radius:50%" />
          <p style="font-size:16px;margin-bottom:8px">超级管理员，{{hello}}</p>
          <p style="font-size:12px;color:rgb(185, 181, 189)">今天是：{{nowTime}}</p>
        </div>
        <div class="first">
          <ul>
            <li class="li" style="width: 33%">仓库</li>
            <li class="li" style="width: 33%">库区</li>
            <li class="li" style="width: 33%">货架</li>
          </ul>
          <ul>
            <li class="da" style="width: 33%">10</li>
            <li class="da" style="width: 33%">20</li>
            <li class="da" style="width: 33%">30</li>
          </ul>
        </div>
      </el-card>

      <el-card style="margin: 20px 20px; font-size: 14px">
        <el-row :gutter="10">
           <el-col :span="8">
            <el-card shadow="always" style="padding-bottom: 20px">
              <div slot="header">
                <span>预警/到期</span>
              </div>
              <ul>
                <li class="li" style="width: 50%">库存预警</li>
                <li class="li" style="width: 50%">库存到期</li>
              </ul>
              <ul>
                <li class="da" style="width: 50%">10</li>
                <li class="da" style="width: 50%">5</li>
              </ul>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card shadow="always" style="padding-bottom: 20px">
              <div slot="header">
                <span>客户/供应商/承运商/物料</span>
              </div>
              <div>
                <ul>
                  <li class="li">客户</li>
                  <li class="li">供应商</li>
                  <li class="li">承运商</li>
                  <li class="li">物料</li>
                </ul>
                <ul>
                  <li class="da">50</li>
                  <li class="da">5</li>
                  <li class="da">4</li>
                  <li class="da">24</li>
                </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin: 20px 20px; font-size: 14px">
        <div slot="header">
          <span>发展历程</span>
        </div>
        <el-timeline>
          <el-timeline-item timestamp="2018年" placement="top">
            <el-card>
              <h4>参与京东服务市场商品分析应用开发，参与京东服务市场会员积分应用开发</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2019年" placement="top">
            <el-card>
              <h4>参与京东服务市场商品搬家应用开发，参与京东服务市场商品搬家应用开发，参与拼多多服务市场订单应用开发</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2020年" placement="top">
            <el-card>
              <h4>所参与开发的拼多多服务市场订单应用排名类目第一，参与快手服务市场订单应用开发</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2021年" placement="top">
            <el-card>
              <h4>参与美团、饿了么应用市场应用开发</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2022年" placement="top">
            <el-card>
              <h4>参与抖音、淘宝服务市场订单应用开发，开源ruoyi-wms</h4>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script>
import PanelGroup from "@/views/components/PanelGroup";
export default {
  components: {
    PanelGroup,
  },
  data() {
      return {
        tableData: [{
          date: '1',
          name: '应急',
          address: '20'
        }],
        nowTime: "",
        hello:""
      }
    },
  created() {
    this.showTimes();
    this.helloTimes();
  },
  methods: {
      
      timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      let week = new Date(timeStamp).getDay();
      let weeks = ["日", "一", "二", "三", "四", "五", "六"];
      let getWeek = "星期" + weeks[week];
      this.nowTime=
        year +
        "年" +
        month +
        "月" +
        date +
        "日" +
        " " +
       
        getWeek;
    },
    showTimes() { 
      this.timeFormate(new Date());
//       if(date.getHours()>=0&&date.getHours()<12){

// 　　　　this.hello="上午好"

// 　　}else if(date.getHours()>=12&&date.getHours()<18){

// 　　　　this.hello="下午好"

// 　　}else{

// 　　　　this.hello="晚上好"

// 　　}

    },
   helloTimes(){
     let hh=new Date().getHours();
     if(0<hh<12){
       this.hello='上午好'
     }else if(hh<18){
       this.hello='下午好'
     }else{
       this.hello='晚上好'
     }
   }
    },
};
</script>

<style scoped>
.li {
  float: left;
  width: 25%;
  font-size: 12px;
  color: rgb(185, 181, 189);
}
.da {
  float: left;
  width: 25%;
  font-size: 20px;
}
.first {
  float: left;
  width: 50%;
  margin-bottom: 20px;
}
.el-table .warning-row {
    background: rgb(39, 138, 230);
  }
</style>
