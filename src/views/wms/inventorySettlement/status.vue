<template>
  <div class="receipt-order-edit-wrapper app-container">
    <div class="receipt-order-content">
      <el-form label-width="108px" :model="form" ref="form" :rules="rules">
        <el-form-item label="结算单号" prop="inventorySettlementNo">
          <el-input
            class="w200"
            v-model="form.inventorySettlementNo"
            placeholder="结算单号"
            disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="结算周期" prop="inventorySettlementPeriod">
          <el-date-picker
            v-model="form.inventorySettlementPeriod"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="备注...100个字符以内"
            rows="3"
            maxlength="100"
            type="textarea"
            show-word-limit="show-word-limit"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="flex-center mb8">
        <div class="flex-one large-tip bolder-font">结算明细</div>
      </div>
      <div class="table">
        <table class="common-table">
          <tr>
            <th>物料信息</th>
            <th>仓库信息</th>
            <th>上期结存</th>
            <th>本期入库</th>
            <th>本期出库</th>
            <th>本期盘点</th>
            <th>本期结存</th>
          </tr>
          <tr v-for="(it, index) in form.details">
            <td align="center">{{ it.itemName }} <br>编码：{{ it.itemNo }}</td>
            <td align="center">{{ it.warehouseName }} {{ it.warehouseNo }}</td>
            <td align="center">
              {{it.previousBalance}}
            </td>
            <td align="center">
              {{it.currentEnter}}
            </td>
            <td align="center">
              {{it.currentOut}}

            </td>
            <td align="center">
              {{it.currentCheck}}
            </td>
            <td align="center">
              {{it.currentBalance}}
            </td>
          </tr>
        </table>
        <el-empty
          v-if="!form.details || form.details.length === 0"
          :image-size="48"
        ></el-empty>
      </div>

    </div>
  </div>
</template>

<script>
import {randomId} from "@/utils/RandomUtils";
import {listByTime} from "@/api/wms/inventorySettlementDetail";
import {Message} from "element-ui";
import {addOrUpdateWmsInventorySettlement, getWmsInventorySettlement} from "@/api/wms/inventorySettlement";
import moment from "moment";

export default {
  name: "WmsInventorySettle",
  data() {
    return {
      // 预设时间选择日期范围
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      types: ["png", "jpg", "jpeg"],
      // 表单参数
      form: {
        details: [],
      },
      // 表单校验
      rules: {},
    };
  },
  created() {
    const {id, settlementType} = this.$route.query;
    if (id) {
      this.loadDetail(id);
    } else {
      this.reset();
      this.form.settlementType = settlementType
      // this.loadSettlement();
    }
  },
  methods: {
    // 获取当期的结算初始列表
    startSettle() {
      let [startTime, endTime] = this.form.inventorySettlementPeriod || [];
      startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
      const rep = {startTime, endTime}
      listByTime(rep).then((response) => {
        const details = response;
        this.form = {
          ...this.form,
          details,
        };
      })
    },
    /** 取消按钮 */
    cancel() {
      const {settlementType} = this.form
      if (Number(settlementType) === 1) {
        this.$tab.closeOpenPage({path: "/settlement/inventorySettlementMonth?settlementType=1"});
      } else {
        this.$tab.closeOpenPage({path: "/settlement/inventorySettlementYear?settlementType=2"});
      }
    },
    loadSettlement() {
      listByTime().then((response) => {
        const details = response;
        this.form = {
          ...this.form,
          details,
        };
      })
    },
    /** 提交按钮 */
    submitFinishForm() {
      //结算完成22
      this.submitForm(22);
    },
    submitForm(inventorySettlementStatus = 11) {
      if (inventorySettlementStatus === 22 && this.form.details.length === 0) {
        //未添加物料
        Message({
          message: "您还未开始结算！",
          type: "error",
        });
        return false;
      }
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        const [startTime, endTime] = this.form.inventorySettlementPeriod || [];
        // moment(value).format('YYYY-MM-DD HH:mm:ss')
        this.form.inventorySettlementStartTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
        this.form.inventorySettlementEndTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
        this.form.inventorySettlementStatus = inventorySettlementStatus;


        const req = {...this.form};

        addOrUpdateWmsInventorySettlement(req).then((response) => {
          this.$modal.msgSuccess(this.form.id ? "修改成功" : "新增成功");
          this.cancel();
        });
      });
    },
    /** 加载 盘点单详情 */
    loadDetail(id) {
      getWmsInventorySettlement(id).then((response) => {
        const {details, items, inventorySettlementStartTime, inventorySettlementEndTime} = response;
        const map = {};
        (items || []).forEach((it) => {
          map[it.id] = it;
        });
        const inventorySettlementPeriod = [inventorySettlementStartTime, inventorySettlementEndTime];
        details && details.forEach((it) => (it.prod = map[it.itemId]));
        this.form = {
          ...response,
          inventorySettlementPeriod,
          details,
        };
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        inventorySettlementNo: "IS-" + randomId(),
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        inventorySettlementPeriod: null
      };
      this.resetForm("form");
    },
  },
};
</script>
<style lang="stylus">
.receipt-order-edit-wrapper
  .receipt-order-content
    width 70%
    min-width 900px
    margin 0 auto
</style>
