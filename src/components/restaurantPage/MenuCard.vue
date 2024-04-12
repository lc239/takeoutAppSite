<script setup lang="ts">
    import { getAliMenuImgUrl } from '@/js/aliOssConfig';
    import { fenToYuan } from '@/js/unit';
    import { useShoppingStore } from '@/stores/shopping';
    import type { Menu, OrderedMenu } from '@/type/class';
    import { Plus, Minus } from '@element-plus/icons-vue'

    //订单里的菜单和下单时的菜单不一样，多了num属性，且不在store里不能操作，用op表示
    //由于订单里查询到的菜单不会有图片，所以全会是默认图片，有时间会修改
    const props = withDefaults(defineProps<{
        menu: Menu
        op: boolean
    }>(), {
        op: false
    })

    const { addMenu, removeMenu, getMenuCount } = useShoppingStore()
</script>

<template>
    <div class="menu-card">
        <el-image class="menu-img" :src="getAliMenuImgUrl(props.menu.imageFilename!)"/>
        <div class="menu-desc">
            <span class="menu-name">{{ menu.name }}</span>
            <span class="menu-price">{{ '单价：' + fenToYuan(menu.price) + '元' }}</span>
            <span v-if="props.op" class="menu-count">
                <span style="margin-right: 10px;">{{ getMenuCount(props.menu) }}</span>
                <el-button size="small" v-if="getMenuCount(props.menu)" circle :icon="Minus" @click="() => removeMenu(props.menu)"></el-button>
                <el-button size="small" :icon="Plus" circle @click="() => addMenu(props.menu)"></el-button>
            </span>
            <span v-else class="menu-count">
                <span>{{ props.menu.num }}</span>
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