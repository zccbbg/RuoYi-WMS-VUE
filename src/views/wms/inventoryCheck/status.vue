<template>
  <div class="receipt-order-edit-wrapper app-container">
    <div class="receipt-order-content">
      <el-form label-width="108px" :model="form" ref="form" :rules="rules">
        <el-form-item label="盘点单" prop="inventoryCheckNo">
          <el-input class="w200" v-model="form.inventoryCheckNo" placeholder="盘点单" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="盘点仓库" prop="supplierId">
          <wms-warehouse-cascader disabled v-model="form.place" size="small"></wms-warehouse-cascader>
        </el-form-item>
        <el-form-item label="盈亏数" prop="inventoryCheckTotal">
          <el-input-number v-model="inventoryCheckTotal" :precision="2" disabled></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          {{ form.remark }}
        </el-form-item>
        <el-form-item label="附件" prop="attachment">
          <file-upload v-model="form.attachment" :file-type="types"></file-upload>
        </el-form-item>

      </el-form>
      <el-divider></el-divider>
      <div class="flex-center mb8">
        <div class="flex-one large-tip bolder-font">物料明细</div>

      </div>
      <div class="table">
        <table class="common-table">
          <tr>
            <th>物料编号</th>
            <th>物料名</th>
            <th>仓库/库区</th>
            <th>账面库存</th>
            <th>实际库存</th>
            <th>变化量</th>
            <th>说明</th>
          </tr>
          <tr v-for="(it, index) in form.details">
            <td align="center">{{ it.prod.itemNo }}</td>
            <td align="center">{{ it.prod.itemName }}</td>
            <td align="center">
              <WmsWarehouseCascader disabled v-model="it.place" size="small"></WmsWarehouseCascader>
            </td>
            <td align="center">
              {{ it.quantity }}
            </td>
            <td align="center">
              <el-input-number v-model="it.checkQuantity" :precision="2" :min="0" disabled
                label="请输入实际库存"></el-input-number>
            </td>
            <td align="center">
              {{ it.checkQuantity - it.quantity }}
            </td>
            <td align="center">
              <el-popover placement="left" width="300" trigger="hover" :content="it.remark" popper-class="popperOptions">
                <div class="wrap" slot="reference">
                  {{ it.remark }}
                </div>
              </el-popover>
            </td>
          </tr>
        </table>
        <el-empty v-if="!form.details || form.details.length === 0" :image-size="48"></el-empty>
      </div>
      <div class="tc mt16">
        <el-button @click="cancel" type="primary">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { randomId } from '@/utils/RandomUtils'
import ItemSelect from '@/views/components/ItemSelect'
import { getWmsInventoryCheck } from "@/api/wms/inventoryCheck";


export default {
  name: 'WmsInventoryCheck',
  components: { ItemSelect },
  data() {
    return {
      types: ['png', 'jpg', 'jpeg'],
      // 表单参数
      form: {
        details: []
      },
      // 表单校验
      rules: {}
    }
  },
  computed: {
    inventoryCheckTotal: {
      get() {
        let sum = 0;
        this.form.details.map(item => {
          if (!isNaN(parseFloat(item.checkQuantity))) {
            sum += (item.checkQuantity - item.quantity)
          }
          return item.checkQuantity
        })
        return sum
      },
      set(value) {
      }
    }
  },
  created() {
    const { id } = this.$route.query
    if (id) {
      this.loadDetail(id)
    } else {
      this.reset()
    }
  },
  methods: {
    /** 取消按钮 */
    cancel() {
      this.$tab.closeOpenPage({ path: '/inventoryCheck' })
    },
    /** 加载 盘点单详情 */
    loadDetail(id) {
      getWmsInventoryCheck(id).then(response => {
        const { details, items } = response
        const map = {};
        (items || []).forEach(it => {
          map[it.id] = it
        });
        details && details.forEach(it => it.prod = map[it.itemId])
        this.form = {
          ...response,
          details
        }
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        inventoryCheckNo: 'IV-' + randomId(),
        receiptOrderType: 1,
        supplierId: null,
        orderNo: null,
        receiptOrderStatus: 0,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        attachment: null,
        details: []
      }
      this.resetForm('form')
    }
  }
}
</script>
<style lang="stylus">
.receipt-order-edit-wrapper
  .receipt-order-content
    width 70%
    min-width 900px
    margin 0 auto
.wrap
  width 100px
  text-overflow ellipsis
  white-space nowrap
  overflow hidden
.popperOptions[x-placement^=left] .popper__arrow::after{
    border-left-color: #565D6B;
}
.popperOptions[x-placement^=right] .popper__arrow::after{
    border-right-color: #565D6B;
}
.popperOptions[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color: #565D6B;
}
.popperOptions[x-placement^=top] .popper__arrow::after{
    border-top-color: #565D6B;
}
.popperOptions{
  background-color: #565D6B;
  color: #FFFFFF;
  border: #565D6B;
}

</style>
