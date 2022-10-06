<template>
  <div>
    <div>
      <PanelGroup></PanelGroup>
    </div>
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
            <li class="li" style="width: 33%">突发卫生事件（重）</li>
            <li class="li" style="width: 33%">爆发疫情（中）</li>
            <li class="li" style="width: 33%">聚集性疫情（轻）</li>
          </ul>
          <ul>
            <li class="da" style="width: 33%">0</li>
            <li class="da" style="width: 33%">3</li>
            <li class="da" style="width: 33%">0</li>
          </ul>
        </div>
      </el-card>

      <el-card style="margin: 20px 20px; font-size: 14px">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-card shadow="always" style="padding-bottom: 20px">
              <div slot="header">
                <span>群体事件</span>
              </div>
              <div>
                <ul>
                  <li class="li">传染病</li>
                  <li class="li">食物中毒</li>
                  <li class="li">职业中毒</li>
                  <li class="li">水污染</li>
                </ul>
                <ul>
                  <li class="da">1,1257</li>
                  <li class="da">1,1257</li>
                  <li class="da">1,1257</li>
                  <li class="da">1,1257</li>
                </ul>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card shadow="always" style="padding-bottom: 20px">
              <div slot="header">
                <span>散发事件</span>
              </div>
              <ul>
                <li class="li" style="width: 50%">传染病</li>
                <li class="li" style="width: 50%">群体事件</li>
              </ul>
              <ul>
                <li class="da" style="width: 50%">1,1257</li>
                <li class="da" style="width: 50%">1,1257</li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin: 20px 20px; font-size: 14px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-card shadow="always">
              <div slot="header">
                <span>调查单位top5</span>
              </div>
              <template>
                <el-table style="width: 100%" :data="tableData" >
                  <el-table-column prop="date" label="排序" width="width" align="center">
                  </el-table-column>
                  <el-table-column prop="name" label="单位" width="width" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="事件数" width="width" align="center">
                  </el-table-column>
                </el-table>
              </template>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="always">
              <div slot="header">
                <span>乡镇街道时间统计</span>
              </div>
              <el-table style="width: 100%" :data="tableData">
                  <el-table-column prop="date" label="排序" width="width" align="center">
                  </el-table-column>
                  <el-table-column prop="name" label="单位" width="width" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="事件数" width="width" align="center">
                  </el-table-column>
                </el-table>
            </el-card>
          </el-col>
        </el-row>
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
