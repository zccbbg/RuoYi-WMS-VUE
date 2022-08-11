<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="物料编号" prop="itemNo">
        <el-input
          v-model="queryParams.itemNo"
          placeholder="请输入物料编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入物料名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料分类" prop="itemType">
        <el-select v-model="queryParams.itemType" placeholder="请选择物料分类" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="单位类别" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入单位类别"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="默认所属货架" prop="rackId">
        <el-input
          v-model="queryParams.rackId"
          placeholder="请输入默认所属货架"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="默认所属库区" prop="areaId">
        <el-input
          v-model="queryParams.areaId"
          placeholder="请输入默认所属库区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="默认所属仓库" prop="warehouseId">
        <el-input
          v-model="queryParams.warehouseId"
          placeholder="请输入默认所属仓库"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="安全库存" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入安全库存"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="有效期" prop="expiryDate">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.expiryDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择有效期">
        </el-date-picker>
      </el-form-item>
    </template>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini" @click="showMoreCondition = !showMoreCondition">{{showMoreCondition ? '收起条件' : '展开条件'}}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wms:wmsItem:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wms:wmsItem:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wms:wmsItem:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['wms:wmsItem:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wmsItemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="物料编号" align="center" prop="itemNo" v-if="columns[0].visible"/>
      <el-table-column label="物料名称" align="center" prop="itemName" v-if="columns[1].visible"/>
      <el-table-column label="物料分类" align="center" prop="itemType" v-if="columns[2].visible"/>
      <el-table-column label="单位类别" align="center" prop="unit" v-if="columns[3].visible"/>
      <el-table-column label="所属仓库" align="center" prop="warehouseName" v-if="columns[6].visible"/>
      <el-table-column label="所属库区" align="center" prop="areaName" v-if="columns[5].visible"/>
      <el-table-column label="所属货架" align="center" prop="rackName" v-if="columns[4].visible"/>
      <el-table-column label="安全库存" align="center" prop="quantity" v-if="columns[7].visible"/>
      <el-table-column label="有效期" align="center" prop="expiryDate" width="180" v-if="columns[8].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.expiryDate, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[9].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wms:wmsItem:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:wmsItem:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改物料对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="物料编号" prop="itemNo">
          <el-input v-model="form.itemNo" placeholder="请输入物料编号" />
        </el-form-item>
        <el-form-item label="物料名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="物料分类" prop="itemType">
          <el-select v-model="form.itemType" placeholder="请选择物料分类">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位类别" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位类别" />
        </el-form-item>
        <!-- <el-form-item label="默认所属仓库" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入默认所属仓库" />
        </el-form-item>
        <el-form-item label="默认所属库区" prop="areaId">
          <el-input v-model="form.areaId" placeholder="请输入默认所属库区" />
        </el-form-item>
        
        <el-form-item label="默认所属货架" prop="rackId">
          <el-input v-model="form.rackId" placeholder="请输入默认所属货架" />
        </el-form-item> -->

        <el-form-item label="所属仓库" prop="warehouseId">
        <el-select v-model="form.warehouseId"  placeholder="请输入所属仓库" clearable size="small" @change="onWarehouseChange">
          <el-option
            v-for="item in wmsWarehouseList"
            :key="item.id"
            :label="item.warehouseName"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="所属库区" prop="areaId">
        <el-select v-model="form.areaId"  placeholder="请输入所属库区" clearable size="small" @change="onAreaChange">
          <el-option
            v-for="item in wmsAreaListByWarehouse"
            :key="item.id"
            :label="item.areaName"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="所属货架" prop="rackId">
        <el-select v-model="form.rackId"  placeholder="请输入所属货架" clearable size="small" >
          <el-option
            v-for="item in wmsRackListByArea"
            :key="item.id"
            :label="item.rackName"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>


        <!-- 及联组建练习
        <div class="block">
         <el-cascader
           v-model="cascader"
           :options="areaOptions"
           
           @change="handleChange"></el-cascader>
        </div> -->

        <el-form-item label="安全库存" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入安全库存" />
        </el-form-item>
        <el-form-item label="有效期" prop="expiryDate">
          <el-date-picker clearable size="small"
                        v-model="form.expiryDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择有效期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWmsItem, getWmsItem, delWmsItem, addWmsItem, updateWmsItem, exportWmsItem } from "@/api/wms/item";
import { listWmsWarehouse } from "@/api/wms/warehouse";
import { listWmsArea } from "@/api/wms/area";
import { listWmsRack } from "@/api/wms/rack";

export default {
  name: "WmsItem",
  name: "WmsWarehouse",
  name: "WmsArea",
  name: "WmsRack",
  data() {
    return {
      // cascader:[], 
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 物料表格数据
      wmsItemList: [],
      // areaOptions:[],
      // 货架表格数据
      wmsRackList: [],
      wmsRackListByArea:[],
      wmsRackMap:new Map(),
      // 库区表格数据
      wmsAreaList: [],
      wmsAreaListByWarehouse:[],
      wmsAreaMap:new Map(),
      // 仓库表格数据
      wmsWarehouseList: [],
      wmsWarehouseMap:new Map(),
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemNo: null,
        itemName: null,
        itemType: null,
        unit: null,
        rackId: null,
        areaId: null,
        warehouseId: null,
        quantity: null,
        expiryDate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemNo: [
          { required: true, message: "物料编号不能为空", trigger: "blur" }
        ],
        itemName: [
          { required: true, message: "物料名称不能为空", trigger: "blur" }
        ],
      },
      columns: [
            { key: 1, label: "物料编号", visible:  true  },
            { key: 2, label: "物料名称", visible:  true  },
            { key: 3, label: "物料分类", visible:  true  },
            { key: 4, label: "单位类别", visible:  true  },
            { key: 5, label: "默认所属货架", visible:  true  },
            { key: 6, label: "默认所属库区", visible:  true  },
            { key: 7, label: "默认所属仓库", visible:  true  },
            { key: 8, label: "安全库存", visible:  true  },
            { key: 9, label: "有效期", visible:  true  },
                { key: 11, label: "备注", visible:  false  },
                         ],
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {

   
    // handleChange(value) {
    //     console.log(value);
    //   },

    
    onWarehouseChange(init){
      this.wmsAreaListByWarehouse=[]
      if(init!=true){
        this.form.areaId=null
      }
      this.wmsAreaList.forEach(area=>{
        if(area.warehouseId==this.form.warehouseId){
          this.wmsAreaListByWarehouse.push(area)
        }
      })
    },
    onAreaChange(init){
      this.wmsRackListByArea=[]
      if(init!=true){
        this.form.rackId=null
      }
      this.wmsRackList.forEach(rack=>{
        if(rack.areaId==this.form.areaId){
          this.wmsRackListByArea.push(rack)
        }
      })
    },

    /** 查询物料列表 */
    async getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      await this.getHouseList();
      await this.getAreaList();
      await this.getRackList();
      await listWmsItem(query, pageReq).then(response => {
        const { content, totalElements } = response
        content.forEach(item=>{
          item.warehouseName=this.wmsWarehouseMap.get(item.warehouseId)
        });
        content.forEach(item=>{
          item.areaName=this.wmsAreaMap.get(item.areaId)
        });
        content.forEach(item=>{
          item.rackName=this.wmsRackMap.get(item.rackId)
        })
        this.wmsItemList = content;
        this.total = totalElements;
        this.loading = false;
      });

      // let rackMap = new Map();
      // this.wmsRackList.forEach(rack=>{
      //   let list=rackMap.get(rack.areaId)
      //   if(list==null){
      //     list=[]
      //   }

      //   list.push({
      //     value:rack.id,
      //     label:rack.rackName,
      //   })
      //   rackMap.set(rack.areaId,list)

      // })
      // let areaMap = new Map();
      // this.wmsAreaList.forEach(area=>{
      //   let list=areaMap.get(area.warehouseId)
      //   if(list==null){                                                             
      //     list=[]
      //   }

      //   list.push({
      //       value:area.id,
      //       label:area.areaName,
      //       children:rackMap.get(area.id)
      //     })
      //   areaMap.set(area.warehouseId,list)
      // })

      // this.wmsWarehouseList.forEach(warehouse=>{
      //   this.areaOptions.push({
      //     value:warehouse.id,
      //     label:warehouse.warehouseName,
      //     children:areaMap.get(warehouse.id),
            
      //   })
      // });

    },
    getHouseList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsWarehouse(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsWarehouseList = content;
        this.wmsWarehouseList.forEach(warehouse => {
          this.wmsWarehouseMap.set(warehouse.id,warehouse.warehouseName)
        });
        this.total = totalElements;
        this.loading = false;
      });
    },
    getAreaList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsArea(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsAreaList = content;
        this.wmsAreaList.forEach(area=>{
          this.wmsAreaMap.set(area.id,area.areaName)
        })
        this.total = totalElements;
        this.loading = false;
      });
    },
    getRackList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWmsRack(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.wmsRackList = content;
        this.wmsRackList.forEach(rack=>{
          this.wmsRackMap.set(rack.id,rack.rackName)
        })
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        itemNo: null,
        itemName: null,
        itemType: null,
        unit: null,
        rackId: null,
        areaId: null,
        warehouseId: null,
        quantity: null,
        expiryDate: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加物料";
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      await getWmsItem(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改物料";
      });
      this.onWarehouseChange(true)
      this.onAreaChange(true)
    },
    
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWmsItem(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWmsItem(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除物料编号为"' + ids + '"的数据项？').then(function() {
        return delWmsItem(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有物料数据项？').then(() => {
        this.exportLoading = true;
        return exportWmsItem(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
