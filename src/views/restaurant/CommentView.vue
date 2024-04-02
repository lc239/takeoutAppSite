<script setup>
    import CommentCard from '@/components/restaurantPage/CommentCard.vue'
    import LoadMoreInView from '@/components/LoadMoreInView.vue'
    import { getComments } from '@/network/restaurantApi'
    import { storeToRefs } from 'pinia'
    import { useShoppingStore } from '@/stores/shopping'
    import { ref } from 'vue'

    const { restaurant } = storeToRefs(useShoppingStore())
    const comments = ref([])
    let pageOffset = 0
    const pageSize = 20
    const loadView = ref(null)
    function loadMore(){
        getComments(restaurant.value.id, pageOffset, pageSize, {
            onSucceed: list => {
                if(list.length < pageSize){
                    loadView.value.unobserve()
                }else{
                    loadView.value.waitNext()
                }
                comments.value.push(...list)
                pageOffset++
            }
        })
    }
</script>

<template>
    <el-container>
        <el-aside>
            <el-menu default-active="0">
                <el-menu-item index="0">最新评论</el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <el-scrollbar view-class="comment-view">
                <CommentCard v-for="comment of comments" :comment="comment" />
                <LoadMoreInView id="comment-load-bottom" @load="loadMore" ref="loadView" v-slot="slotProps">
                    <div>
                        <template v-if="slotProps.observing">
                            拉到底就会刷新哦
                        </template>
                        <template v-else>
                            已经没有其他评论了
                        </template>
                    </div>
                </LoadMoreInView>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<style>
.comment-view{
    display: grid;
    padding: 0 10px;
    grid-template-columns: repeat(3, minmax(300px, 1fr));
    grid-auto-rows: 250px;
    column-gap: 10px;
    row-gap: 14px;
}
#comment-load-bottom{
    grid-column: 1/4;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>