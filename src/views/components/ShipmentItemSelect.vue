<template>
  <div class="prod-sku-select-wrapper">
    <div class="search">
      <el-form inline="inline" label-width="64">
        <el-form-item label="物料名称">
          <el-input
            class="w200"
            v-model="query.itemName"
            clearable
            placeholder="请输入物料名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="rackId">
          <wms-warehouse-cascader v-model="query.place"></wms-warehouse-cascader>
        </el-form-item>
        <el-form-item label="批次">
          <el-input
            class="w200"
            v-model="query.batch"
            clearable
            placeholder="请输入批次"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="clickQuery">查询</el-button>
      </el-form>
    </div>
    <div class="center">
      <div class="left flex-one">
        <div class="content">
          <table class="common-table" v-if="list.length !== 0">
            <tr>
              <th>
                <el-checkbox
                  :value="leftAllChecked === 1"
                  @input="leftAllChecked = $event"
                  :indeterminate="leftAllChecked === 2"
                  :disabled="editableList.length === 0"
                ></el-checkbox>
              </th>
              <th>物料名称</th>
              <th>物料编号</th>
              <th>分类</th>
              <th>规格</th>
              <th>单价</th>
              <th>单位</th>
              <th>安全库存</th>
              <th>仓库/库区</th>
              <th>批次</th>
              <th>生产日期</th>
              <th>有效期</th>
            </tr>

            <tr v-for="p in list" :key="p.id">
              <td>
                <div class="text-center">
                  <el-checkbox
                    v-model="p.checked"
                    :disabled="rightListKeySet.has(p.id)"
                  ></el-checkbox>
                </div>
              </td>
              <td>
                <div class="text-center">
                  {{ p.itemName }}
                </div>
              </td>
              <td>
                <div class="text-center">
                  {{ p.itemNo }}
                </div>
              </td>
              <td>
                <div class="text-center">
                  {{ p.itemTypeName }}
                </div>
              </td>
              <td>
                <div class="text-center">
                  {{ p.itemSpecification }}
                </div>
              </td>
              <td>
                <div class="text-center">
                  {{ p.itemUnitPrice }}
                </div>
              </td>
              <td>
                <div class="text-center">
                  {{ p.itemUnit }}
                </div>
              </td>
              <td>
                <div class="text-center">
                  {{ p.quantity }}
                </div>
              </td>
              <td width="250">
                <div class="text-center">
                  {{ p.warehouseName + '/' + p.areaName }}
                </div>
              </td>
              <td width="200">
                <div class="text-center">
                  {{ p.batch }}
                </div>
              </td>
              <td width="90">
                <div class="text-center">
                  {{ parseTime(p.productionDate, '{y}-{m}-{d}') }}
                </div>
              </td>
              <td width="90">
                <div class="text-center">
                  {{ parseTime(p.expiryDate, '{y}-{m}-{d}') }}
                </div>
              </td>
            </tr>
          </table>
          <el-empty v-else :image-size="64"></el-empty>
        </div>
      </div>
    </div>
    <pagination v-show="total > 0" :total="total" :page.sync="pageReq.page" :limit.sync="pageReq.size"
                @pagination="loadAll"/>

  </div>
</template>

<script>
import {listWmsItem} from "@/api/wms/item";
import {listWmsInventory} from "@/api/wms/inventory";
import Treeselect from "@riophae/vue-treeselect";
import {itemTypeTreeselect} from "@/api/wms/itemType";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ShipmentItemSelect",
  components: {Treeselect},
  props: ['data',],
  data() {
    return {
      //物料类别
      deptOptions: [],
      query: {
        itemType: null,
        batch: null,
        place: null,
        itemName: null
      },
      list: [],
      total: 0,
      pageReq: {
        page: 1,
        size: 10,
      },
      rightList: [],
      rightListKeySet: new Set
    };
  },
  computed: {
    leftAllChecked: {
      get() {
        return this.editableList.length > 0 &&
        this.editableList.every((it) => it.checked)
          ? 1
          : this.editableList.some((it) => it.checked)
            ? 2
            : 0;
      },
      set(v) {
        this.editableList.forEach((it) => (it.checked = v));
      },
    },
    editableList() {
      return this.list.filter((it) => !this.rightListKeySet.has(it.id));
    },
    leftCheckedList() {
      return this.list.filter((it) => it.checked);
    }
  },
  watch: {
    rightList: {
      handler(newVal, oldVal) {
        const set = new Set();
        newVal.forEach((it) => set.add(it.id));
        this.rightListKeySet = set;
      },
      deep: true
    }
  },
  created() {
    if (this.data) {
      this.initDetailsList(this.data)
    }
    this.loadAll();
    itemTypeTreeselect().then((response) => {
      this.deptOptions = response.data;
    });
  },
  methods: {
    initDetailsList(list) {
      this.rightList = list.map(it => {
        return it.prod
      })
    },
    loadAll() {
      const pageReq = {...this.pageReq};
      const copyQuery = {...this.query}
      const [warehouseId, areaId] = copyQuery.place || [];
      copyQuery.warehouseId = warehouseId;
      copyQuery.areaId = areaId;
      pageReq.page -= 1;
      listWmsInventory(copyQuery, pageReq).then((res) => {
        const {content, totalElements} = res;
        content.forEach((it) => (it.checked = false));
        this.list = content;
        this.total = totalElements;
      });
    },
    clickQuery() {
      this.pageReq.page = 1;
      this.loadAll();
    },
    getRightList() {
      this.moveRight();
      return this.rightList;
    },
    moveRight() {
      for (let it of this.leftCheckedList) {
        if (!this.rightListKeySet.has(it.id)) {
          it.checked = false;
          this.rightList.push({...it, checked: false});
        }
      }
    },
  },
};
</script>

<style lang="stylus">
.prod-sku-select-wrapper
  .center
    display flex
    align-items stretch

    .left, .right

      > div
        padding 12px

      .statistic
        border-bottom 1px solid $gray-2

      .header
        background-color $gray-1
        padding 12px

      .prods
        height 360px
        overflow-y auto

        > .prod
          padding 12px

        > .prod + .prod
          border-top 1px solid var(--gray-2)

    .ops
      display flex
      flex-direction column
      justify-content center
      margin 0 16px
</style>
