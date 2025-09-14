<script lang='ts' setup>
	import { ref, onMounted } from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import tips from './components/tips.vue'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { bus } from "@/utils/mitt"
  import { useFileTable } from '@/hooks'
  import { FormatSecDateYMD, BytesToKB, GetDownloadUrl } from '@/tool/index'
  import { type IFileInfoData } from '@/define/index'
  import { CFileDialogOff, FileDialogOffType } from '@/define/index'
  import { updateDownloadNum } from '@/api/file'
  import { type IBaseResponse } from '@/http'
  import { useUserInfoStore } from '@/stores/userinfo'
  const { 
    sFileName,
    paginationData,
    total,
    tableData,
    searchFileByNameFunc,
    clearInput,
    initTable,
  } = useFileTable()

  // 用户信息存储对象
  const userInfoStore = useUserInfoStore()
  // 挂架完成就搞数据 
  onMounted(async () => {
    await initTable()
  })
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const items = ref([
    {name: '文件管理'}
  ])
  // 文件上传地址
  const baseUrl = ref(`${import.meta.env.VITE_API_BASEURL}/file/uploadFile`)
  // 文件上传的请求头
  const headers = ref({
    Authorization: localStorage.getItem("token"),
  });
  // 文件上传的额外参数
  const bodyData = ref({
    user_id: userInfoStore.uId!,
    user_name: userInfoStore.name!
  })
  // 更新下载次数
  const updateDownloadNumFunc = (row: IFileInfoData) => {
    ElMessageBox.confirm("您确定要下载该文件吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      const res = await updateDownloadNum({file_id:row.file_id!, download_number:1})
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        return
      }
      row.download_number++
      const url = GetDownloadUrl(row.url)
      window.open(url)
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消下载",
      });
    });
  }
	// 文件列表监听换页
	const fileCurrentChange = async (value: number) => {
    paginationData.currentPage = value
	}
	// 当选择的文件数​​超出 limit​​ 限制时的回调
	const handleExceed = () => {
		ElMessage.warning('最多上传一个文件')
	}
  // 文件上传失败回调
  const handleError = (error: Error) => {
    ElMessage.error(JSON.parse(error.message).message)
  }
	// 文件上传成功回调
	const handleSuccess = (response: IBaseResponse,) => {
    if (response.status !== 0) {
      ElMessage.error(response.message)
      return
    }
    ElMessage.success(response.message)
    bus.emit(CFileDialogOff, FileDialogOffType.Create)
	}
  // 删除文件成功回调
  const deleteFileSuccess =  () => {
    bus.emit(CFileDialogOff, FileDialogOffType.Delete)
  }

  const tip = ref()
	const deleteFile = (row: any) => {
		tip.value.open("删除", row)
	}
</script>

<template>
	<breadCrumb ref="breadcrumb" :items='items'></breadCrumb>
	<div class="table-wrapped">
		<div class="table-top">
			<div class="table-header">
        <div class="search-wrapped">
          <el-input v-model="sFileName" class="w-50 m-2" size="large" placeholder="输入文件名进行搜索"
              @change='searchFileByNameFunc()' clearable @clear='clearInput()'
          >
            <template #prefix>
              <Search />
            </template>
          </el-input>
        </div>
        <div class="button-wrapped">
          <el-upload
            class="upload-demo"
            :action="baseUrl"
            :headers="headers"
            :data="bodyData"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :on-error="handleError"
            :show-file-list="false"
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </div>
			</div>
			<div class="table-content">
				<el-table :data='tableData' style="width: 100%;">
					<el-table-column type="index" width="50"></el-table-column>
					<el-table-column prop="name" label="文件名" />
					<el-table-column label="文件大小" >
						<template #default="{row}">
							<div>{{ BytesToKB(row.size, true) }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="user_name" label="上传者" />
					<el-table-column prop="download_number" label="下载次数" />
					<el-table-column label="上传时间" width="200">
						<template #default="{row}">
							<div>{{ FormatSecDateYMD(row.create_time) }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200" fixed="right">
						<template #default="{row}">
							<div>
                <el-button type="info" @click="updateDownloadNumFunc(row)">下载</el-button>
								<el-button type="danger" @click="deleteFile(row)">删除</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
        <div class="table-footer">
          <el-pagination :page-size="1" :current-page="paginationData.currentPage" :pager-count="7"
                        :total="total" :page-count="paginationData.pageCount"
                        @current-change="fileCurrentChange" layout="prev, pager, next" />
        </div>
			</div>
		</div>
	</div>
	<tips ref="tip" @success='deleteFileSuccess'></tips>
</template>

<style lang="scss" scoped>
	:deep(.el-table .cell) {
		font-weight: 400;
	}

	a {
		color:#fff;
		display: block;
		text-decoration: none;
	}
</style>
