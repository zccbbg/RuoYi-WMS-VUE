<template lang="pug">
  .home-wrapper
    mixin info
      el-popover.ml5(content="功能开发中" placement="top" trigger="hover")
        i.el-icon-warning-outline(slot="reference")
    el-card(style="margin: 20px 20px; font-size: 14px")
      div(slot="header")
        span 工作台
      .first
        img(
          alt=""
          :src="avatar"
          style="width: 50px; height: 50px; float:left; margin-right:10px;border-radius:50%"
        )
        p(style="font-size:16px;margin-bottom:8px") {{name}}，{{hello}}
        p(style="font-size:12px;color:rgb(185, 181, 189)") 今天是：{{nowTime}}
      .first
        ul
          li.li(style="width: 33%") 仓库
            +info
          li.li(style="width: 33%") 库区
            +info
          li.li(style="width: 33%") 货架
            +info
        ul
          li.da(style="width: 33%")
            router-link(to="/basic/warehouse") 10
          li.da(style="width: 33%")
            router-link(to="/basic/area") 20
          li.da(style="width: 33%")
            router-link(to="/basic/rack") 30
    el-row.pl20.pr20(:gutter="10")
      el-col(:span="8")
        el-card(shadow="always" style="padding-bottom: 20px")
          div(slot="header")
            span 预警/到期
          ul
            li.li(style="width: 50%") 库存预警
              +info
            li.li(style="width: 50%") 库存到期
              +info
          ul
            li.da(style="width: 50%") 10
            li.da(style="width: 50%") 5
      el-col(:span="16")
        el-card(shadow="always" style="padding-bottom: 20px")
          div(slot="header")
            span 客户/供应商/承运商/物料
          div
            ul
              li.li 客户
                +info
              li.li 供应商
                +info
              li.li 承运商
                +info
              li.li 物料
                +info
            ul
              li.da
                router-link(to="/relation/customer") 50
              li.da
                router-link(to="/relation/supplier") 5
              li.da
                router-link(to="/relation/carrier") 4
              li.da
                router-link(to="/item") 24
    el-card(style="margin: 20px 20px; font-size: 14px")
      div(slot="header")
        span 发展历程
      el-timeline
        el-timeline-item(placement="top" timestamp="2018年")
          el-card
            h4 参与京东服务市场商品分析应用开发，参与京东服务市场会员积分应用开发
        el-timeline-item(placement="top" timestamp="2019年")
          el-card
            h4 参与京东服务市场商品搬家应用开发，参与京东服务市场商品搬家应用开发，参与拼多多服务市场订单应用开发
        el-timeline-item(placement="top" timestamp="2020年")
          el-card
            h4 所参与开发的拼多多订单应用排名服务市场类目第一，开始快手服务市场订单应用开发
        el-timeline-item(placement="top" timestamp="2021年")
          el-card
            h4 日处理拼多多订单200万条，开始美团、饿了么应用市场应用开发
        el-timeline-item(placement="top" timestamp="2022年")
          el-card
            h4 累计服务10万+电商平台店铺、5万+外卖店铺。开始抖音、淘宝服务市场订单应用开发，开源ruoyi-wms
</template>

<script>
import PanelGroup from '@/views/components/PanelGroup'
import { mapGetters } from 'vuex'

export default {
  components: {
    PanelGroup
  },
  data() {
    return {
      tableData: [{
        date: '1',
        name: '应急',
        address: '20'
      }],
      nowTime: '',
      hello: ''
    }
  },
  computed: {
    ...mapGetters(['avatar', 'name'])
  },
  created() {
    this.showTimes()
    this.helloTimes()
  },
  methods: {

    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear()
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? '0' + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1
      let date =
        new Date(timeStamp).getDate() < 10
          ? '0' + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate()
      let hh =
        new Date(timeStamp).getHours() < 10
          ? '0' + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours()
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? '0' + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes()
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? '0' + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds()
      let week = new Date(timeStamp).getDay()
      let weeks = ['日', '一', '二', '三', '四', '五', '六']
      let getWeek = '星期' + weeks[week]
      this.nowTime =
        year +
        '年' +
        month +
        '月' +
        date +
        '日' +
        ' ' +

        getWeek
    },
    showTimes() {
      this.timeFormate(new Date())
//       if(date.getHours()>=0&&date.getHours()<12){

// 　　　　this.hello="上午好"

// 　　}else if(date.getHours()>=12&&date.getHours()<18){

// 　　　　this.hello="下午好"

// 　　}else{

// 　　　　this.hello="晚上好"

// 　　}

    },
    helloTimes() {
      let hh = new Date().getHours()
      if (0 < hh < 12) {
        this.hello = '上午好'
      } else if (hh < 18) {
        this.hello = '下午好'
      } else {
        this.hello = '晚上好'
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.home-wrapper

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
