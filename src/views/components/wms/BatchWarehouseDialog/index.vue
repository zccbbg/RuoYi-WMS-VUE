<template>
  <el-dialog :visible="visible" width="500px" title="批量设置仓库" @close="handleCancel">
    <el-form :model="form" ref="form">
      <el-form-item label="仓库/库区" prop="place" :rules="rules">
        <WmsWarehouseCascader v-model="form.place" size="small"></WmsWarehouseCascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'BatchWarehouseDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    formData: {
      type: Object,
      required: true
    },
    rules: {
      type: Array,
      default: () => [
        {required: true, message: '请选择 仓库/库区', trigger: 'blur'}
      ]
    }
  },
  computed: {
    form: {
      get() {
        return this.formData;
      },
      set(value) {
        this.$emit('update:formData', value);
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('update:visible', false);
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('confirmed');
        }
      });
    }
  }
};
</script>
