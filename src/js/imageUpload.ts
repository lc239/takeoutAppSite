import { ElMessage, type UploadRawFile } from 'element-plus'

export function handleBeforeAvatarUpload(rawFile: UploadRawFile) {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/webp') {
        ElMessage.error('必须上传图片哦')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('请上传2mb以下的图片')
        return false
    }else{
        ElMessage('正在上传')
        return true
    }
    
}