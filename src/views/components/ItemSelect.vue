<template>
  <div class="prod-sku-select-wrapper">
    <div class="search">
      <el-form inline="inline" label-width="64">
        <el-form-item label="商品类型">
          <div class="w200">
            <treeselect
              v-model="query.itemType"
              :options="deptOptions"
              :show-count="true"
              placeholder="请选择分类"
            />
          </div>
        </el-form-item>
        <el-form-item label="快速筛选">
          <el-input
            class="w200"
            v-model="query.search"
            placeholder="编号、名称、ID"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="clickQuery">查询</el-button>
      </el-form>
    </div>
    <div class="center">
      <div class="left flex-one">
        <div class="statistic">{{ total }} 个商品</div>
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
            </tr>
          </table>
          <el-empty v-else :image-size="64"></el-empty>
        </div>
      </div>
    </div>
    <div>
      <el-pagination
        :total="total"
        :page-size="pageReq.size"
        :current.sync="pageReq.page"
        :pageSizeOpts="[10, 20, 50, 100]"
        show-sizer="show-sizer"
        show-total="show-total"
        @on-change="handleChangePage"
        @on-page-size-change="handleChangeSize"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { listWmsItem } from "@/api/wms/item";
import Treeselect from "@riophae/vue-treeselect";
import { itemTypeTreeselect } from "@/api/wms/itemType";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ItemSelect",
  components: { Treeselect },
  data() {
    return {
      //物料类别
      deptOptions: [],
      query: {
        itemType: null,
        search: null,
      },
      list: [],
      total: 0,
      pageReq: {
        page: 1,
        size: 10,
      },
      rightList: [],
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
    rightAllChecked: {
      get() {
        return this.rightList.length > 0 &&
          this.rightList.every((it) => it.checked)
          ? 1
          : this.rightList.some((it) => it.checked)
          ? 2
          : 0;
      },
      set(v) {
        this.rightList.forEach((it) => (it.checked = v));
      },
    },
    editableList() {
      return this.list.filter((it) => !this.rightListKeySet.has(it.id));
    },
    leftCheckedList() {
      return this.list.filter((it) => it.checked);
    },
    rightListKeySet() {
      const set = new Set();
      this.rightList.forEach((it) => set.add(it.id));
      return set;
    },
  },
  created() {
    this.loadAll();
    itemTypeTreeselect().then((response) => {
      this.deptOptions = response.data;
    });
  },
  methods: {
    loadAll() {
      const pageReq = { ...this.pageReq };
      pageReq.page -= 1;
      listWmsItem(this.query, pageReq).then((res) => {
        const { content, totalElements } = res;
        content.forEach((it) => (it.checked = false));
        this.list = content;
        this.total = totalElements;
      });
    },
    clickQuery() {
      this.pageReq.page = 1;
      this.loadAll();
    },
    handleChangePage(p) {
      this.pageReq.page = p;
      this.loadAll();
    },
    handleChangeSize(s) {
      this.pageReq = {
        page: 1,
        size: s,
      };
      this.loadAll();
    },
    getRightList() {
      this.moveRight();
      return this.rightList;
    },
    moveRight() {
      for (let it of this.leftCheckedList) {
        if (!this.rightListKeySet.has(it.goodsId)) {
          it.checked = false;
          this.rightList.push({ ...it, checked: false });
        }
      }
    },
    moveLeft() {
      for (let i = this.rightList.length - 1; i >= 0; i--) {
        if (this.rightList[i].checked) {
          this.rightList.splice(i, 1);
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
      border 1px solid $gray-2

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