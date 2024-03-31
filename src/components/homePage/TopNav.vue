<script setup>
    import HoverArea from '@/components/HoverArea.vue'
    import { useUserStore } from '@/stores/user'
    import { Search } from '@element-plus/icons-vue'
    import { storeToRefs } from 'pinia'
    import { computed, ref } from 'vue'
    import { searchRestaurantByPrefix } from '@/network/restaurantApi'
    import { averageToFixed } from '@/js/unit'
    import { useRouter } from 'vue-router'

    const { avatarUrl, isLogin, newMsgNum } = storeToRefs(useUserStore())
    const { logout, showMsgDrawer, resetNewMsg } = useUserStore()
    const router = useRouter()
    const searchContent = ref('')
    const waitingSearchRes = ref(false)
    const searchRes = ref([])
    let searchTimer
    const searchSize = 4
    const searchMsgEnum = {
        success: `搜索成功, 最多预览${searchSize}个结果`,
        failed: '没有搜索到结果',
        error: '出错了，请检查网络'
    }
    function search(prefix){
        if(prefix === '') return
        waitingSearchRes.value = true
        clearTimeout(searchTimer)
        searchTimer = setTimeout(() => {
            searchRestaurantByPrefix(prefix, searchSize, {
                onSucceed: restaurants => {
                    searchRes.value = restaurants
                    searchMsg.value = searchMsgEnum.success
                },
                onFailed: msg => {
                    searchRes.value = []
                    searchMsg.value = searchMsgEnum.failed
                },
                onError: err => {
                    searchMsg.value = searchMsgEnum.error
                },
                onFinally: () => {
                    waitingSearchRes.value = false
                }
            })
        }, 500)
    }
    const showSearchSuggestion = ref(false)
    const searchMsg = ref('')
    function handleClickSearchItem(id){
        router.push({name: 'RestaurantWithCategory', params: {id}})
        searchInput.value.blur()
    }
    const searchInput = ref(null)
    function handleClickMessageIcon(){
        resetNewMsg()
        showMsgDrawer()
    }
</script>

<template>
    <!-- 用el-menu改一下? -->
    <div class="top-nav-left">
        <RouterLink to="/" id="nav-to-home">首页</RouterLink>
        <el-button>下载安卓app</el-button>
    </div>
    <div class="top-nav-search vertical-position-parent">
        <el-input v-if="isLogin" ref="searchInput" v-model="searchContent" placeholder="输入店名搜索" size="large" class="search-input" clearable
            @input="search(searchContent)" @focus="showSearchSuggestion = true" @blur="showSearchSuggestion = false">
            <template #append>
                <el-button :icon="Search" />
            </template>
        </el-input>
        <Transition name="fade">
            <div v-show="showSearchSuggestion && searchContent.length" class="search-suggestion">
                <div v-for="restaurant in searchRes" class="search-item" 
                @click="handleClickSearchItem(restaurant.id)">
                    <span>{{ restaurant.name }}</span>
                    <el-rate class="search-restaurant-rate" :model-value="averageToFixed(restaurant.rate, restaurant.rateCount, 1)" disabled show-score score-template="{value}" />
                </div>
                <div class="search-item search-tip" v-loading="waitingSearchRes">
                    <span v-show="!waitingSearchRes">
                        {{ searchMsg }}
                    </span>
                </div>
            </div>
        </Transition>

    </div>
    <div class="top-nav-right">
        <div class="nav-main">
            <HoverArea v-if="isLogin" class="avatar-area">
                <el-avatar class="avatar" :src="avatarUrl" />
                <template #hover-to-show>
                    <div class="avatar-in-content">
                        <el-button @click="logout()">退出登录</el-button>
                    </div>
                </template>
            </HoverArea>
            <el-button v-else class="to-login" circle type="primary">登录</el-button>
            <div class="nav-main-right">
                <div class="to-center">
                    <RouterLink to="/userCenter">个人中心</RouterLink>
                    <RouterLink to="/restaurantCenter">店铺管理</RouterLink>
                    <RouterLink to="/deliveryCenter">骑手中心</RouterLink>
                </div>
            </div>
        </div>
        <div class="nav-extra">
            <!-- 把这里的新消息绑定 -->
            <el-badge :value="newMsgNum" :show-zero="false">
                <el-icon :size="30" @click="handleClickMessageIcon()" class="clickable-icon">
                    <Message />
                </el-icon>
            </el-badge>
        </div>
    </div>
</template>

<style>
#nav-to-home{
    margin: 0 16px 0 8px;
}

.top-nav-right {
    display: flex;
}

.top-nav-right .nav-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    --avatar-size: 40px;
    --avatar-right-margin: 10px;
}

.top-nav-right .nav-main .to-login{
    width: var(--avatar-size);
    height: var(--avatar-size);
    margin-right: var(--avatar-right-margin);
}

.top-nav-right .nav-main .avatar-area {
    margin-right: var(--avatar-right-margin);
    cursor: pointer;
}

.top-nav-right .nav-main .nav-main-right .to-center {
    display: flex;
    column-gap: 8px;
}

.top-nav-right .nav-extra {
    margin-left: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-main-right {
    width: max-content;
}
.avatar-in-content{
    background-color: yellow
}
.top-nav-search{
    flex: 1;
    margin: 0 20px;
    max-width: 600px;
    z-index: 0;
}
.top-nav-search > .search-suggestion{
    position: absolute;
    top: 100%;
    width: 100%;
    border-radius: 0 0 4px 4px; 
    border: 1px solid grey;
    border-top: 0;
    box-shadow: 0 1px 1px gray;
    background-color: white;
    z-index: 1;
    display: flex;
    flex-direction: column;
}
.search-suggestion > .search-item{
    padding: 0 8px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #000;
    transition: background-color .3s;
}
.search-suggestion > .search-item:not(:last-child):hover{
    background-color: var(--el-color-primary-light-9);
    cursor: pointer;
}
.search-suggestion > .search-item:last-child{
    border-bottom: 0;
}
.search-suggestion > .search-item > .search-restaurant-rate{
    cursor: pointer;
}
.search-suggestion > .search-tip{
    width: 100%;
    text-align: center;
}
</style>