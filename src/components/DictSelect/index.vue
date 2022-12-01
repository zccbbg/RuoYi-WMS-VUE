<template>
  <el-select v-model="model" v-bind="$props" @change="valueChange" :disabled="disabled">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: ["size", "value","options","disabled"],
  data() {
    return {
      // value:this.value
    }
  },
  methods: {
    valueChange(val){
      this.$emit("change",val)
    }
  },
  computed: {
    model: {
      get() {
        return this.value+'';
      },
      set(v) {
        this.$emit("input", v);
      },
    },
  },
};
</script>
