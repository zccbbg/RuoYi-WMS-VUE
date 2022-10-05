<template>
  <div>
    <div>
      <PanelGroup></PanelGroup>
    </div>
    <div>
      <el-card style="margin: 20px 20px;font-size:14px">
        <div slot="header">
          <span>工作台</span>
        </div>
        <div></div>
      </el-card>

      <el-card style="margin: 20px 20px;font-size:14px">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-card shadow="always">
              <div slot="header">
                <span>群体事件</span>
              </div>
              <div>
                <ul>
                  <li class="li">
                    传染病
                  </li>
                  <li class="li">
                    食物中毒
                  </li>
                  <li class="li">
                    职业中毒
                  </li>
                  <li class="li">
                    水污染
                  </li>
                </ul>
                <ul>
                  <li class="da">
                    1,1257
                  </li>
                  <li class="da">
                    1,1257
                  </li>
                  <li class="da">
                    1,1257
                  </li>
                  <li class="da">
                    1,1257
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card shadow="always">
              <div slot="header">
                <span>散发事件</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin: 20px 20px;font-size:14px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-card shadow="always">
              <div slot="header">
                <span>调查单位top5</span>
              </div>
              <div></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="always">
              <div slot="header">
                <span>乡镇街道时间统计</span>
              </div>
              <div></div>
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
};
</script>

<style scoped>
.li{
  float: left;
  width: 25%;
  font-size:12px;
  color:rgb(185, 181, 189)
};
.da{
  float: left;
  width: 25%;
  font-size:18px
}
</style>
