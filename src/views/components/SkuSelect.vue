<template>
  <el-dialog :model-value="show" title="商品选择" :width="width" @close="handleCancelClick" :close-on-click-modal="false" append-to-body>
        <el-form :inline="true" label-width="68px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="商品名称">
                <el-input v-model="query.itemName" clearable placeholder="商品名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品编码">
                <el-input class="w200" v-model="query.itemNo" clearable placeholder="商品编码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格名称">
                <el-input class="w200" v-model="query.skuName" clearable placeholder="规格名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="规格编码">
                <el-input class="w200" v-model="query.outSkuId" clearable placeholder="规格编码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="clickQuery">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
            <el-table :data="list" @selection-change="handleSelectionChange" border :row-key="getRowKey" empty-text="暂无商品" :span-method="spanMethod" v-loading="loading">
<!--              <el-table-column type="selection" width="55" :reserve-selection="true"/>-->
              <el-table-column label="商品信息" prop="itemId">
                <template #default="{ row }">
                  <div>商品名称：{{ row.itemName }}</div>
                  <div v-if="row.itemNo">商品编码：{{ row.itemNo }}</div>
                  <div v-if="row.itemBrand">商品品牌：{{ row.itemBrand }}</div>
                </template>
              </el-table-column>
              <el-table-column label="规格信息" prop="skuName">
                <template #default="{ row }">
                  <div>规格名称：{{ row.skuName }}</div>
                  <div v-if="row.outSkuId">规格编码：{{ row.outSkuId }}</div>
                </template>
              </el-table-column>
              <el-table-column label="长宽高(cm)" align="right" width="250">
                <template #default="{ row }">
                  <div>{{ getVolumeText(row) }}</div>
                </template>
              </el-table-column>
              <el-table-column label="重量(kg)"  prop="weight" width="120" align="right">
                <template #default="{ row }">
                  <div>{{ (row.weight || row.weight === 0) ? row.weight : '' }}</div>
                </template>
              </el-table-column>
              <el-table-column label="数量" prop="quantity" align="center">
                <template #default="scope">
                  <el-input-number :step="1" :min="1" v-model="scope.row.quantity"/>
                </template>
              </el-table-column>
            </el-table>
      <pagination :hide-on-single-page="true" :total="total" :page-sizes="[5, 10, 20, 50]" v-model:limit="pageReq.size" v-model:page="pageReq.page"
                   @pagination="getList" class="mr10"/>
    <template v-slot:footer>
      <div style="width: 100%;display: flex;justify-content: space-between">
        <span>
          <el-button @click="goCreateItem" icon="Plus">创建商品</el-button>
          <el-button @click="loadAll" icon="Refresh">刷新</el-button>
        </span>
        <span>
          <el-button @click="handleCancelClick">取消</el-button>
          <el-button type="primary" @click="handleOkClick">确认</el-button>
      </span>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts" name="SkuSelect">
import {computed, getCurrentInstance, onMounted, reactive, ref} from 'vue';
import {ElForm} from "element-plus";
import {getRowspanMethod} from "@/utils/getRowSpanMethod";
import {listItemSkuPage} from "@/api/wms/itemSku";
import {useRouter} from "vue-router";
const { proxy } = getCurrentInstance()

const spanMethod = computed(() => getRowspanMethod(list.value, ['itemId']))
const router = useRouter()
const loading = ref(false)
const deptOptions = ref([]);
const query = reactive({
  itemName: '',
  itemNo: '',
  skuName: '',
  outSkuId: ''
});
const selectItemSkuVoCheck = ref([])

const total = ref(0);
const pageReq = reactive({
  page: 1,
  size: 10,
});
const list = ref([]);
const rightList = ref([]);
const rightListKeySet = computed(() => {
  const set = new Set();
  rightList.value.forEach((it) => set.add(it.id));
  return set
});

const editableList = computed(() => {
  return list.value.filter((it) => !rightListKeySet.value.has(it.id));
});

const loadAll = () => {
  pageReq.page = 1
  const pageReqCopy = {...pageReq};
  const data = {
    ...query,
    pageNum: pageReqCopy.page,
    pageSize: pageReqCopy.size
  }
  loading.value = true
  listItemSkuPage(data).then((res) => {
    const content = [...res.rows];
    list.value = content.map((item) => ({...item, checked: false}));
    total.value = res.total;
  }).finally(() => loading.value = false);
};
const getRowKey = (row: any) => {
  return row.id;
}
const getList = () => {
  const data = {
    ...query,
    pageNum: pageReq.page,
    pageSize: pageReq.size
  }
  listItemSkuPage(data).then((res) => {
    const content = [...res.rows];
    list.value = content.map((item) => ({...item, checked: false}));
    total.value = res.total;
  });
}

const clickQuery = () => {
  pageReq.page = 1;
  loadAll();
};
const goCreateItem = () => {
  const data = proxy.$router.resolve({path: '/system/itemManage2', query: {openDrawer: true}})
  window.open(data.href, '_blank')
}
// 定义props
const props = defineProps<{
  modelValue?: boolean
  width: number | string
}>()

const show = computed(() => {
  return props.modelValue;
})

// 定义事件
const emit = defineEmits<{
  (e: 'handleCancelClick')
  (e: 'handleOkClick', value)
}>()

function handleCancelClick() {
  emit('handleCancelClick');
  clearQuantity()
}

function handleOkClick() {
  emit('handleOkClick', list.value.filter(it => it.quantity));
  clearQuantity()
}
/** 多选框选中数据 */
const handleSelectionChange = (selection) => {
  selectItemSkuVoCheck.value = selection
}

function clearQuantity() {
  list.value.forEach(it => it.quantity = undefined)
}

const getVolumeText = (row) => {
  if((row.length || row.length === 0) && (row.width || row.width === 0) && (row.height || row.height === 0)) {
    return row.length + ' * ' + row.width + ' * ' + row.height
  }
  return ((row.length || row.length === 0) ? ('长：' + row.length) : '')
    + ((row.width || row.width === 0) ? (' 宽：' + row.width) : '')
    + ((row.height || row.height === 0) ? (' 高：' + row.height) : '')
}

onMounted(() => {
  loadAll();
})
</script>

