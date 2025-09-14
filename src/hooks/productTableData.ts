// 产品列表通用函数
import {
  searchProductForId,
  getProductLength, getOutProductLength, 
  getApplyProductLength, batchGetProductList, 
  batchGetApplyProductList, batchGetOutProductList
} from '@/api/product'
import { ref, reactive, watch } from "vue";
import { bus } from '@/utils/mitt'
import { ElMessage } from 'element-plus'
import { CTablePagingSize, CProductDialogOff, CApplyOutProductDialogOff } from '@/define/index'
import { type IProductInfoData, ProductDialogOffType, SearchProductType } from '@/define/index'

export const useProductTable = () => {
  // 产品分页数据
  const productPaginationData = reactive({
    // 总页数
    pageCount: 1,
    // 当前所处页数
    currentPage: 1,
  })
  // 申请出库产品分页数据
  const applyProductPaginationData = reactive({
    // 总页数
    pageCount: 1,
    // 当前所处页数
    currentPage: 1,
  })
  // 出库产品分页数据
  const outProductPaginationData = reactive({
    // 总页数
    pageCount: 1,
    // 当前所处页数
    currentPage: 1,
  })

  // 产品数量
  const productTotal = ref<number>(0)
  // 申请出库产品数量
  const applyProductTotal = ref<number>(0)
  // 出库产品数量
  const outProductTotal = ref<number>(0)
  // 产品搜索框内容
  const sProductNumberId = ref<string>('')
  // 申请出库产品搜索框内容
  const sApplyProductNumberId = ref<string>('')
  // 出库产品搜索框内容
  const sOutProductNumberId = ref<string>('')
  // 产品表格内容
  const productTableData = ref<Array<IProductInfoData[]>>([])
  // 申请出库产品表格内容
  const applyProductTableData = ref<Array<IProductInfoData[]>>([])
  // 出库产品表格内容
  const outProductTableData = ref<Array<IProductInfoData[]>>([])

  // 返回产品列表长度
  const returnProductListLength = async () => {
    const res = await getProductLength()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    productTotal.value = Number(res.data.data.count)
    productPaginationData.pageCount = Math.ceil(res.data.data.count/CTablePagingSize)
  }
  // 返回申请出库产品列表长度
  const returnApplyProductListLength = async () => {
    const res = await getApplyProductLength()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    applyProductTotal.value = Number(res.data.data.count)
    applyProductPaginationData.pageCount = Math.ceil(res.data.data.count/CTablePagingSize)  
  }
  // 返回出库产品列表长度
  const returnOutProductListLength = async () => {
    const res = await getOutProductLength()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    outProductTotal.value = Number(res.data.data.count)
    outProductPaginationData.pageCount = Math.ceil(res.data.data.count/CTablePagingSize)
  }

  // 产品监听换页
  const productCurrentChange = async (value:number) => {
    const res = await batchGetProductList({offset:(productPaginationData.currentPage-1), limit:CTablePagingSize})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    productTableData.value = res.data.data.productList
  }
  // 申请出库产品监听换页
  const applyProductCurrentChange = async (value:number) => {
    const res = await batchGetApplyProductList({offset:(applyProductPaginationData.currentPage-1), limit:CTablePagingSize})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    applyProductTableData.value = res.data.data.productList
  }
  // 出库产品监听换页
  const outProductCurrentChange = async (value:number) => {
    const res = await batchGetOutProductList({offset:(outProductPaginationData.currentPage-1), limit:CTablePagingSize})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    outProductTableData.value = res.data.data.productList
  }
  // 通过编号搜索产品
  const searchProductByNumberId = async () => {
    if (!sProductNumberId.value) {
      // 当搜索内容清空后，返回当前页面的数据
      productCurrentChange(productPaginationData.currentPage)
      return
    }
    const res = await searchProductForId({numberId:sProductNumberId.value, sType:SearchProductType.product})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    productTableData.value = res.data.data.productList
  }
  // 通过编号搜索申请出库产品
  const searchApplyProductByNumberId = async () => {
    if (!sApplyProductNumberId.value) {
      // 当搜索内容清空后，返回当前页面的数据
      applyProductCurrentChange(applyProductPaginationData.currentPage)
      return
    }
    const res = await searchProductForId({numberId:sApplyProductNumberId.value, sType:SearchProductType.applyProduct})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    applyProductTableData.value = res.data.data.productList
  }
  // 通过编号搜索出库产品
  const searchOutProductByNumberId = async () => {
    if (!sOutProductNumberId.value) {
      // 当搜索内容清空后，返回当前页面的数据
      outProductCurrentChange(outProductPaginationData.currentPage)
      return
    }
    const res = await searchProductForId({numberId:sOutProductNumberId.value, sType:SearchProductType.outProduct})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    outProductTableData.value = res.data.data.productList
  }
  // 产品清空，当搜索内容清空后，返回当前页面的数据
  const productClearInput = async () =>{
    await productCurrentChange(productPaginationData.currentPage)
  }
  // 申请出库产品清空，当搜索内容清空后，返回当前页面的数据
  const applyProductClearInput = async () =>{
    await applyProductCurrentChange(applyProductPaginationData.currentPage)
  }
  // 出库产品清空，当搜索内容清空后，返回当前页面的数据
  const outProductClearInput = async () =>{
    await outProductCurrentChange(outProductPaginationData.currentPage)
  }

  // 产品，外部操作用户后，需要根据操作更新表格
  bus.off(CProductDialogOff)
  bus.on(CProductDialogOff, async (id:number) => {
    // 当前页数
    const current = productPaginationData.currentPage
    // 创建
    if (id == ProductDialogOffType.Create) {
      await returnProductListLength()
      productPaginationData.currentPage = 1
      if (current == productPaginationData.currentPage) {
        productCurrentChange(productPaginationData.currentPage)
      }
      return
    }
    // 编辑
    if (id == ProductDialogOffType.Edit) {
      await productCurrentChange(current)
      return
    }
    // 删除
    if (id == ProductDialogOffType.Delete) {
      await returnProductListLength()
      productPaginationData.currentPage = 1
      if (current == productPaginationData.currentPage) {
        productCurrentChange(productPaginationData.currentPage)
      }
      return
    }
  })
  // 申请出库产品，外部操作用户后，需要根据操作更新表格
  bus.off(CApplyOutProductDialogOff)
  bus.on(CApplyOutProductDialogOff, async (id:number) => {
    // 当前页数
    const current = applyProductPaginationData.currentPage
    // 创建
    if (id == ProductDialogOffType.Create) {
      await returnApplyProductListLength()
      applyProductPaginationData.currentPage = 1
      if (current == applyProductPaginationData.currentPage) {
        applyProductCurrentChange(applyProductPaginationData.currentPage)
      }
      return
    }
    // 编辑
    if (id == ProductDialogOffType.Edit) {
      await applyProductCurrentChange(current)
      return
    }
    // 删除
    if (id == ProductDialogOffType.Delete) {
      await returnApplyProductListLength()
      applyProductPaginationData.currentPage = 1
      if (current == applyProductPaginationData.currentPage) {
        applyProductCurrentChange(applyProductPaginationData.currentPage)
      }
      return
    }
  })

  // 产品初始化
  const productInitTable = async () => {
    await returnProductListLength()
    const current = productPaginationData.currentPage
    productPaginationData.currentPage = 1
    if (current == productPaginationData.currentPage) {
      productCurrentChange(productPaginationData.currentPage)
    }
  }
  // 申请出库产品初始化
  const applyProductInitTable = async () => {
    await returnApplyProductListLength()
    const current = applyProductPaginationData.currentPage
    applyProductPaginationData.currentPage = 1
    if (current == applyProductPaginationData.currentPage) {
      applyProductCurrentChange(applyProductPaginationData.currentPage)
    }
  }
  // 出库产品初始化
  const outProductInitTable = async () => {
    await returnOutProductListLength()
    const current = outProductPaginationData.currentPage
    outProductPaginationData.currentPage = 1
    if (current == outProductPaginationData.currentPage) {
      outProductCurrentChange(outProductPaginationData.currentPage)
    }
  }

  // 页码发生变化，触发
  watch (
    () => productPaginationData.currentPage,
    () => {
      productCurrentChange(productPaginationData.currentPage)
    },
  )
  watch (
    () => applyProductPaginationData.currentPage,
    () => {
      applyProductCurrentChange(applyProductPaginationData.currentPage)
    },
  )
  watch (
    () => outProductPaginationData.currentPage,
    () => {
      outProductCurrentChange(outProductPaginationData.currentPage)
    },
  )

  return {
    productInitTable,
    applyProductInitTable,
    outProductInitTable,
    productPaginationData,
    applyProductPaginationData,
    outProductPaginationData,
    sProductNumberId,
    sApplyProductNumberId,
    sOutProductNumberId,
    productTableData,
    applyProductTableData,
    outProductTableData,
    productTotal,
    applyProductTotal,
    outProductTotal,
    productCurrentChange,
    applyProductCurrentChange,
    outProductCurrentChange,
    searchProductByNumberId,
    searchApplyProductByNumberId,
    searchOutProductByNumberId,
    productClearInput,
    applyProductClearInput,
    outProductClearInput,
  }
}
