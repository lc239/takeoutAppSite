<script setup lang="ts">
    import { BASE_URL } from '@/network/axios-instance';
    import { useRestaurantStore } from '@/stores/restaurant';
    import { useUserStore } from '@/stores/user';
    import { ElMessage, ElUpload, genFileId } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { computed, ref } from 'vue';
    import { handleBeforeAvatarUpload } from '@/js/imageUpload'
    import { Plus, Delete } from '@element-plus/icons-vue'

    const { token } = storeToRefs(useUserStore())
    const { avatarUrl, restaurant } = storeToRefs(useRestaurantStore())
    const { setAvatarFilename } = useRestaurantStore()
    const imageStyle = {width: '148px', height: '148px'} //同上传的尺寸
    const uploadImage = ref([])
    const hasImage = computed(() => uploadImage.value.length > 0)
    const upload = ref<InstanceType<typeof ElUpload> | null>(null)
    function handleExceed(files: any){
        upload.value!.clearFiles()
        const file = files[0]
        file.uid = genFileId()
        upload.value!.handleStart(file)
    }
    function handleSuccess(data: any){
        ElMessage('上传成功')
        upload.value!.clearFiles()
        if(data.code === 0) setAvatarFilename(data.data)
    }
</script>

<template>
    <div class="restaurant-image-area">
        <el-image :src="avatarUrl" :style="imageStyle" />
        <el-upload
            method="put"
            :action="`${BASE_URL}restaurant/upload/image`"
            :headers="{ Authorization: `Bearer ${token}` }"
            :auto-upload="false"
            v-model:file-list="uploadImage"
            list-type="picture-card"
            ref="upload"
            :limit="1"
            :on-exceed="handleExceed"
            name="image"
            :on-success="handleSuccess"
            :before-upload="handleBeforeAvatarUpload"
        >
            <el-icon>
                <Plus />
            </el-icon>
            <template #file="{ file }">
                <el-image class="el-upload-list__item-thumbnail" :src="file.url"></el-image>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-delete" @click="upload!.clearFiles()">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </span>
                </span>
            </template>
        </el-upload>
        <el-button v-show="hasImage" @click="() => upload!.submit()">提交图片</el-button>
    </div>
    <p>店铺名称：{{ restaurant!.name }}</p>
</template>

<style>
.restaurant-image-area{
    display: flex;
    align-items: center;
    column-gap: 14px;
}
</style>

