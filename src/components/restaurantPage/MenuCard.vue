<script setup>
    import { getAliMenuImgUrl } from '@/js/aliOssConfig';
    import { fenToYuan } from '@/js/unit';
    import { useShoppingStore } from '@/stores/shopping';
    import { Plus, Minus } from '@element-plus/icons-vue'

    const props = defineProps(['menu'])
    const { addMenu, removeMenu, getMenuCount } = useShoppingStore()
</script>

<template>
    <div class="menu-card">
        <el-image class="menu-img" :src="getAliMenuImgUrl(props.menu.imageFilename)"/>
        <div class="menu-desc">
            <span class="menu-name">{{ menu.name }}</span>
            <span class="menu-price">{{ fenToYuan(menu.price) + '元' }}</span>
            <span class="menu-count">
                <span style="margin-right: 10px;">{{ getMenuCount(props.menu) }}</span>
                <el-button v-if="getMenuCount(props.menu)" circle :icon="Minus" @click="() => removeMenu(props.menu)"></el-button>
                <el-button :icon="Plus" circle @click="() => addMenu(props.menu)"></el-button>
            </span>
        </div>
    </div>
</template>

<style scoped>
.menu-card{
    width: 100%;
    height: 100%;
    display: flex;
    column-gap: 8px;
    padding: 8px;
    border-radius: 6px;
    box-shadow: 1px 1px 1px grey;
    background-color: var(--el-color-primary-light-8);
}
.menu-img{
    height: 100%;
    aspect-ratio: 1/1;
    flex-shrink: 0;
}
.menu-desc{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}
.menu-name{
    width: 100%;
    align-self: flex-start;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.menu-price{
    align-self: flex-end;
}
.menu-count{
    align-self: flex-end;
    display: flex;
    align-items: center;
}
</style>