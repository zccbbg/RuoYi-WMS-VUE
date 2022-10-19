<template lang="pug">
.number-range-wrapper
  el-input.start(:value="value1[0]" @input="changeVal(0, $event)" placeholder="起始值")
  .c-line
    span -
  el-input.end(:value="value1[1]" @input="changeVal(1, $event)" placeholder="结束值")
</template>

<script>
export default {
  name: 'NumberRange',
  props: {
    value: {
      type: Array,
      default: []
    }
  },
  computed: {
    value1: {
      get() {
        return this.value || []
      },
      set(v) {
        this.$emit('input', v);
      }
    }
  },
  methods: {
    changeVal(idx, v) {
      const val = [...this.value1];
      val[idx] = v ? Number(v) : null;
      this.value1 = val;
    }
  }
}
</script>

<style lang="stylus">
.number-range-wrapper
  max-width 240px
  display inline-flex
  align-items stretch
  line-height 1
  .c-line
    border-top 1px solid #DCDFE6
    border-bottom 1px solid #DCDFE6
    padding 0 8px
    margin 0 -1px
    color #DCDFE6
    z-index 1
    background-color white
    display inline-flex
    align-items center
    user-select none
  .start
    .el-input__inner
      border-top-right-radius 0!important
      border-bottom-right-radius 0!important
      &:hover
        z-index 2
  .end
    .el-input__inner
      border-top-left-radius 0!important
      border-bottom-left-radius 0!important
      &:hover
        z-index 2
</style>
