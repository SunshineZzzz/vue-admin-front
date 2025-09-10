<script lang='ts' setup>
  // 产品管理组件
	import { ref, onMounted } from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import warehousing from '../components/product_in_warehouse.vue'
	import apply from '../components/apply.vue'
	import edit from '../components/edit_product.vue'
	import remove from '../components/delete_product.vue'
	import audit from '../components/audit.vue'
	import withdraw from '../components/withdraw.vue'
	import again from '../components/again_apply.vue'
  import { useProductTable } from '@/hooks'
  import { Search } from '@element-plus/icons-vue'
  import type { TabsPaneContext } from 'element-plus'
  import { bus } from "@/utils/mitt"
  import { type IProductInfoData, CProductDialog, CApplyOutProductDialog, ProductDialogOffType } from '@/define/index'
  import { FormatSecDateYMD } from '@/tool/index'
  const { 
    productInitTable,
    applyProductInitTable,
    sProductNumberId,
    sApplyProductNumberId,
    searchProductByNumberId,
    searchApplyProductByNumberId,
    productClearInput,
    applyProductClearInput,
    productTableData,
    applyProductTableData,
    productPaginationData,
    applyProductPaginationData,
    productTotal,
    applyProductTotal,
  } = useProductTable()

  // 挂架完成就搞数据 
  onMounted(async () => {
    await productInitTable()
  })
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
  const items = ref([
    { name: "产品管理" },
    { name: "产品列表" }
  ])
  // tab切换
	const handleClick = (tab: TabsPaneContext) => {
		if (tab.props.label == '产品列表') {
			productInitTable()
      productCurrentChange(productPaginationData.currentPage)
		}
		if (tab.props.label == '审核列表') {
      applyProductInitTable()
      applyProductCurrentChange(applyProductPaginationData.currentPage)
		}
	}
  // 默认打开的标签页
	const activeName = ref('first')
  // 打开产品入库
	const in_warehouse = ref()
	const productInWarehouse = () => {
    in_warehouse.value.open()
	}
  // 入库操作影响产品列表，成功回调
  const success_in_warehouseCB = () => {
    bus.emit(CProductDialog, ProductDialogOffType.Create)
  }
  // 申请出库操作影响产品列表、审核产品列表 ，成功回调
  const success_changeTwoPageList = () => {
    // 就用create了
    bus.emit(CProductDialog, ProductDialogOffType.Create)
    bus.emit(CApplyOutProductDialog, ProductDialogOffType.Create)
  }
	// 产品申请出库
	const apply_product = ref()
	const applyOut = (row: IProductInfoData) => {
		apply_product.value.open(row)
	}
	// 编辑产品信息
	const edit_product = ref()
	const editProduct = (row: IProductInfoData) => {
		edit_product.value.open(row)
	}
	// 删除产品
	const delete_product = ref()
	const deleteProduct = (id: string) => {
		delete_product.value.open(id)
	}
	// 审核产品
	const audit_product = ref()
	const auditProduct = (id: string) => {
    audit_product.value.open(id)
	}
	// 撤回产品申请
	const withdraw_product = ref()
	const withdrawProduct = (id: string) => {
    withdraw_product.value.open(id)
	}
	// 再次申请产品出库
	const again_product = ref()
	const againApply = (row: IProductInfoData) => {
    again_product.value.open(row)
	}
	// 产品列表监听换页
	const productCurrentChange = async (value: number) => {
		productPaginationData.currentPage = value
	}
	// 申请列表监听换页
	const applyProductCurrentChange = async (value: number) => {
    applyProductPaginationData.currentPage = value
	}
</script>


<template>
	<breadCrumb ref="breadcrumb" :items='items'></breadCrumb>
	<!-- wrapper -->
	<div class="module-common-wrapped">
		<div class="module-common-content">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="产品列表" name="first">
					<div class="pane-content">
						<div class="pane-top">
							<div class="module-common-header">
								<div class="search-wrapped">
									<el-input v-model="sProductNumberId" class="w-50 m-2" size="large" placeholder="输入入库编号进行搜索"
										 @change="searchProductByNumberId()" clearable
										@clear="productClearInput()" >
                    <template #prefix>
                      <Search />
                    </template>
                    </el-input>
								</div>
								<div class="button-wrapped">
									<el-button type="primary" @click="productInWarehouse">产品入库</el-button>
								</div>
							</div>
							<!-- 表格部分 -->
							<div class="module-common-table">
								<el-table row-key="id" :data="productTableData" border style="width: 100%">
									<el-table-column type="index" width="50"></el-table-column>
									<el-table-column prop="id" label="入库编号" width="200" />
									<el-table-column prop="name" label="产品名称" width="160" />
									<el-table-column prop="category" label="产品类别" width="100" />
									<el-table-column prop="unit" label="单位" />
									<el-table-column prop="quantity" label="库存数量" width="100" />
									<el-table-column prop="price" label="产品单价" width="150" />
									<el-table-column label="库存总价" width="100">
                    <template #default="{row}">
                      <div>{{ (row.quantity * row.price).toFixed(2) }}</div> 
                    </template>
                  </el-table-column>
									<el-table-column label="库存状态" width="100">
                    <template #default="{row}">
                      <div>
                        <el-tag class="ml-2" type="warning" v-if="row.quantity < 100">库存较少</el-tag>
                        <el-tag class="ml-2" type="danger" v-else-if="row.quantity > 300">库存过剩</el-tag>
                        <el-tag class="ml-2" type="success" v-else>库存正常</el-tag> <!-- 此时 v-else 包含 100到300 -->
                      </div>
                    </template>
									</el-table-column>
                  <el-table-column prop="status" label="状态" width="100" />
									<el-table-column prop="user_name" label="入库负责人" width="100" />
									<el-table-column prop="create_time" label="入库时间" width="200">
										<template #default="{row}">
											<div>{{ FormatSecDateYMD(row.create_time) }}</div>
										</template>
									</el-table-column>
									<el-table-column prop="update_time" label="最后修改时间" width="200">
										<template #default="{row}">
											<div>{{ FormatSecDateYMD(row.update_time) }}</div>
										</template>
									</el-table-column>
									<el-table-column prop="remark" label="入库备注" width="200" />
									<el-table-column label="操作" width="300" fixed="right">
										<template #default="{row}">
											<div>
												<el-button type="primary" @click="applyOut(row)"
													:disabled='row.status=="申请出库" || row.quantity==0'>申请出库</el-button>
												<el-button type="success" @click="editProduct(row)"
													:disabled='row.status=="申请出库"'>修改</el-button>
												<el-button type="danger" @click="deleteProduct(row.id)"
													:disabled='row.status=="申请出库"'>删除</el-button>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
              <div class="table-footer">
                <el-pagination :page-size="1" :current-page="productPaginationData.currentPage"
                              :pager-count="7" :total="productTotal"
                              :page-count="productPaginationData.pageCount" @current-change="productCurrentChange"
                              layout="prev, pager, next" />
              </div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="审核列表" name="second">
					<div class="pane-content">
						<div class="pane-top">
							<div class="module-common-header">
								<div class="search-wrapped">
									<el-input v-model="sApplyProductNumberId" class="w-50 m-2" size="large" clearable
										placeholder="输入入库编号进行搜索" @change="searchApplyProductByNumberId()"
										@clear="applyProductClearInput()" >
                    <template #prefix>
                      <Search />
                    </template>
                  </el-input>
								</div>
								<div class="button-wrapped">
								</div>
							</div>
							<!-- 表格部分 -->
							<div class="module-common-table">
								<el-table row-key="id" :data="applyProductTableData" border style="width: 100%">
									<el-table-column type="index" width="50"></el-table-column>
									<el-table-column prop="id" label="申请出库编号" width="200" />
									<el-table-column prop="name" label="产品名称" width="200" />
									<el-table-column prop="out_quantity" label="申请出库数量" width="180" />
									<el-table-column label="申请出库总价" width="180">
                    <template #default="{row}">
                      <div>{{ (row.out_quantity * row.price).toFixed(2) }}</div>
                    </template>
                  </el-table-column>
									<el-table-column label="申请人" width="100">
                    <template #default="{row}">
                      <div>{{ row.out_user_name }}</div>
                    </template>
                  </el-table-column>
									<el-table-column label="申请出库时间" width="180">
										<template #default="{row}">
											<div>{{ FormatSecDateYMD(row.apply_out_time) }}</div>
										</template>
									</el-table-column>
									<el-table-column label="审核人" width="150">
                    <template #default="{row}">
                      <div>{{ row.status == '拒绝出库' ? row.update_user_name : '' }}</div>
                    </template>
                  </el-table-column>
									<el-table-column label="审核时间" width="180">
										<template #default="{row}">
											<div>{{ row.status == '拒绝出库' ? FormatSecDateYMD(row.update_time) : '' }}</div>
										</template>
									</el-table-column>
									<el-table-column prop="status" label="审核状态" width="100" />
									<el-table-column prop="remark" label="备注" width="200" />
									<el-table-column label="操作" width="300" fixed="right">
										<template #default="{row}">
											<div>
												<el-button type="primary"
													@click="withdrawProduct(row.id)">撤回申请</el-button>
												<el-button type="success" :disabled='row.status=="申请出库"'
													@click="againApply(row)">再次申请</el-button>
												<el-button type="danger" @click="auditProduct(row.id)">审核</el-button>
											</div>
										</template>
									</el-table-column>
								</el-table>
                <div class="table-footer">
                  <el-pagination :page-size="1" :current-page="applyProductPaginationData.currentPage"
                                :pager-count="7" :total="applyProductTotal"
                                :page-count="applyProductPaginationData.pageCount"
                                @current-change="applyProductCurrentChange" layout="prev, pager, next" />
                </div>
							</div>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
	<!-- 入库操作影响产品列表 -->
	<warehousing ref="in_warehouse" @success='success_in_warehouseCB'></warehousing>
	<!-- 申请出库操作影响产品列表、审核产品列表 -->
	<apply ref="apply_product" @success='success_changeTwoPageList'></apply>
	<!-- 编辑操作影响产品列表， 审核产品列表 -->
	<edit ref="edit_product" @success='success_changeTwoPageList'></edit>
	<!-- 删除操作影响产品列表， 审核产品列表 -->
	<remove ref="delete_product" @success='success_changeTwoPageList'></remove>
	<!-- 审核操作影响产品列表、审核产品列表 -->
	<audit ref="audit_product" @success='success_changeTwoPageList'></audit>
	<!-- 撤回操作影响产品列表、审核产品列表 -->
	<withdraw ref="withdraw_product" @success='success_changeTwoPageList'></withdraw>
	<!-- 再次申请操作影响产品列表、审核产品列表 -->
	<again ref="again_product" @success='success_changeTwoPageList'></again>
</template>

<style lang="scss" scoped>
	:deep(.el-table .cell) {
		font-weight: 400;
	}
</style>
