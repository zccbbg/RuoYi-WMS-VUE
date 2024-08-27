<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item label="编号" prop="merchantCode">
          <el-input
            v-model="queryParams.merchantCode"
            placeholder="请输入编号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="名称" prop="merchantName">
          <el-input
            v-model="queryParams.merchantName"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="企业类型" prop="merchantType">
          <el-select v-model="queryParams.merchantType" placeholder="请选择企业类型" clearable>
            <el-option
              v-for="dict in merchant_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt20">

      <el-row :gutter="10" class="mb8" type="flex" justify="space-between">
        <el-col :span="6"><span style="font-size: large">往来单位</span></el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['wms:merchant:add']"
          >新增</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="merchantList" border class="mt20" empty-text="暂无往来单位">
        <el-table-column label="id" prop="id" v-if="false"/>
        <el-table-column label="编号" prop="merchantCode" />
        <el-table-column label="名称" prop="merchantName" />
        <el-table-column label="企业类型" prop="merchantType">
          <template #default="scope">
            <dict-tag :options="merchant_type" :value="scope.row.merchantType"/>
          </template>
        </el-table-column>
        <el-table-column label="级别" prop="merchantLevel" />
        <el-table-column label="联系人" prop="contactPerson" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作" align="right" class-name="small-padding fixed-width">
            <template #default="scope">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wms:merchant:edit']">修改</el-button>
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wms:merchant:remove']">删除</el-button>
            </template>
        </el-table-column>
      </el-table>

      <el-row>
        <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-row>

    </el-card>
    <!-- 添加或修改往来单位对话框 -->
    <el-drawer :title="title" v-model="open" append-to-body size="50%">
      <el-form ref="merchantRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编号" prop="merchantCode">
          <el-input v-model="form.merchantCode" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="名称" prop="merchantName">
          <el-input v-model="form.merchantName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="企业类型" prop="merchantType">
          <el-select v-model="form.merchantType" placeholder="请选择企业类型">
            <el-option
              v-for="dict in merchant_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="级别" prop="merchantLevel">
          <el-input v-model="form.merchantLevel" placeholder="请输入级别" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="银行账户" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入银行账户" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="座机号" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入座机号" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="请输入Email" />
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
    </el-drawer>
  </div>
</template>

<script setup name="Merchant">
import { listMerchant, getMerchant, delMerchant, addMerchant, updateMerchant } from "@/api/wms/merchant";
import {ElMessageBox} from "element-plus";

const { proxy } = getCurrentInstance();
const { merchant_type } = proxy.useDict('merchant_type');

const merchantList = ref([]);
const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref([]);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantCode: undefined,
    merchantName: undefined,
    merchantType: undefined,
  },
  rules: {
    merchantCode: [
      { required: true, message: "编号不能为空", trigger: "blur" }
    ],
    merchantName: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    merchantType: [
      { required: true, message: "企业类型不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询往来单位列表 */
function getList() {
  loading.value = true;
  listMerchant(queryParams.value).then(response => {
    merchantList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    merchantCode: null,
    merchantName: null,
    merchantType: null,
    merchantLevel: null,
    bankName: null,
    bankAccount: null,
    address: null,
    mobile: null,
    tel: null,
    contactPerson: null,
    email: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("merchantRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加往来单位";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getMerchant(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改往来单位";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["merchantRef"].validate(valid => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id != null) {
        updateMerchant(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        }).finally(() => {
          buttonLoading.value = false;
        });
      } else {
        addMerchant(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        }).finally(() => {
          buttonLoading.value = false;
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('确认删除往来单位【' + row.merchantName + '】吗？').then(function() {
    return delMerchant(_ids);
  }).then((res) => {
    loading.value = true;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch((e) => {
    if (e === 409) {
      return ElMessageBox.alert(
        '<div>往来单位【' + row.merchantName + '】已有业务数据关联，不能删除 ！</div><div>请联系管理员处理！</div>',
        '系统提示',
        {
          dangerouslyUseHTMLString: true,
        }
      )
    }
  }).finally(() => {
    loading.value = false;
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wms/merchant/export', {
    ...queryParams.value
  }, `merchant_${new Date().getTime()}.xlsx`)
}

getList();
</script>
