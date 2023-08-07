<template>
  <div class="inventory-movement-edit-wrapper app-container">
    <div class="inventory-movement-content">
      <el-form label-width="108px" :model="form" ref="form" :rules="rules">
        <el-form-item label="移库单号" prop="inventoryMovementNo">
          <el-input class="w200" v-model="form.inventoryMovementNo" placeholder="移库单号"
                    disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="备注...100个字符以内" rows="3" maxlength="100" type="textarea"
                    show-word-limit="show-word-limit"></el-input>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="flex-center mb8">
        <div class="flex-one large-tip bolder-font">物料明细</div>
        <div class="ops">
          <el-button type="primary" plain="plain" size="small" @click="showAddItem">添加物料</el-button>
        </div>
      </div>
      <div class="table">
        <table class="common-table">
          <tr>
            <th>物料名</th>
            <th>物料编号</th>
            <th>物料类型</th>
            <th>计划数量</th>
            <th>源 仓库/库区</th>
            <th>目标 仓库/库区</th>
            <th>操作</th>
          </tr>
          <tr v-for="(it, index) in form.details">
            <td align="center">{{ it.prod ? it.prod.itemName : '' }}</td>
            <td align="center">{{ it.prod ? it.prod.itemNo : '' }}</td>
            <td align="center">{{ it.prod ? it.prod.itemType : '' }}</td>
            <td align="center">
              <el-input-number v-model="it.planQuantity" placeholder="计划数量" :min="1"
                               :max="2147483647"></el-input-number>
            </td>
            <td align="center">
              <WmsWarehouseCascader v-model="it.sourcePlace" size="small"></WmsWarehouseCascader>
            </td>
            <td align="center">
              <WmsWarehouseCascader v-model="it.targetPlace" size="small"></WmsWarehouseCascader>
            </td>
            <td align="center"><a class="red" @click="form.details.splice(index, 1)">删除</a></td>
          </tr>
        </table>
        <el-empty v-if="!form.details || form.details.length === 0" :image-size="48"></el-empty>
      </div>
      <div class="tc mt16">
        <el-button type="primary" plain="plain" size="small" @click="showAddItem">添加物料</el-button>
      </div>
      <div class="tc mt16">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="submitForm" type="primary">保存</el-button>
      </div>
    </div>
    <el-dialog :visible="modalObj.show" :title="modalObj.title" :width="modalObj.width" @close="modalObj.cancel">
      <template v-if="modalObj.component === 'add-item'">
        <item-select ref="item-select" :data="this.form.details"></item-select>
      </template>
       <span slot="footer">
        <el-button v-if="modalObj.cancel" @click="modalObj.cancel">取消</el-button>
        <el-button v-if="modalObj.ok" type="primary" @click="modalObj.ok">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {addOrUpdateWmsInventoryMovement, getWmsInventoryMovement} from '@/api/wms/inventoryMovement'
import {randomId} from '@/utils/RandomUtils'
import ItemSelect from '@/views/components/ItemSelect'

export default {
  name: 'WmsMovementOrder',
  components: {ItemSelect},
  data() {
    return {
      // 表单参数
      form: {
        details: []
      },
      // 表单校验
      rules: {},
      modalObj: {
        show: false,
        title: '',
        width: '50%',
        component: null,
        model: {},
        ok: () => {
        },
        cancel: () => {
        }
      }
    }
  },
  created() {
    const {id} = this.$route.query
    if (id) {
      this.loadDetail(id)
    } else {
      this.reset()
    }
  },
  methods: {
    cancel() {
      this.$tab.closeOpenPage({path: '/wms/inventoryMovement'})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        const details = this.form.details.map(it => {
          let {sourcePlace, targetPlace} = it;
          return {
            itemId: it.prod.id,
            sourceRackId: sourcePlace ? sourcePlace[2] : null,
            sourceAreaId: sourcePlace ? sourcePlace[1] : null,
            sourceWarehouseId: sourcePlace ? sourcePlace[0] : null,
            targetRackId: targetPlace ? targetPlace[2] : null,
            targetAreaId: targetPlace ? targetPlace[1] : null,
            targetWarehouseId: targetPlace ? targetPlace[0] : null,
            planQuantity: it.planQuantity,
            realQuantity: it.realQuantity,
            moveStatus: it.moveStatus,
            delFlag: 0
          }
        })
        if (details.filter(it => !it.sourceWarehouseId || !it.targetWarehouseId)?.length > 0) {
          this.$message.warning('请选择仓库、库区或货架')
          return;
        }
        const arr = details.filter(it => it.sourceRackId === it.targetRackId && it.sourceAreaId === it.targetAreaId && it.sourceWarehouseId === it.targetWarehouseId)
        if (arr?.length > 0) {
          this.$message.warning('同一个物料不能选择相同的仓库、库区、货架')
          return;
        }
        const req = {...this.form, details}
        addOrUpdateWmsInventoryMovement(req).then(response => {
          this.$modal.msgSuccess(this.form.id ? '修改成功' : '新增成功')
          this.cancel();
        })
      })
    },
    loadDetail(id) {
      getWmsInventoryMovement(id).then(response => {
        const {details, items} = response
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
        inventoryMovementNo: 'M-' + randomId(),
        status: 21,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        details: []
      }
      this.resetForm('form')
    },
    confirmSelectItem() {
      const value = this.$refs['item-select'].getRightList()
      this.form.details = value.map(it => {
        return {
          prod: it,
          planQuantity: null,
          realQuantity: null,
          moveStatus: 21,
          delFlag: 0
        }
      })
      this.closeModal()
    },
    closeModal() {
      this.modalObj.show = false
    },
    showAddItem() {
      try {
        this.$refs['item-select'].initDetailsList(this.form.details)
      } catch (err) {

      }
      const ok = () => this.confirmSelectItem()
      const cancel = () => this.closeModal()
      this.modalObj = {
        show: true,
        title: '添加物料',
        width: '50%',
        component: 'add-item',
        model: {},
        ok,
        cancel
      }
    }
  }
}
</script>
<style lang="stylus">
.inventory-movement-edit-wrapper
  .inventory-movement-content
    width 70%
    min-width 900px
    margin 0 auto
</style>
