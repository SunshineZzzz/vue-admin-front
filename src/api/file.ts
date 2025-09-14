import instance from '@/http/index'

// 更新下载次数
export interface updateDownloadNum {
  file_id: number
  download_number: number
}

// 分批获取文件列表接口
export interface IBatchGetFileList {
  offset: number
  limit: number
}

// 根据文件名搜索文件接口
export interface ISearchFileByName {
  file_name: string
}

// 删除文件接口 
export interface IDeleteFile {
  file_id: number
  user_id: number
  user_name: string
}

// 更新下载次数
export const updateDownloadNum = (data:updateDownloadNum)=> {
  return instance({
    url: '/file/updateDownloadNum',
    method: 'POST',
    data
  })
}

// 获取文件列表总数
export const fileListLength = () => {
  return instance({
    url: '/file/fileListLength',
    method: 'POST',
  })
}

// 分批获取文件列表
export const batchGetFileList = (data:IBatchGetFileList) => {
  return instance({
    url: '/file/batchGetFileList',
    method: 'POST',
    data
  })
}

// 根据文件名搜索文件
export const searchFileByName = (data:ISearchFileByName) => {
  return instance({
    url: '/file/searchFileByName',
    method: 'POST',
    data
  })
}

// 删除文件
export const deleteFile = (data:IDeleteFile) => {
  return instance({
    url: '/file/deleteFile',
    method: 'POST',
    data
  })
}