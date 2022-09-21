<template lang="pug">
.prod-sku-select-wrapper
  .search
    el-form(inline label-width="64")
      el-form-item(label="商品类型")
        .w200
          el-select(v-model="query.itemType" clearable)
            el-option(
              v-for="dict in dict.type.wms_item_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            )
      el-form-item(label="快速筛选")
        el-input.w200(v-model="query.search" placeholder="编号、名称、ID" )
      el-button(type="primary" @click="clickQuery") 查询
  .center
    .left.flex-one
      .statistic {{total}} 个商品
      .content
        .header.flex-center
          el-checkbox(
            :value="leftAllChecked === 1"
            @input="leftAllChecked = $event"
            :indeterminate="leftAllChecked === 2"
            :disabled="editableList.length === 0")
          .flex-one.tc.ml8 商品信息
        .prods
          .prod.flex-center(v-for="p in list" :key="p.id")
            el-checkbox(
              v-model="p.checked"
              :disabled="rightListKeySet.has(p.id)"
            )
            .flex-one.flex-center(@click="p.checked = !p.checked")
              .ml8
                div {{p.itemName}}
                .mt8
                  el-tag(v-if="p.itemType" size="mini") {{p.itemType}}
                  span.ml8 {{p.itemNo}}
          el-empty(v-if="list.length === 0" :image-size="64")
      .tr
        el-pagination(
          :total="total",
          :page-size="pageReq.size"
          :current.sync="pageReq.page"
          :pageSizeOpts="[10, 20, 50, 100]"
          show-sizer
          show-total
          @on-change="handleChangePage"
          @on-page-size-change="handleChangeSize",
        )
    .ops
      div
        el-button(@click="moveRight") >
        br
        el-button.mt8(@click="moveLeft") <
    .right.flex-one
      .statistic {{rightList.length}} 个商品已选
      .content
        .header.flex-center
          el-checkbox(
            :value="rightAllChecked === 1"
            @input="rightAllChecked = $event"
            :indeterminate="rightAllChecked === 2"
            :disabled="rightList.length === 0")
          .flex-one.tc.ml8 商品信息
        .prods
          .prod.flex-center(v-for="p in rightList")
            el-checkbox(v-model="p.checked")
            .flex-one.flex-center(@click="p.checked = !p.checked")
              .ml8
                div {{p.itemName}}
                .mt8
                  el-tag(v-if="p.itemType" size="mini") {{p.itemType}}
                  span.ml8 {{p.itemNo}}
          el-empty(v-if="rightList.length === 0" :image-size="64")
</template>

<script>
import { listWmsItem } from '@/api/wms/item'

export default {
  name: "ItemSelect",
  dicts: ['wms_item_type'],
  data() {
    return {
      query: {
        itemType: null,
        search: null
      },
      list: [],
      total: 0,
      pageReq: {
        page: 1,
        size: 10
      },
      rightList: []
    }
  },
  computed: {
    leftAllChecked: {
      get() {
        return this.editableList.length > 0 && this.editableList.every(it => it.checked) ? 1
          : this.editableList.some(it => it.checked) ? 2 : 0
      },
      set(v) {
        this.editableList.forEach(it => it.checked = v)
      }
    },
    rightAllChecked: {
      get() {
        return this.rightList.length > 0 && this.rightList.every(it => it.checked) ? 1
          : this.rightList.some(it => it.checked) ? 2 : 0
      },
      set(v) {
        this.rightList.forEach(it => it.checked = v)
      }
    },
    editableList() {
      return this.list.filter(it => !this.rightListKeySet.has(it.id));
    },
    leftCheckedList() {
      return this.list.filter(it => it.checked)
    },
    rightListKeySet() {
      const set = new Set()
      this.rightList.forEach(it => set.add(it.id))
      return set
    }
  },
  created() {
    this.loadAll()
  },
  methods: {
    loadAll() {
      const pageReq = {...this.pageReq}
      pageReq.page -= 1
      listWmsItem(this.query, pageReq).then(res => {
        const {content, totalElements} = res
        content.forEach(it => it.checked = false)
        this.list = content
        this.total = totalElements
      })
    },
    clickQuery() {
      this.pageReq.page = 1;
      this.loadAll()
    },
    handleChangePage(p) {
      this.pageReq.page = p
      this.loadAll()
    },
    handleChangeSize(s) {
      this.pageReq = {
        page: 1,
        size: s
      }
      this.loadAll()
    },
    moveRight() {
      for (let it of this.leftCheckedList) {
        if (!this.rightListKeySet.has(it.goodsId)) {
          it.checked = false
          this.rightList.push({...it, checked: false})
        }
      }
    },
    moveLeft() {
      for (let i = this.rightList.length - 1; i >= 0; i--) {
        if (this.rightList[i].checked) {
          this.rightList.splice(i, 1);
        }
      }
    }
  }
}
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
