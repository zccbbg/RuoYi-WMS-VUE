<template>
  <el-cascader
    placeholder="请选择仓库信息"
    :options="options"
    v-model="selections"
    :props="{
      checkStrictly: showAllLevels,
      multiple: multiple
    }"
    :clearable="clearable"
    :size="size"
    :disabled="disabled"
    :show-all-levels="showAllLevels"
    filterable
    ref="cascader"
    @visible-change="v => visibleChange(v,'cascader',  'ship')"
  ></el-cascader>
</template>

<script>
import {$emit} from '@/utils/gogocodeTransfer'
import {mapState} from 'pinia'
import {useWmsStore} from '@/store/modules/wms'
export default {
  props: {
    value: {
      type: [String, Number, Array],
      default: null,
    },
    size: {
      type: String,
      default: 'default',
    },
    showAllLevels: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
    }
  },
  computed: {
    ...mapState(useWmsStore, ['areaList', 'warehouseList']),
    selections: {
      get() {
        return this.value
      },
      set(v) {
        $emit(this, 'update:value', v)
      },
    },
  },
  watch: {
    warehouseList: {
      handler(newVal, oldVal) {
        this.setOptions()
      },
      immediate: true,
      deep: true
    },
    areaList: {
      handler(newVal, oldVal) {
        this.setOptions()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.setOptions()
    window.goWarehouse = this.onClickAdd
    window.refreshPlace = this.onClickRefresh
  },
  methods: {
    visibleChange(visible, refName, type) {
      ///system/warehouse
      if (visible) {
        const ref = this.$refs[refName];
        let popper = ref.popperPaneRef;
        if (!Array.from(popper.children).some(v => v.className === 'bkp_add_fixed_bottom_select') && this.currUser.isAssociatedAll) {
          const el = document.createElement('div');
          el.className = 'bkp_add_fixed_bottom_select';
          el.style=`
                          font-size: 14px;
                          font-weight: 100%;
                          height: 42px;
                          color: #409eff;
                          display: flex;
                          width: 180px;
                          align-items: center;
                          justify-content: space-between;
                          padding-top:4px;
                          border-top:1px solid rgb(240 242 245)
                    `
          el.innerHTML = `
                         <el-button type="primary" style="cursor: pointer" class="ml10" onclick="goWarehouse()">新增</el-button>
                         <el-button type="primary" style="cursor: pointer" onclick="refreshPlace()" class="mr10">刷新</el-button>
                      `;
          popper.appendChild(el);
          // el.onclick = () => {
          //   // 底部按钮的点击事件 点击后想触发的逻辑也可以直接写在这
          //   this.onClickAdd();
          //   ref.visible = false;
          // };
        }
        //#endregion
      }
    },
    onClickAdd() {
      //跳转到新增仓库页面
      const newUrl = this.$router.resolve({
        path: '/system/warehouse'
      })
      window.open(newUrl.path, '_blank')
    },
    onClickRefresh() {
      useWmsStore().getWarehouseList();
      useWmsStore().getAreaList();
    },
    setOptions() {
      console.log('setOption')
      let areaMap = new Map()
      let warehouseMap = new Map()
      this.areaList.forEach((area) => {
        let children = warehouseMap.get(area.warehouseId)
        if (!children) {
          children = []
          warehouseMap.set(area.warehouseId, children)
        }
        children.push({
          value: area.id,
          label: area.areaName,
          children: areaMap.get(area.id),
        })
      })
      const tempOptions = this.warehouseList.map((warehouse) => {
        return {
          value: warehouse.id,
          label: warehouse.warehouseName,
          children: warehouseMap.get(warehouse.id),
        }
      })
      if (!this.showAllLevels) {
        this.options = tempOptions.filter(it => it.children)
      } else {
        this.options = tempOptions
      }
    },
  },
  emits: ['update:value'],
}
</script>
