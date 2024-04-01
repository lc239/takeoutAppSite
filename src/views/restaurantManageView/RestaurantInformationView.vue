<script setup>
    import { BASE_URL } from '@/network/axios-instance';
    import { useRestaurantStore } from '@/stores/restaurant';
    import { useUserStore } from '@/stores/user';
    import { genFileId } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { computed, ref } from 'vue';

    const { token } = storeToRefs(useUserStore())
    const { avatarUrl, name } = storeToRefs(useRestaurantStore())
    const { setAvatarFilename } = useRestaurantStore()
    const imageStyle = {width: '148px', height: '148px'} //同上传的尺寸
    const uploadImage = ref([])
    const hasImage = computed(() => uploadImage.value.length > 0)
    const upload = ref(null)
    function handleExceed(files){
        upload.value.clearFiles()
        const file = files[0]
        file.uid = genFileId()
        upload.value.handleStart(file)
    }
    function handleSuccess(response){
        setAvatarFilename(response.data.data)
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
        >
            <el-icon>
                <Plus />
            </el-icon>
            <template #file="{ file }">
                <el-image class="el-upload-list__item-thumbnail" :src="file.url"></el-image>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-delete" @click="upload.clearFiles()">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </span>
                </span>
            </template>
        </el-upload>
        <el-button v-show="hasImage" @click="() => upload.submit()">提交图片</el-button>
    </div>

</template>

<style>
.restaurant-image-area{
    display: flex;
    align-items: center;
    column-gap: 14px;
}
</style>

