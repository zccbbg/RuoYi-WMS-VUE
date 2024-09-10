<template>
  <div class="app-container">
    <el-card>
      <div style="display: flex;align-items: start">
        <div>
          <div style="display: flex;justify-content: space-between;align-items: center">
            <span style="font-size: 14px;line-height: 16px">仓库列表</span>
            <el-button class="mr10" plain icon="Plus" style="font-size:12px;line-height: 14px" @click="handleAdd"
                        type="primary" size="small">新增仓库
            </el-button>
          </div>
          <el-tree
            :data="warehouseList"
            :props="{ value: 'id', label: 'warehouseName' }"
            value-key="id"
            style="width: 450px;"
            class="mr10 mt10"
            node-key="id"
            :current-node-key="defaultCheckId"
            @nodeClick="handleClickWarehouse"
            :highlight-current="true"
            draggable
            :allow-drop="collapse"
            @node-drop="handleNodeDrop"
            ref="warehouseTreeRef"
          >
            <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.data.warehouseName }}{{ node.data.warehouseCode ? ' ( 编号：' + node.data.warehouseCode + ' )' : ''}}</span>
              <span>
                <el-button link type="primary" icon="Delete" style="font-size: 12px" @click.stop="handleDelete(data)">删除</el-button>
                <el-button link type="primary" icon="Edit" style="font-size: 12px" @click.stop="handleUpdate(data)">修改</el-button>
              </span>
            </span>
            </template>
          </el-tree>
        </div>
      </div>
    </el-card>
    <!-- 添加或修改仓库对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="warehouseFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编号" prop="warehouseCode">
          <el-input v-model="form.warehouseCode" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Warehouse">
import { listWarehouse, getWarehouse, delWarehouse, addWarehouse, updateWarehouse, updateOrderNum } from '@/api/wms/warehouse';
import {getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs} from 'vue';
import {ElForm, ElMessageBox, ElTree} from 'element-plus';
import useUserStore from "@/store/modules/user";
import {useWmsStore} from "@/store/modules/wms";
const wmsStore = useWmsStore();
const { proxy } = getCurrentInstance();

const customNodeClass = (data, node) => {
  if (data.warehouseCode) {
    return 'warehouseCode';
  }
  return null
}
const warehouseList = ref([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const defaultCheckId = ref()
const queryFormRef = ref(ElForm);
const warehouseFormRef = ref(ElForm);
const warehouseTreeRef = ref(null)
const dialog = reactive({
  visible: false,
  title: ''
});
const initFormData = {
  id: undefined,
  warehouseCode: undefined,
  warehouseName: undefined,
  remark: undefined,
}
const data = reactive({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 100,
    warehouseCode: undefined,
    warehouseName: undefined,
  },
  rules: {
    id: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    warehouseName: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

// 移植
const handleClickWarehouse = (node, data)=> {
  selectedWarehouseId.value = data.data.id
}

const selectedWarehouseId = ref()


/** 查询仓库列表 */
const getList = async () => {
  const res = await listWarehouse(queryParams.value);
  warehouseList.value = res.rows;
  total.value = res.total;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  warehouseFormRef.value.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
}

// /** 多选框选中数据

/** 新增按钮操作 */
const handleAdd = async () => {

      dialog.visible = true;
      dialog.title = "添加仓库";
      nextTick(() => {
        reset();
      });
}

/** 修改按钮操作 */
const handleUpdate = (data) => {
  dialog.visible = true;
  dialog.title = "修改仓库";
  nextTick(async () => {
    reset();
    const _id = data.id
    const res = await getWarehouse(_id);
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  warehouseFormRef.value.validate(async (valid) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateWarehouse(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addWarehouse(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess(form.value.id ? '修改成功' : '新增成功');
      dialog.visible = false;
      await getList();
      await chooseFirstWarehouse(warehouseList.value);
      wmsStore.getWarehouseList()
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (data) => {
  const _ids = data.id;
  await proxy?.$modal.confirm('确认删除仓库【' + data.warehouseName + '】吗？').finally(() => loading.value = false);
  await delWarehouse(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
  await chooseFirstWarehouse(warehouseList.value);
  wmsStore.getWarehouseList()
}
const chooseFirstWarehouse = async (warehouseList) => {
  if (warehouseList && warehouseList.length !== 0) {
    const warehouseId = warehouseList[0].id;
    defaultCheckId.value = warehouseId
    warehouseTreeRef.value.setCurrentKey(defaultCheckId.value)
  }
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('wms/warehouse/export', {
    ...queryParams.value
  }, `warehouse_${new Date().getTime()}.xlsx`)
}
const collapse = (draggingNode, dropNode, type) => {
  //注掉的是同级拖拽
  if (draggingNode.level === dropNode.level && draggingNode.parent.id == dropNode.parent.id) {
      return type === 'prev' || type === 'next'
  } else {
    // 不同级进行处理
    return false
  }
}
const handleNodeDrop = async (draggingNode, dropNode, dropType, ev) => {
  ('drop', dropNode)
  ('children', dropNode.parent.data)
  await updateOrderNum(dropNode.parent.data);
}
onMounted(async () => {
  await getList();
  ('id', warehouseList.value)
  const warehouseId = warehouseList.value[0].id;
  defaultCheckId.value = warehouseId;
});
</script>
<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  display: flex;
  align-items: center;
  height: 35px;
  cursor: pointer;
}
.el-message-box__content {
  font-size: 16px;
}
</style>
