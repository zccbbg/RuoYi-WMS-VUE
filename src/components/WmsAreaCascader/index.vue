<template>
	<el-cascader
		placeholder="请选择仓库信息"
		:options="options"
		:props="{ checkStrictly: true }"
		v-model="selections"
		clearable
    filterable>
	</el-cascader>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	props: ['value','size'],
	data(){
		return{
			options:[]
		}
	},
	computed:{
		...mapGetters(['areaList','warehouseList']),
		selections:{
			get(){
				return this.value;
			},
			set(v){
				this.$emit('input',v);
			}
		}
	},
	created(){
		this.setOption()
	},
	methods:{
		setOption(){
			let areaMap = new Map()
			let warehouseMap=new Map()

			this.areaList.forEach(area=>{
				let children=warehouseMap.get(area.warehouseId)
				if(children){
					children.push({value:area.id,label:area.areaName,children:areaMap.get(area.id)})
				}else{
					children=[{value:area.id,label:area.areaName,children:areaMap.get(area.id)}]
				}
				warehouseMap.set(area.warehouseId,children)
			})
			this.warehouseList.forEach(warehouse=>{
				this.options.push({value:warehouse.id,label:warehouse.warehouseName,children:warehouseMap.get(warehouse.id)})
			})
		}
	}
}
</script>

<style>

</style>