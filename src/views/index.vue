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
          <img src="./pic/1.png" alt="" style="width: 50px; height: 50px" />
          <p>超级管理员，下午好</p>
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
                <el-table style="width: 100%" :data="tableData" :row-class-name="tableRowClassName">
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
        }]
      }
    },
  methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        }
        return '';
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
}
.el-table .warning-row {
    background: rgb(39, 138, 230);
  }
</style>
