<script setup lang="ts">
    import { aliUrlPrefix, defaultMenuImgFilename } from '@/js/aliOssConfig'
    import { BASE_URL } from '@/network/axios-instance'
    import { fenToYuan } from '@/js/unit'
    import { computed, ref } from 'vue'
    import { useAreaIn } from '@/js/mouse'
    import { useRestaurantStore } from '@/stores/restaurant'
    import { useUserStore } from '@/stores/user'
    import { storeToRefs } from 'pinia'
    import { handleBeforeAvatarUpload } from '@/js/imageUpload'
    import { ElUpload, genFileId } from 'element-plus'
    import { getAliMenuImgUrl } from '@/js/aliOssConfig'

    const props = defineProps(['menuIndex', 'categoryIndex'])

    const { token } = storeToRefs(useUserStore())
    const { restaurant } = storeToRefs(useRestaurantStore())
    const menu = computed(() => restaurant.value!.categories[props.categoryIndex].menus[props.menuIndex])
    const { setMenuImageFilename } = useRestaurantStore()
    const imageUrl = computed(() => getAliMenuImgUrl(menu.value.imageFilename))
    const bodyStyle = {display: 'flex', alignItems: 'center'}
    const imageArea = ref<HTMLDivElement | null>(null)
    const inImageArea = useAreaIn(imageArea)
    const imageUpload = ref<InstanceType<typeof ElUpload> | null>(null)
    function handleImageUploadSuccess(data: any){
        setMenuImageFilename(data.data, props.categoryIndex, props.menuIndex)
    }
    function handleImageUploadExceed(files: any){
        imageUpload.value!.clearFiles()
        const file = files[0]
        file.uid = genFileId()
        imageUpload.value!.handleStart(file)
        imageUpload.value!.submit()
    }
</script>

<template>
    <el-card class="menu-card" :body-style="bodyStyle">
        <template #header>
            <div class="card-header">
                <span>菜品名称：{{ menu.name }}</span>
                <span>菜品价格: {{ fenToYuan(menu.price) }}元</span>
            </div>
        </template>
        <div class="menu-image-area" ref="imageArea">
            <el-image style="width: 100px; height: 100px; display: block;" :src="imageUrl" />
            <Transition name="fade">
                <div class="upload-image" v-show="inImageArea"
                    :style="{ backgroundColor: inImageArea ? 'rgb(66,66,66,.5)' : '' }">
                    <el-upload 
                        ref="imageUpload" 
                        style="display: flex;" 
                        :limit="1"
                        name="image"
                        :show-file-list="false"
                        :on-success="handleImageUploadSuccess"
                        :on-exceed="handleImageUploadExceed"
                        :action="`${BASE_URL}restaurant/menu/upload/image/${props.categoryIndex}/${props.menuIndex}`"
                        method="put"
                        :headers="{ Authorization: `Bearer ${token}` }"
                        :before-upload="handleBeforeAvatarUpload"
                    >
                        <el-button size="small" type="info" round>更改图片</el-button>
                    </el-upload>
                </div>
            </Transition>
        </div>
        <div class="menu-description">
            <template v-if="menu.description.length === 0">还没有写菜品描述</template>
            <template v-else>{{ menu.description }}</template>
        </div>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </el-card>
</template>

<style scoped>
.menu-card .card-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.menu-card .menu-description{
    margin: 0 14px;
    flex-grow: 1;
    align-self: stretch;
    word-break: break-all;
    overflow: hidden;
}
.menu-card .menu-image-area{
    position: relative;
}
.menu-card .upload-image{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>